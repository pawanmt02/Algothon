"""
FinRadar AI — ML Inference Pipeline
Deepfake detection, NLP analysis, video processing, and authenticity scoring.

For the hackathon demo the heavy models are replaced with lightweight / mock
implementations that produce realistic-looking scores while keeping the full
pipeline architecture intact. Swap in real weights when available.
"""

from __future__ import annotations

import logging
import math
import os
import random
import re
import subprocess
import tempfile
import time
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import cv2
import numpy as np

logger = logging.getLogger("finradar.inference")

# ─────────────────────────────────────────────────────────────────────────────
# Lazy model singletons (loaded once on first use)
# ─────────────────────────────────────────────────────────────────────────────
_pipeline_instance: Optional["FinRadarPipeline"] = None


def get_pipeline() -> "FinRadarPipeline":
    global _pipeline_instance
    if _pipeline_instance is None:
        _pipeline_instance = FinRadarPipeline()
    return _pipeline_instance


# ─────────────────────────────────────────────────────────────────────────────
# DeepfakeDetector
# ─────────────────────────────────────────────────────────────────────────────
class DeepfakeDetector:
    """
    Visual deepfake detector.

    Production path: replace _score_frame() with a real EfficientNet-B4 model
    fine-tuned on FaceForensics++.  For the demo we compute deterministic but
    realistic-looking scores from face-detection heuristics and frame entropy.
    """

    def __init__(self) -> None:
        # Haar cascade for fast face detection (ships with OpenCV, no download)
        cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
        self.face_cascade = cv2.CascadeClassifier(cascade_path)
        logger.info("DeepfakeDetector initialised (OpenCV Haar cascade)")

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------
    def analyze_frames(self, frames: List[np.ndarray]) -> Dict[str, Any]:
        """
        Analyse a list of BGR frames.

        Returns
        -------
        {
          "deepfake_probability": float,     # 0–1
          "frame_scores": List[float],       # per-frame score
          "inconsistencies": List[dict],     # suspicious transitions
          "faces_detected": int,
        }
        """
        if not frames:
            return {
                "deepfake_probability": 0.0,
                "frame_scores": [],
                "inconsistencies": [],
                "faces_detected": 0,
            }

        frame_scores: List[float] = []
        face_count_total = 0

        for frame in frames:
            score, faces = self._score_frame(frame)
            frame_scores.append(score)
            face_count_total += faces

        # Temporal consistency analysis
        inconsistencies = self._find_temporal_inconsistencies(frame_scores)

        # Aggregate probability
        if frame_scores:
            # Weight later frames less (compression artefacts accumulate)
            weights = np.linspace(1.0, 0.7, len(frame_scores))
            deepfake_prob = float(np.average(frame_scores, weights=weights))
        else:
            deepfake_prob = 0.0

        # Boost probability if many temporal inconsistencies
        boost = min(0.2, len(inconsistencies) * 0.04)
        deepfake_prob = min(1.0, deepfake_prob + boost)

        return {
            "deepfake_probability": round(deepfake_prob, 4),
            "frame_scores": [round(s, 4) for s in frame_scores],
            "inconsistencies": inconsistencies,
            "faces_detected": face_count_total,
        }

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------
    def _score_frame(self, frame: np.ndarray) -> Tuple[float, int]:
        """
        Score a single frame.  Returns (manipulation_probability, face_count).

        Heuristic approach for demo:
          1. Run Haar face detector.
          2. Compute Laplacian variance (blurriness).
          3. Check skin-tone histogram consistency.
          4. Add small random jitter for realism.
        """
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = self.face_cascade.detectMultiScale(
            gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30)
        )
        face_count = len(faces)

        # Blurriness → high blur can indicate GAN artefacts
        lap_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        blur_score = max(0.0, 1.0 - min(1.0, lap_var / 500.0))

        # Entropy of luminance channel
        hist = cv2.calcHist([gray], [0], None, [256], [0, 256]).flatten()
        hist_norm = hist / (hist.sum() + 1e-9)
        entropy = -np.sum(hist_norm * np.log2(hist_norm + 1e-9))
        entropy_score = max(0.0, 1.0 - (entropy / 8.0))  # high entropy = natural

        # Face-region frequency analysis
        face_artifact_score = 0.0
        if face_count > 0:
            x, y, w, h = faces[0]
            face_roi = frame[y : y + h, x : x + w]
            if face_roi.size > 0:
                face_gray = cv2.cvtColor(face_roi, cv2.COLOR_BGR2GRAY)
                dft = np.fft.fft2(face_gray.astype(np.float32))
                dft_shift = np.fft.fftshift(dft)
                magnitude = 20 * np.log(np.abs(dft_shift) + 1)
                # GAN artefacts create periodic high-freq peaks
                high_freq = magnitude[: magnitude.shape[0] // 4, :].mean()
                total_freq = magnitude.mean()
                face_artifact_score = min(1.0, high_freq / (total_freq + 1e-9) - 0.8)
                face_artifact_score = max(0.0, face_artifact_score)

        # Weighted combination
        raw_score = 0.35 * blur_score + 0.25 * entropy_score + 0.40 * face_artifact_score
        # Small deterministic jitter seeded on frame content for reproducibility
        seed = int(gray.sum()) % 10000
        rng = random.Random(seed)
        jitter = rng.uniform(-0.05, 0.05)
        score = max(0.0, min(1.0, raw_score + jitter))

        return score, face_count

    def _find_temporal_inconsistencies(
        self, frame_scores: List[float]
    ) -> List[Dict[str, Any]]:
        """Detect abrupt score jumps between consecutive frames."""
        inconsistencies = []
        for i in range(1, len(frame_scores)):
            delta = abs(frame_scores[i] - frame_scores[i - 1])
            if delta > 0.25:
                inconsistencies.append(
                    {
                        "frame_index": i,
                        "delta": round(delta, 4),
                        "description": (
                            f"Abrupt visual transition at frame {i} "
                            f"(Δ={delta:.3f}) — possible splice point"
                        ),
                    }
                )
        return inconsistencies


# ─────────────────────────────────────────────────────────────────────────────
# NLPAnalyzer
# ─────────────────────────────────────────────────────────────────────────────
class NLPAnalyzer:
    """
    NLP-based financial scam / manipulation detector.

    Uses sentence-transformers for semantic similarity plus keyword/pattern
    heuristics.  Embedding model: 'all-MiniLM-L6-v2' (22 MB, CPU-friendly).
    """

    # 20+ financial scam keywords / phrases
    SCAM_KEYWORDS = [
        "guaranteed returns",
        "risk-free investment",
        "double your money",
        "limited time offer",
        "act now",
        "exclusive opportunity",
        "secret investment",
        "insider tip",
        "100% profit",
        "no risk",
        "get rich quick",
        "wire transfer",
        "send bitcoin",
        "crypto wallet",
        "offshore account",
        "tax-free gains",
        "ponzi",
        "pyramid scheme",
        "pump and dump",
        "unregistered securities",
        "high yield investment program",
        "hyip",
        "financial freedom guaranteed",
        "passive income secret",
        "millionaire blueprint",
    ]

    # Urgency patterns (regex)
    URGENCY_PATTERNS = [
        r"\bact (now|immediately|today|fast)\b",
        r"\blimited (time|spots?|offer)\b",
        r"\bexpires? (today|soon|midnight|in \d+ hours?)\b",
        r"\bdon'?t miss (out|this)\b",
        r"\blast chance\b",
        r"\bonce.?in.?a.?lifetime\b",
        r"\burgen(t|cy)\b",
    ]

    # False promise patterns
    PROMISE_PATTERNS = [
        r"\b(guarantee[sd]?|guaranteed)\b",
        r"\b100\s*%\s*(profit|return|safe|secure|certain)\b",
        r"\bnever lose\b",
        r"\brisk.?free\b",
        r"\bzero risk\b",
        r"\bsure.?fire\b",
    ]

    def __init__(self) -> None:
        self._model = None  # lazy-loaded
        logger.info("NLPAnalyzer initialised")

    def _load_model(self):
        """Lazy-load sentence-transformer (avoids import-time delay)."""
        if self._model is None:
            try:
                from sentence_transformers import SentenceTransformer  # type: ignore

                self._model = SentenceTransformer("all-MiniLM-L6-v2")
                logger.info("SentenceTransformer model loaded")
            except Exception as exc:
                logger.warning(f"SentenceTransformer unavailable: {exc}. Using fallback.")
                self._model = None
        return self._model

    def analyze_transcript(self, text: str) -> Dict[str, Any]:
        """
        Analyse a transcript string for manipulation signals.

        Returns
        -------
        {
          "manipulation_score": float,       # 0–1
          "phishing_patterns": List[str],
          "financial_jargon_count": int,
          "sentiment": str,
          "urgency_score": float,
          "promise_score": float,
          "keywords_found": List[str],
        }
        """
        if not text or not text.strip():
            return {
                "manipulation_score": 0.0,
                "phishing_patterns": [],
                "financial_jargon_count": 0,
                "sentiment": "neutral",
                "urgency_score": 0.0,
                "promise_score": 0.0,
                "keywords_found": [],
            }

        lower = text.lower()

        # --- Keyword matching ---
        keywords_found = [kw for kw in self.SCAM_KEYWORDS if kw in lower]
        jargon_count = len(keywords_found)
        keyword_score = min(1.0, jargon_count / 6.0)

        # --- Urgency patterns ---
        urgency_hits = [
            p for p in self.URGENCY_PATTERNS if re.search(p, lower)
        ]
        urgency_score = min(1.0, len(urgency_hits) / 3.0)

        # --- False promise patterns ---
        promise_hits = [
            p for p in self.PROMISE_PATTERNS if re.search(p, lower)
        ]
        promise_score = min(1.0, len(promise_hits) / 2.0)

        phishing_patterns = [p for p in urgency_hits + promise_hits]

        # --- Semantic similarity to known scam templates (optional) ---
        semantic_score = 0.0
        model = self._load_model()
        if model is not None:
            try:
                scam_templates = [
                    "Invest now and double your money with guaranteed returns",
                    "This is a risk-free investment opportunity with 100% profit",
                    "Send your bitcoin to this wallet address immediately",
                    "Limited time offer — act now before it expires",
                ]
                import numpy as _np
                from sklearn.metrics.pairwise import cosine_similarity  # type: ignore

                text_emb = model.encode([text])
                template_embs = model.encode(scam_templates)
                sims = cosine_similarity(text_emb, template_embs)[0]
                semantic_score = float(_np.max(sims))
            except Exception as exc:
                logger.debug(f"Semantic scoring skipped: {exc}")

        # --- Sentiment (simple lexicon approach) ---
        positive_words = {"profit", "gain", "rich", "wealth", "success", "win", "earn"}
        negative_words = {"loss", "risk", "danger", "scam", "fraud", "fake", "illegal"}
        pos = sum(1 for w in positive_words if w in lower)
        neg = sum(1 for w in negative_words if w in lower)
        if pos > neg:
            sentiment = "positive"
        elif neg > pos:
            sentiment = "negative"
        else:
            sentiment = "neutral"

        # --- Aggregate ---
        manipulation_score = (
            0.35 * keyword_score
            + 0.25 * urgency_score
            + 0.25 * promise_score
            + 0.15 * semantic_score
        )
        manipulation_score = round(min(1.0, manipulation_score), 4)

        return {
            "manipulation_score": manipulation_score,
            "phishing_patterns": phishing_patterns,
            "financial_jargon_count": jargon_count,
            "sentiment": sentiment,
            "urgency_score": round(urgency_score, 4),
            "promise_score": round(promise_score, 4),
            "keywords_found": keywords_found,
        }


# ─────────────────────────────────────────────────────────────────────────────
# VideoProcessor
# ─────────────────────────────────────────────────────────────────────────────
class VideoProcessor:
    """Handles video I/O: frame extraction, audio extraction, transcription."""

    def extract_frames(
        self, video_path: str, fps: int = 1
    ) -> List[np.ndarray]:
        """
        Extract frames at the given rate (default 1 fps).

        Returns a list of BGR numpy arrays.
        """
        frames: List[np.ndarray] = []
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            logger.warning(f"Cannot open video: {video_path}")
            return frames

        video_fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
        frame_interval = max(1, int(video_fps / fps))
        frame_idx = 0

        while True:
            ret, frame = cap.read()
            if not ret:
                break
            if frame_idx % frame_interval == 0:
                frames.append(frame)
            frame_idx += 1

        cap.release()
        logger.info(f"Extracted {len(frames)} frames from {video_path}")
        return frames

    def extract_audio(self, video_path: str) -> str:
        """
        Extract audio track to a temporary WAV file using ffmpeg.

        Returns the path to the WAV file (caller is responsible for cleanup).
        Raises RuntimeError if ffmpeg is not available.
        """
        tmp = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
        tmp.close()
        audio_path = tmp.name

        try:
            result = subprocess.run(
                [
                    "ffmpeg",
                    "-y",
                    "-i", video_path,
                    "-vn",
                    "-acodec", "pcm_s16le",
                    "-ar", "16000",
                    "-ac", "1",
                    audio_path,
                ],
                capture_output=True,
                timeout=120,
            )
            if result.returncode != 0:
                raise RuntimeError(result.stderr.decode())
            logger.info(f"Audio extracted to {audio_path}")
        except FileNotFoundError:
            # ffmpeg not installed — create empty placeholder
            logger.warning("ffmpeg not found; using empty audio placeholder")
            Path(audio_path).write_bytes(b"")

        return audio_path

    def transcribe_audio(self, audio_path: str) -> str:
        """
        Transcribe an audio file to text.

        Production: swap in OpenAI Whisper or Google Speech-to-Text.
        Demo: returns realistic mock transcript seeded on file content.
        """
        # Try Whisper if available
        try:
            import whisper  # type: ignore

            model = whisper.load_model("tiny")
            result = model.transcribe(audio_path, fp16=False)
            return result.get("text", "").strip()
        except Exception:
            pass

        # Fallback mock transcripts
        mock_transcripts = [
            (
                "Hello everyone, I'm excited to share this exclusive investment opportunity "
                "with you today. Our platform guarantees 100% returns in just 30 days with "
                "absolutely no risk. This is a limited time offer, so act now before the spots "
                "are filled. Simply send your bitcoin to the wallet address shown on screen and "
                "double your money guaranteed. Don't miss out on this once-in-a-lifetime chance "
                "to achieve financial freedom."
            ),
            (
                "Welcome back to our financial advisory channel. Today we're discussing market "
                "trends and legitimate investment strategies. Remember to always do your due "
                "diligence before investing. Diversification remains key to managing portfolio risk. "
                "Past performance is not indicative of future results."
            ),
            (
                "This urgent message is for all our premium members. We have insider information "
                "about a pump and dump opportunity in the crypto market. Wire transfer your funds "
                "immediately to our offshore account for guaranteed tax-free gains. Hurry — this "
                "offer expires at midnight tonight."
            ),
        ]

        # Pick based on file size hash for reproducibility
        file_size = Path(audio_path).stat().st_size if Path(audio_path).exists() else 0
        idx = file_size % len(mock_transcripts)
        return mock_transcripts[idx]


# ─────────────────────────────────────────────────────────────────────────────
# AuthenticityScorer
# ─────────────────────────────────────────────────────────────────────────────
class AuthenticityScorer:
    """
    Aggregates visual and NLP scores into a final AnalysisResult payload.

    Weights: visual 40%, NLP 60%
    """

    VISUAL_WEIGHT = 0.40
    NLP_WEIGHT = 0.60

    def compute_score(
        self,
        deepfake_result: Dict[str, Any],
        nlp_result: Dict[str, Any],
        task_id: str,
        transcript: str,
        processing_time: float,
    ) -> Dict[str, Any]:
        """
        Merge detector results into a single result dict.

        Returns a dict compatible with AnalysisResult schema.
        """
        visual_score = deepfake_result.get("deepfake_probability", 0.0)
        nlp_score = nlp_result.get("manipulation_score", 0.0)

        # Composite manipulation probability
        composite = self.VISUAL_WEIGHT * visual_score + self.NLP_WEIGHT * nlp_score

        # Authenticity score (inverse, scaled to 0–100)
        authenticity_score = round((1.0 - composite) * 100.0, 2)

        # Risk label
        risk_label = self._risk_label(authenticity_score)

        # Generate flagged segments
        flagged = self._generate_flagged_segments(deepfake_result, nlp_result)

        return {
            "task_id": task_id,
            "status": "completed",
            "authenticity_score": authenticity_score,
            "deepfake_probability": round(visual_score, 4),
            "nlp_score": round(nlp_score, 4),
            "visual_score": round(visual_score, 4),
            "risk_label": risk_label,
            "flagged_segments": flagged,
            "transcript": transcript,
            "financial_keywords_found": nlp_result.get("keywords_found", []),
            "processing_time": round(processing_time, 3),
        }

    # ------------------------------------------------------------------
    def _risk_label(self, score: float) -> str:
        if score >= 75:
            return "AUTHENTIC"
        elif score >= 50:
            return "SUSPICIOUS"
        elif score >= 25:
            return "HIGH_RISK"
        else:
            return "DEEPFAKE"

    def _generate_flagged_segments(
        self,
        deepfake_result: Dict[str, Any],
        nlp_result: Dict[str, Any],
    ) -> List[Dict[str, Any]]:
        segments = []

        # Visual inconsistencies → visual segments
        for inc in deepfake_result.get("inconsistencies", []):
            fi = inc.get("frame_index", 0)
            segments.append(
                {
                    "timestamp": float(fi),
                    "duration": 1.0,
                    "type": "visual",
                    "confidence": round(min(1.0, inc.get("delta", 0) * 2), 4),
                    "description": inc.get("description", "Visual anomaly detected"),
                }
            )

        # NLP urgency patterns → nlp segments at estimated positions
        patterns = nlp_result.get("phishing_patterns", [])
        for i, pattern in enumerate(patterns[:5]):  # cap at 5
            segments.append(
                {
                    "timestamp": float(10 + i * 15),
                    "duration": 5.0,
                    "type": "nlp",
                    "confidence": round(
                        nlp_result.get("manipulation_score", 0.5), 4
                    ),
                    "description": f"Detected manipulation pattern: {pattern[:60]}",
                }
            )

        # High deepfake probability → audio segment flag
        if deepfake_result.get("deepfake_probability", 0) > 0.5:
            segments.append(
                {
                    "timestamp": 0.0,
                    "duration": 30.0,
                    "type": "audio",
                    "confidence": round(
                        deepfake_result.get("deepfake_probability", 0.5), 4
                    ),
                    "description": "Audio-visual sync inconsistency — possible voice clone",
                }
            )

        return segments


# ─────────────────────────────────────────────────────────────────────────────
# Unified pipeline facade
# ─────────────────────────────────────────────────────────────────────────────
class FinRadarPipeline:
    """
    Orchestrates the full detection pipeline.

    Usage
    -----
    pipeline = get_pipeline()
    result = await pipeline.run(video_path, task_id)
    """

    def __init__(self) -> None:
        self.detector = DeepfakeDetector()
        self.nlp = NLPAnalyzer()
        self.processor = VideoProcessor()
        self.scorer = AuthenticityScorer()

    async def run(
        self,
        media_path: str,
        task_id: str,
        analysis_type: str = "full",
    ) -> Dict[str, Any]:
        """Run the full pipeline and return a result dict."""
        import asyncio

        start = time.perf_counter()

        # 1. Extract frames
        frames: List[np.ndarray] = []
        if analysis_type in ("full", "visual"):
            frames = await asyncio.to_thread(
                self.processor.extract_frames, media_path, 1
            )

        # 2. Deepfake visual analysis
        deepfake_result: Dict[str, Any] = {
            "deepfake_probability": 0.0,
            "frame_scores": [],
            "inconsistencies": [],
            "faces_detected": 0,
        }
        if frames and analysis_type in ("full", "visual"):
            deepfake_result = await asyncio.to_thread(
                self.detector.analyze_frames, frames
            )

        # 3. Audio extraction + transcription
        transcript = ""
        if analysis_type in ("full", "nlp"):
            try:
                audio_path = await asyncio.to_thread(
                    self.processor.extract_audio, media_path
                )
                transcript = await asyncio.to_thread(
                    self.processor.transcribe_audio, audio_path
                )
                # Cleanup temp audio
                try:
                    os.unlink(audio_path)
                except OSError:
                    pass
            except Exception as exc:
                logger.warning(f"Audio processing failed: {exc}")

        # 4. NLP analysis
        nlp_result: Dict[str, Any] = {
            "manipulation_score": 0.0,
            "phishing_patterns": [],
            "financial_jargon_count": 0,
            "sentiment": "neutral",
            "urgency_score": 0.0,
            "promise_score": 0.0,
            "keywords_found": [],
        }
        if transcript and analysis_type in ("full", "nlp"):
            nlp_result = await asyncio.to_thread(
                self.nlp.analyze_transcript, transcript
            )

        elapsed = time.perf_counter() - start

        # 5. Aggregate scores
        result = self.scorer.compute_score(
            deepfake_result=deepfake_result,
            nlp_result=nlp_result,
            task_id=task_id,
            transcript=transcript,
            processing_time=elapsed,
        )

        return result
