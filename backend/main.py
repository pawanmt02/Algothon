"""
FinRadar AI — Deepfake & Financial Fraud Detection
Main FastAPI Application
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from routers import analysis, auth

# ──────────────────────────────────────────────
# Logging
# ──────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger("finradar")

# ──────────────────────────────────────────────
# Rate limiter (shared across routers)
# ──────────────────────────────────────────────
limiter = Limiter(key_func=get_remote_address, default_limits=["200/minute"])


# ──────────────────────────────────────────────
# Lifespan
# ──────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    logger.info("🚀 FinRadar AI backend starting up …")
    # Pre-warm ML pipeline on startup
    try:
        from models.inference import get_pipeline
        pipeline = get_pipeline()
        logger.info("✅ ML pipeline loaded successfully")
    except Exception as exc:
        logger.warning(f"⚠️  ML pipeline warm-up skipped: {exc}")
    yield
    logger.info("🛑 FinRadar AI backend shutting down …")


# ──────────────────────────────────────────────
# App instance
# ──────────────────────────────────────────────
app = FastAPI(
    title="FinRadar AI",
    description=(
        "Deepfake & Financial Fraud Detection API — "
        "Analyse videos and audio for manipulation signals, "
        "NLP-based scam patterns, and authenticity scoring."
    ),
    version="1.0.0",
    contact={"name": "FinRadar Team", "email": "team@finradar.ai"},
    license_info={"name": "MIT"},
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# ──────────────────────────────────────────────
# Middleware
# ──────────────────────────────────────────────
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # Open for hackathon; restrict in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ──────────────────────────────────────────────
# Exception handlers
# ──────────────────────────────────────────────
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": exc.errors(),
            "message": "Request validation failed. Check your input.",
        },
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled exception on {request.url}: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error", "message": str(exc)},
    )


# ──────────────────────────────────────────────
# Routers
# ──────────────────────────────────────────────
app.include_router(analysis.router, prefix="/api/v1/analysis", tags=["Analysis"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])


# ──────────────────────────────────────────────
# Health check
# ──────────────────────────────────────────────
@app.get("/health", tags=["Health"])
@limiter.limit("60/minute")
async def health_check(request: Request):
    """Liveness probe — confirms the service is running."""
    return {
        "status": "healthy",
        "service": "FinRadar AI",
        "version": "1.0.0",
    }


@app.get("/", tags=["Health"])
async def root():
    """Root redirect hint."""
    return {
        "message": "Welcome to FinRadar AI. See /docs for the API reference.",
        "docs": "/docs",
        "health": "/health",
    }
