"""
FinRadar AI — Pydantic Schemas
All request/response models used across the API.
"""

from __future__ import annotations

from datetime import datetime
from typing import List, Literal, Optional

from pydantic import BaseModel, Field, HttpUrl, field_validator


# ──────────────────────────────────────────────
# Auth schemas
# ──────────────────────────────────────────────
class UserLogin(BaseModel):
    """Credentials payload for /auth/login."""

    username: str = Field(..., min_length=1, max_length=64, examples=["admin"])
    password: str = Field(..., min_length=1, max_length=128, examples=["finradar2026"])


class AuthToken(BaseModel):
    """JWT token response."""

    access_token: str
    token_type: str = "bearer"
    expires_in: int = Field(..., description="Seconds until expiry")


class UserInfo(BaseModel):
    """Current user information from JWT."""

    username: str
    role: str
    issued_at: datetime


# ──────────────────────────────────────────────
# Analysis schemas
# ──────────────────────────────────────────────
class AnalysisRequest(BaseModel):
    """Input for a combined analysis request."""

    url: Optional[str] = Field(None, description="Public URL of video/audio to analyse")
    file_path: Optional[str] = Field(None, description="Server-side path after upload")
    analysis_type: str = Field(
        "full",
        description="Analysis depth: 'full' | 'visual' | 'nlp'",
        pattern="^(full|visual|nlp)$",
    )

    @field_validator("url", "file_path", mode="before")
    @classmethod
    def at_least_one(cls, v, info):
        return v  # Cross-field check happens in the router


class FlaggedSegment(BaseModel):
    """A specific time-range in the media flagged as suspicious."""

    timestamp: float = Field(..., ge=0, description="Start time in seconds")
    duration: float = Field(..., gt=0, description="Duration of the segment in seconds")
    type: Literal["visual", "audio", "nlp"] = Field(
        ..., description="Category of the anomaly"
    )
    confidence: float = Field(..., ge=0.0, le=1.0, description="Detector confidence 0–1")
    description: str = Field(..., description="Human-readable explanation")


class AnalysisResult(BaseModel):
    """Full analysis result returned to the frontend."""

    task_id: str
    status: str = Field("completed", description="Task state")
    authenticity_score: float = Field(
        ..., ge=0.0, le=100.0, description="Overall score — 100 means fully authentic"
    )
    deepfake_probability: float = Field(..., ge=0.0, le=1.0)
    nlp_score: float = Field(..., ge=0.0, le=1.0, description="NLP manipulation score 0–1")
    visual_score: float = Field(..., ge=0.0, le=1.0, description="Visual manipulation score 0–1")
    risk_label: str = Field(
        ..., description="AUTHENTIC | SUSPICIOUS | HIGH_RISK | DEEPFAKE"
    )
    flagged_segments: List[FlaggedSegment] = Field(default_factory=list)
    transcript: Optional[str] = Field(None, description="Auto-generated transcript")
    financial_keywords_found: List[str] = Field(default_factory=list)
    processing_time: float = Field(..., description="Wall-clock seconds to process")
    created_at: datetime = Field(default_factory=datetime.utcnow)


class TaskStatus(BaseModel):
    """Lightweight status poll response."""

    task_id: str
    status: str = Field(..., description="queued | processing | completed | failed")
    progress: int = Field(..., ge=0, le=100, description="Percent complete")
    message: str


class UploadResponse(BaseModel):
    """Response after a file upload."""

    task_id: str
    filename: str
    file_path: str
    size_bytes: int
    message: str
