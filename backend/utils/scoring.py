"""
FinRadar AI — Authenticity Scoring Utilities
Score computation, risk labelling, and report formatting.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List

from models.schemas import AnalysisResult


# ──────────────────────────────────────────────
# Score computation
# ──────────────────────────────────────────────
_VISUAL_WEIGHT = 0.40
_NLP_WEIGHT = 0.60


def compute_authenticity_score(visual: float, nlp: float) -> float:
    """
    Compute overall authenticity score (0–100).

    Parameters
    ----------
    visual : float
        Deepfake / visual manipulation probability (0–1).  Higher = more fake.
    nlp : float
        NLP manipulation score (0–1).  Higher = more suspicious language.

    Returns
    -------
    float
        Authenticity score in [0, 100].  100 = fully authentic, 0 = clear fake.
    """
    composite_manipulation = _VISUAL_WEIGHT * visual + _NLP_WEIGHT * nlp
    authenticity = (1.0 - composite_manipulation) * 100.0
    return round(max(0.0, min(100.0, authenticity)), 2)


# ──────────────────────────────────────────────
# Risk labelling
# ──────────────────────────────────────────────
def generate_risk_label(score: float) -> str:
    """
    Map an authenticity score to a human-readable risk label.

    Thresholds
    ----------
    ≥ 75  → AUTHENTIC
    ≥ 50  → SUSPICIOUS
    ≥ 25  → HIGH_RISK
    < 25  → DEEPFAKE
    """
    if score >= 75:
        return "AUTHENTIC"
    elif score >= 50:
        return "SUSPICIOUS"
    elif score >= 25:
        return "HIGH_RISK"
    else:
        return "DEEPFAKE"


# ──────────────────────────────────────────────
# Report formatting
# ──────────────────────────────────────────────
def format_analysis_report(result: AnalysisResult) -> Dict[str, Any]:
    """
    Convert an AnalysisResult into a frontend-friendly dict.

    Includes computed fields:
    - risk_color: hex colour for the UI badge
    - summary_text: one-sentence verdict
    - flagged_count: number of flagged segments
    - timestamp_formatted: human-readable creation time
    """
    risk_colors = {
        "AUTHENTIC": "#22c55e",   # green-500
        "SUSPICIOUS": "#f59e0b",  # amber-500
        "HIGH_RISK": "#ef4444",   # red-500
        "DEEPFAKE": "#7f1d1d",    # red-900
    }

    risk_label = result.risk_label
    risk_color = risk_colors.get(risk_label, "#6b7280")

    # One-sentence summary
    if risk_label == "AUTHENTIC":
        summary = (
            f"Content appears authentic with a {result.authenticity_score:.1f}% "
            "authenticity score. No significant manipulation detected."
        )
    elif risk_label == "SUSPICIOUS":
        summary = (
            f"Content shows some suspicious signals (score {result.authenticity_score:.1f}%). "
            "Manual review recommended."
        )
    elif risk_label == "HIGH_RISK":
        summary = (
            f"High risk of manipulation detected (score {result.authenticity_score:.1f}%). "
            "This content likely contains deceptive elements."
        )
    else:
        summary = (
            f"Strong deepfake indicators detected (score {result.authenticity_score:.1f}%). "
            "This content is very likely AI-generated or manipulated."
        )

    # Component breakdown for chart
    component_scores = {
        "visual_authenticity": round((1.0 - result.visual_score) * 100, 1),
        "nlp_authenticity": round((1.0 - result.nlp_score) * 100, 1),
        "overall": result.authenticity_score,
    }

    # Flagged segments grouped by type
    segments_by_type: Dict[str, List[Dict]] = {"visual": [], "audio": [], "nlp": []}
    for seg in result.flagged_segments:
        seg_dict = seg.model_dump()
        segments_by_type[seg.type].append(seg_dict)

    return {
        "task_id": result.task_id,
        "risk_label": risk_label,
        "risk_color": risk_color,
        "authenticity_score": result.authenticity_score,
        "deepfake_probability": result.deepfake_probability,
        "summary_text": summary,
        "component_scores": component_scores,
        "flagged_count": len(result.flagged_segments),
        "flagged_segments_by_type": segments_by_type,
        "financial_keywords_found": result.financial_keywords_found,
        "transcript_preview": (
            result.transcript[:300] + "…"
            if result.transcript and len(result.transcript) > 300
            else result.transcript
        ),
        "processing_time_s": result.processing_time,
        "created_at": result.created_at.isoformat(),
        "timestamp_formatted": result.created_at.strftime("%Y-%m-%d %H:%M UTC"),
    }
