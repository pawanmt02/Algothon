import type { AnalysisResult, RiskLevel } from './types';

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  ANALYZE_FILE: '/api/v1/analysis/analyze',
  ANALYZE_URL: '/api/v1/analysis/analyze-url',
  TASK_STATUS: (id: string) => `/api/v1/analysis/status/${id}`,
  TASK_RESULT: (id: string) => `/api/v1/analysis/result/${id}`,
  LOGIN: '/api/v1/auth/login',
};

export const RISK_THRESHOLDS: Record<RiskLevel, [number, number]> = {
  AUTHENTIC: [75, 100],
  SUSPICIOUS: [50, 74],
  HIGH_RISK: [25, 49],
  DEEPFAKE: [0, 24],
};

export const RISK_COLORS: Record<RiskLevel, string> = {
  AUTHENTIC: '#00ff88',
  SUSPICIOUS: '#ffcc00',
  HIGH_RISK: '#ff8c00',
  DEEPFAKE: '#ff3366',
};

export const RISK_BG_COLORS: Record<RiskLevel, string> = {
  AUTHENTIC: 'rgba(0, 255, 136, 0.1)',
  SUSPICIOUS: 'rgba(255, 204, 0, 0.1)',
  HIGH_RISK: 'rgba(255, 140, 0, 0.1)',
  DEEPFAKE: 'rgba(255, 51, 102, 0.1)',
};

export const SCAN_KEYWORDS = [
  'guaranteed returns',
  'risk free',
  'no risk',
  '100% profit',
  'secret investment',
  'exclusive opportunity',
  'limited time',
  'send money',
  'UPI',
  'WhatsApp group',
  'join now',
  'double money',
  'triple returns',
  'crypto guaranteed',
  'forex tips',
  'insider trading',
  'pump and dump',
  'get rich quick',
  'financial freedom fast',
  'instant profit',
];

export const ANIMATION_DURATION = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  verySlow: 0.8,
};

export const MOCK_ANALYSIS: AnalysisResult = {
  task_id: 'demo-001',
  status: 'completed',
  authenticity_score: 23.4,
  deepfake_probability: 0.847,
  nlp_score: 31.2,
  visual_score: 18.6,
  flagged_segments: [
    {
      timestamp: 2.3,
      duration: 1.8,
      type: 'visual',
      confidence: 0.92,
      description: 'Facial mesh inconsistency detected - lip sync mismatch',
    },
    {
      timestamp: 8.1,
      duration: 2.4,
      type: 'nlp',
      confidence: 0.88,
      description: 'Urgent financial claim: "Guaranteed 500% returns in 7 days"',
    },
    {
      timestamp: 15.7,
      duration: 1.2,
      type: 'visual',
      confidence: 0.79,
      description: 'Temporal frame discontinuity - possible splice edit',
    },
    {
      timestamp: 22.0,
      duration: 3.1,
      type: 'nlp',
      confidence: 0.95,
      description: 'Phishing pattern: fake WhatsApp group link',
    },
  ],
  transcript:
    'Friends, I am sharing a secret investment opportunity. Just send 5000 rupees to this UPI ID and get 500% returns guaranteed in 7 days. Join my exclusive WhatsApp group for more tips. This is 100% real, no risk at all...',
  processing_time: 3.42,
  created_at: new Date().toISOString(),
  file_name: 'suspicious_investment_video.mp4',
  duration: 31.4,
  resolution: '1080x1920',
};

export const MOCK_RECENT_ANALYSES = [
  {
    id: 'demo-001',
    file_name: 'suspicious_investment.mp4',
    authenticity_score: 23.4,
    status: 'completed',
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    risk_level: 'DEEPFAKE' as RiskLevel,
  },
  {
    id: 'analysis-002',
    file_name: 'market_tips_reel.mp4',
    authenticity_score: 61.2,
    status: 'completed',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    risk_level: 'SUSPICIOUS' as RiskLevel,
  },
  {
    id: 'analysis-003',
    file_name: 'genuine_finance_advice.mp4',
    authenticity_score: 88.7,
    status: 'completed',
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    risk_level: 'AUTHENTIC' as RiskLevel,
  },
  {
    id: 'analysis-004',
    file_name: 'crypto_pump_video.mp4',
    authenticity_score: 34.1,
    status: 'completed',
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    risk_level: 'HIGH_RISK' as RiskLevel,
  },
];
