"""
FinRadar AI — Auth Router
JWT-based authentication: login, token refresh, and /me endpoint.
"""

from __future__ import annotations

import logging
import os
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import bcrypt
from jose import JWTError, jwt

from models.schemas import AuthToken, UserInfo, UserLogin

logger = logging.getLogger("finradar.auth")

router = APIRouter()

# ──────────────────────────────────────────────
# Config (read from env, with safe defaults)
# ──────────────────────────────────────────────
JWT_SECRET: str = os.getenv("FINRADAR_JWT_SECRET", "finradar-dev-secret-change-in-prod")
JWT_ALGORITHM: str = "HS256"
JWT_EXPIRE_MINUTES: int = int(os.getenv("FINRADAR_JWT_EXPIRE_MINUTES", "60"))

def _hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def _verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))

_DEMO_USERS: Dict[str, Dict[str, str]] = {
    "admin": {
        "username": "admin",
        "hashed_password": _hash_password("finradar2026"),
        "role": "admin",
    },
    "demo": {
        "username": "demo",
        "hashed_password": _hash_password("demo1234"),
        "role": "viewer",
    },
}

# ──────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────
security = HTTPBearer(auto_error=False)


def _create_token(username: str, role: str, expires_delta: Optional[timedelta] = None) -> str:
    now = datetime.now(timezone.utc)
    expire = now + (expires_delta or timedelta(minutes=JWT_EXPIRE_MINUTES))
    payload = {
        "sub": username,
        "role": role,
        "iat": int(now.timestamp()),
        "exp": expire,
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def _decode_token(token: str) -> Dict[str, Any]:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired token: {exc}",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> Dict[str, Any]:
    """FastAPI dependency — extract and validate Bearer token."""
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return _decode_token(credentials.credentials)


# ──────────────────────────────────────────────
# Endpoints
# ──────────────────────────────────────────────
@router.post(
    "/register",
    response_model=AuthToken,
    summary="Register a new user account",
    status_code=status.HTTP_201_CREATED,
)
async def register(body: UserLogin):
    """
    Create a new user account and return a valid JWT access token.
    """
    if body.username in _DEMO_USERS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists",
        )

    hashed = _hash_password(body.password)
    _DEMO_USERS[body.username] = {
        "username": body.username,
        "hashed_password": hashed,
        "role": "analyst",
    }

    token = _create_token(body.username, "analyst")
    logger.info(f"New user account '{body.username}' registered successfully")

    return AuthToken(
        access_token=token,
        token_type="bearer",
        expires_in=JWT_EXPIRE_MINUTES * 60,
    )


@router.post(
    "/login",
    response_model=AuthToken,
    summary="Obtain JWT access token",
)
async def login(body: UserLogin):
    """
    Authenticate with username & password.

    **Demo credentials** — `admin` / `finradar2026`
    Returns a Bearer token valid for `FINRADAR_JWT_EXPIRE_MINUTES` minutes.
    """
    user = _DEMO_USERS.get(body.username)
    if user is None or not _verify_password(body.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = _create_token(user["username"], user["role"])
    logger.info(f"User '{body.username}' logged in successfully")

    return AuthToken(
        access_token=token,
        token_type="bearer",
        expires_in=JWT_EXPIRE_MINUTES * 60,
    )


@router.get(
    "/me",
    response_model=UserInfo,
    summary="Get current user info",
)
async def me(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Return the authenticated user's information decoded from the JWT."""
    return UserInfo(
        username=current_user["sub"],
        role=current_user.get("role", "viewer"),
        issued_at=datetime.fromtimestamp(current_user["iat"], tz=timezone.utc),
    )


@router.post(
    "/refresh",
    response_model=AuthToken,
    summary="Refresh JWT token",
)
async def refresh(current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Issue a fresh token using the existing (still-valid) Bearer token.
    No credentials re-entry required.
    """
    username = current_user["sub"]
    role = current_user.get("role", "viewer")
    new_token = _create_token(username, role)
    logger.info(f"Token refreshed for user '{username}'")

    return AuthToken(
        access_token=new_token,
        token_type="bearer",
        expires_in=JWT_EXPIRE_MINUTES * 60,
    )
