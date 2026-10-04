"""
FinRadar AI — Media Processing Utilities
Download, validate, inspect, and clean up media files.
"""

from __future__ import annotations

import logging
import mimetypes
import os
import tempfile
from pathlib import Path
from typing import Any, Dict
from urllib.parse import urlparse

import cv2
import httpx

logger = logging.getLogger("finradar.media")

# Accepted video MIME types / extensions
VALID_VIDEO_EXTENSIONS = {".mp4", ".avi", ".mov", ".mkv", ".webm", ".flv", ".wmv", ".m4v"}
VALID_AUDIO_EXTENSIONS = {".mp3", ".wav", ".aac", ".ogg", ".flac", ".m4a"}
VALID_EXTENSIONS = VALID_VIDEO_EXTENSIONS | VALID_AUDIO_EXTENSIONS


def download_from_url(url: str, timeout_seconds: int = 60) -> str:
    """
    Download media from *url* to a temporary file.

    Parameters
    ----------
    url : str
        Publicly accessible URL (http/https).
    timeout_seconds : int
        Request timeout (connect + read).

    Returns
    -------
    str
        Absolute path of the downloaded temporary file.

    Raises
    ------
    ValueError
        If the URL scheme is not http/https.
    httpx.HTTPError
        On network or HTTP errors.
    """
    parsed = urlparse(url)
    if parsed.scheme not in ("http", "https"):
        raise ValueError(f"Unsupported URL scheme: {parsed.scheme!r}")

    # Guess extension from URL path
    url_path = Path(parsed.path)
    suffix = url_path.suffix if url_path.suffix in VALID_EXTENSIONS else ".mp4"

    tmp = tempfile.NamedTemporaryFile(suffix=suffix, delete=False)
    tmp_path = tmp.name

    try:
        with httpx.stream(
            "GET",
            url,
            timeout=timeout_seconds,
            follow_redirects=True,
            headers={"User-Agent": "FinRadarAI/1.0"},
        ) as response:
            response.raise_for_status()
            for chunk in response.iter_bytes(chunk_size=1024 * 512):
                tmp.write(chunk)
        tmp.close()
        logger.info(f"Downloaded media to {tmp_path} ({os.path.getsize(tmp_path)} bytes)")
        return tmp_path

    except Exception:
        tmp.close()
        cleanup_temp_file(tmp_path)
        raise


def validate_video_format(file_path: str) -> bool:
    """
    Return True if *file_path* is a readable video/audio file.

    Checks:
    1. Extension is in the allowed set.
    2. OpenCV can open the file (for video) or the file exists (for audio).
    """
    path = Path(file_path)
    if not path.exists():
        return False

    ext = path.suffix.lower()
    if ext not in VALID_EXTENSIONS:
        return False

    if ext in VALID_AUDIO_EXTENSIONS:
        return path.stat().st_size > 0

    # Video — try to open with OpenCV
    cap = cv2.VideoCapture(str(path))
    is_valid = cap.isOpened()
    cap.release()
    return is_valid


def get_video_metadata(file_path: str) -> Dict[str, Any]:
    """
    Extract metadata from a video file.

    Returns
    -------
    dict with keys: duration (s), width, height, fps, codec, file_size_mb
    """
    path = Path(file_path)
    if not path.exists():
        return {"error": "File not found"}

    cap = cv2.VideoCapture(str(path))
    if not cap.isOpened():
        return {"error": "Cannot open file with OpenCV"}

    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_count = cap.get(cv2.CAP_PROP_FRAME_COUNT)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fourcc_int = int(cap.get(cv2.CAP_PROP_FOURCC))
    codec = "".join(chr((fourcc_int >> (8 * i)) & 0xFF) for i in range(4)).strip()
    cap.release()

    duration = (frame_count / fps) if fps > 0 else 0.0
    file_size_mb = round(path.stat().st_size / (1024 * 1024), 2)

    return {
        "duration": round(duration, 2),
        "width": width,
        "height": height,
        "fps": round(fps, 2),
        "frame_count": int(frame_count),
        "codec": codec,
        "resolution": f"{width}x{height}",
        "file_size_mb": file_size_mb,
    }


def cleanup_temp_file(file_path: str) -> None:
    """
    Safely delete a temporary file.  Silently ignores errors (file may already
    be gone or the path may be non-temp).
    """
    try:
        path = Path(file_path)
        if path.exists() and path.is_file():
            path.unlink()
            logger.debug(f"Cleaned up temp file: {file_path}")
    except OSError as exc:
        logger.debug(f"Could not delete {file_path}: {exc}")
