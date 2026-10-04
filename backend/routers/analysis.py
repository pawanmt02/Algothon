"""
FinRadar AI — Analysis Router
Handles media upload, URL submission, task polling, and synchronous analysis.
"""

from __future__ import annotations

import asyncio
import logging
import os
import tempfile
import uuid
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Optional

from fastapi import (
    APIRouter,
    BackgroundTasks,
    File,
    Form,
    HTTPException,
    Request,
    UploadFile,
    status,
)
from fastapi.responses import JSONResponse

from models.inference import get_pipeline
from models.schemas import (
    AnalysisRequest,
    AnalysisResult,
    FlaggedSegment,
    TaskStatus,
    UploadResponse,
)
from utils.media import (
    cleanup_temp_file,
    download_from_url,
    get_video_metadata,
    validate_video_format,
)
from utils.scoring import format_analysis_report

logger = logging.getLogger("finradar.analysis")

router = APIRouter()

# ──────────────────────────────────────────────
# In-memory task store  (swap for Redis in prod)
# ──────────────────────────────────────────────
results_store: Dict[str, Dict[str, Any]] = {}


# ──────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────
def _new_task(file_path: str, analysis_type: str = "full") -> str:
    task_id = str(uuid.uuid4())
    results_store[task_id] = {
        "status": "queued",
        "progress": 0,
        "message": "Task queued",
        "file_path": file_path,
        "analysis_type": analysis_type,
        "result": None,
        "created_at": datetime.utcnow().isoformat(),
    }
    return task_id


async def _run_analysis(task_id: str) -> None:
    """Background task: run pipeline and update results_store."""
    entry = results_store.get(task_id)
    if not entry:
        return

    file_path = entry["file_path"]
    analysis_type = entry.get("analysis_type", "full")

    try:
        results_store[task_id].update({"status": "processing", "progress": 10, "message": "Starting analysis"})

        pipeline = get_pipeline()

        results_store[task_id].update({"progress": 30, "message": "Extracting frames"})
        raw = await pipeline.run(file_path, task_id, analysis_type)

        results_store[task_id].update({"progress": 90, "message": "Computing scores"})

        # Build validated result
        flagged = [FlaggedSegment(**seg) for seg in raw.get("flagged_segments", [])]
        result = AnalysisResult(
            **{k: v for k, v in raw.items() if k != "flagged_segments"},
            flagged_segments=flagged,
        )

        results_store[task_id].update(
            {
                "status": "completed",
                "progress": 100,
                "message": "Analysis complete",
                "result": result.model_dump(),
            }
        )

    except Exception as exc:
        logger.exception(f"Analysis failed for task {task_id}: {exc}")
        results_store[task_id].update(
            {"status": "failed", "progress": 0, "message": str(exc)}
        )
    finally:
        # Cleanup temp file
        cleanup_temp_file(file_path)


# ──────────────────────────────────────────────
# Endpoints
# ──────────────────────────────────────────────
@router.post(
    "/upload",
    response_model=UploadResponse,
    summary="Upload a media file",
    status_code=status.HTTP_201_CREATED,
)
async def upload_file(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(..., description="Video or audio file to analyse"),
    analysis_type: str = Form("full"),
):
    """
    Upload a video/audio file.  Returns a `task_id` to poll for status/result.
    Max file size is governed by `MAX_FILE_SIZE_MB` env var (default 500 MB).
    """
    max_mb = int(os.getenv("MAX_FILE_SIZE_MB", "500"))
    max_bytes = max_mb * 1024 * 1024

    # Save to temp file
    suffix = Path(file.filename or "upload").suffix or ".mp4"
    tmp = tempfile.NamedTemporaryFile(suffix=suffix, delete=False)
    try:
        size = 0
        while chunk := await file.read(1024 * 1024):  # 1 MB chunks
            size += len(chunk)
            if size > max_bytes:
                tmp.close()
                os.unlink(tmp.name)
                raise HTTPException(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    detail=f"File exceeds {max_mb} MB limit",
                )
            tmp.write(chunk)
        tmp.close()
    except HTTPException:
        raise
    except Exception as exc:
        tmp.close()
        cleanup_temp_file(tmp.name)
        raise HTTPException(status_code=500, detail=f"Upload failed: {exc}")

    task_id = _new_task(tmp.name, analysis_type)
    background_tasks.add_task(_run_analysis, task_id)

    return UploadResponse(
        task_id=task_id,
        filename=file.filename or "upload",
        file_path=tmp.name,
        size_bytes=size,
        message="File uploaded. Use /status/{task_id} to poll or /result/{task_id} once complete.",
    )


@router.post(
    "/analyze/url",
    response_model=TaskStatus,
    summary="Submit a URL for analysis",
    status_code=status.HTTP_202_ACCEPTED,
)
@router.post(
    "/analyze-url",
    response_model=TaskStatus,
    summary="Submit a URL for analysis (alias)",
    status_code=status.HTTP_202_ACCEPTED,
)
async def analyze_url(
    request: AnalysisRequest,
    background_tasks: BackgroundTasks,
):
    """
    Submit a public URL.  Media is downloaded in the background.
    Returns `task_id` immediately.
    """
    if not request.url:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="url field is required for this endpoint",
        )

    # Download first (fast, small files) — for large files move inside bg task
    try:
        file_path = await asyncio.to_thread(download_from_url, request.url)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to download media: {exc}",
        )

    task_id = _new_task(file_path, request.analysis_type)
    background_tasks.add_task(_run_analysis, task_id)

    return TaskStatus(
        task_id=task_id,
        status="queued",
        progress=0,
        message="Media downloaded. Analysis queued.",
    )


@router.get(
    "/status/{task_id}",
    response_model=TaskStatus,
    summary="Poll task progress",
)
async def get_status(task_id: str):
    """Return current processing status and progress percentage."""
    entry = results_store.get(task_id)
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task {task_id} not found",
        )
    return TaskStatus(
        task_id=task_id,
        status=entry["status"],
        progress=entry["progress"],
        message=entry["message"],
    )


@router.get(
    "/result/{task_id}",
    response_model=AnalysisResult,
    summary="Fetch full analysis result",
)
async def get_result(task_id: str):
    """Retrieve the completed AnalysisResult.  Returns 202 if still processing."""
    entry = results_store.get(task_id)
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task {task_id} not found",
        )

    if entry["status"] == "processing" or entry["status"] == "queued":
        return JSONResponse(
            status_code=status.HTTP_202_ACCEPTED,
            content={
                "task_id": task_id,
                "status": entry["status"],
                "progress": entry["progress"],
                "message": entry["message"],
            },
        )

    if entry["status"] == "failed":
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=entry.get("message", "Analysis failed"),
        )

    return AnalysisResult(**entry["result"])


@router.post(
    "/analyze",
    response_model=AnalysisResult,
    summary="Synchronous combined analysis (demo mode)",
    status_code=status.HTTP_200_OK,
)
async def analyze_sync(
    file: Optional[UploadFile] = File(None),
    url: Optional[str] = Form(None),
    analysis_type: str = Form("full"),
):
    """
    Combined endpoint — accepts either a file upload **or** a URL.
    Runs the full pipeline synchronously and returns the result immediately.
    Ideal for hackathon demos where you don't want to poll.
    """
    if file is None and not url:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Provide either a file upload or a url parameter",
        )

    # Acquire media path
    file_path: str
    if file is not None:
        suffix = Path(file.filename or "upload").suffix or ".mp4"
        tmp = tempfile.NamedTemporaryFile(suffix=suffix, delete=False)
        try:
            content = await file.read()
            tmp.write(content)
            tmp.close()
            file_path = tmp.name
        except Exception as exc:
            tmp.close()
            cleanup_temp_file(tmp.name)
            raise HTTPException(status_code=500, detail=f"Upload failed: {exc}")
    else:
        try:
            file_path = await asyncio.to_thread(download_from_url, url)
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to download media: {exc}",
            )

    task_id = str(uuid.uuid4())

    try:
        pipeline = get_pipeline()
        raw = await pipeline.run(file_path, task_id, analysis_type)

        flagged = [FlaggedSegment(**seg) for seg in raw.get("flagged_segments", [])]
        result = AnalysisResult(
            **{k: v for k, v in raw.items() if k != "flagged_segments"},
            flagged_segments=flagged,
        )

        # Store for later retrieval
        results_store[task_id] = {
            "status": "completed",
            "progress": 100,
            "message": "Analysis complete",
            "result": result.model_dump(),
            "file_path": file_path,
            "analysis_type": analysis_type,
            "created_at": datetime.utcnow().isoformat(),
        }

        return result

    except Exception as exc:
        logger.exception(f"Synchronous analysis failed: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )
    finally:
        cleanup_temp_file(file_path)
