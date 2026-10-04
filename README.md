# 🛡️ FinRadar AI — Deepfake & Financial Fraud Detection Engine

> **ALGOTHON 26** | Team: **Pawan Kumar M T & Sachin M S**  
> Submission Deadline: October 4, 2026, 10:00 PM IST

---

## 🚀 Overview

**FinRadar AI** is a real-time, low-latency verification engine that analyzes multimodal content to detect AI-manipulated media and flag fraudulent financial claims in regional short-form vertical videos.

### 🎯 Key Capabilities

| Module | Technology | Function |
|---|---|---|
| **Visual Forensics** | PyTorch + OpenCV | Frame-level deepfake detection via facial mesh analysis |
| **Semantic NLP** | Sentence Transformers | Financial scam jargon & phishing pattern detection |
| **Authenticity Scoring** | Custom Heuristic Engine | Unified 0–100 score with time-stamped flag breakdown |
| **Frontend Dashboard** | Next.js 15 + Framer Motion | Animated, responsive UI for real-time analysis visualization |
| **Backend API** | FastAPI + JWT | Concurrent request handling with async ML inference |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   User (Browser)                     │
│         Next.js 15 + React + Tailwind CSS            │
│            (Vercel Edge Deployment)                  │
└────────────────────┬────────────────────────────────┘
                     │ HTTPS / REST API
┌────────────────────▼────────────────────────────────┐
│               FastAPI Backend                        │
│          JWT Auth + Zero-Trust Layer                 │
│     ┌─────────────────────────────────────────┐     │
│     │         ML Inference Pipeline           │     │
│     │  ┌──────────────┐  ┌────────────────┐  │     │
│     │  │ DeepfakeDetect│  │  NLP Analyzer  │  │     │
│     │  │ EfficientNet  │  │ Sentence-Trans │  │     │
│     │  │ + OpenCV Face │  │ + Scam Lexicon │  │     │
│     │  └──────────────┘  └────────────────┘  │     │
│     │         Authenticity Scorer (0-100)     │     │
│     └─────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────┘
```

---

## 📦 Project Structure

```
Algothon/
├── README.md
├── frontend/              # Next.js 15 Application
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # Animated UI components
│   │   ├── lib/           # API client, types, utils
│   │   └── hooks/         # Custom React hooks
│   ├── package.json
│   └── tailwind.config.ts
└── backend/               # FastAPI Backend
    ├── main.py
    ├── routers/
    │   ├── analysis.py
    │   └── auth.py
    ├── models/
    │   ├── inference.py
    │   └── schemas.py
    ├── utils/
    │   ├── media.py
    │   └── scoring.py
    ├── requirements.txt
    └── Dockerfile
```

---

## 🛠️ Setup & Running

### Prerequisites
- Python 3.12+
- Node.js 20+
- npm / pnpm

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
.\venv\Scripts\activate   # Windows
# source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your API keys

# Run development server
uvicorn main:app --reload --port 8000
```

API docs available at: http://localhost:8000/docs

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local

# Run development server
npm run dev
```

App available at: http://localhost:3000

---

## 🔌 API Reference

### Analysis Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/analysis/analyze` | Upload & analyze video (file or URL) |
| `POST` | `/api/v1/analysis/upload` | Upload video file |
| `GET` | `/api/v1/analysis/status/{task_id}` | Get processing status |
| `GET` | `/api/v1/analysis/result/{task_id}` | Get full analysis result |

### Auth Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/auth/login` | Get JWT token |
| `GET` | `/api/v1/auth/me` | Get current user |

### Demo Credentials
- **Username**: `admin`
- **Password**: `finradar2026`

---

## 🧠 ML Pipeline

### Deepfake Detection (Visual Forensics)
1. Extract frames at 1 FPS from video
2. Detect faces using OpenCV Haar cascades
3. Analyze temporal inconsistencies between frames
4. Score facial mesh rendering artifacts (lip sync, eye blink patterns)
5. Return deepfake probability with per-frame breakdown

### Financial Fraud NLP
1. Extract audio → transcribe to text
2. Embed transcript using `all-MiniLM-L6-v2` Sentence Transformer
3. Match against 20+ scam keyword patterns (urgency, guaranteed returns, UPI scams)
4. Score manipulation probability
5. Flag specific segments with timestamps

### Authenticity Score
```
Score = (Visual_Score × 0.40) + (NLP_Score × 0.60)

Risk Levels:
  80–100: ✅ AUTHENTIC
  50–79:  ⚠️ SUSPICIOUS  
  20–49:  🔴 HIGH_RISK
  0–19:   💀 DEEPFAKE
```

---

## 🚀 Deployment

### Vercel (Frontend)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod
```

Set environment variable: `NEXT_PUBLIC_API_URL=https://your-backend.railway.app`

### Railway / Render (Backend)
```bash
# Dockerfile provided for containerized deployment
docker build -t finradar-backend .
docker run -p 8000:8000 finradar-backend
```

---

## 🏆 Hackathon Context

- **Event**: ALGOTHON 26
- **Team**: Pawan Kumar M T & Sachin M S
- **Problem Domain**: Synthetic media detection in regional financial scam videos
- **Target Format**: 1080×1920 vertical short-form videos
- **Latency Goal**: < 10ms per frame for real-time analysis

---

## 📄 License

MIT License — Built for ALGOTHON 26
