export interface FlaggedSegment {
  timestamp: number;
  duration: number;
  type: 'visual' | 'nlp' | 'audio';
  confidence: number;
  description: string;
}

export interface AnalysisResult {
  task_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  authenticity_score: number;
  deepfake_probability: number;
  nlp_score: number;
  visual_score: number;
  flagged_segments: FlaggedSegment[];
  transcript: string;
  processing_time: number;
  created_at: string;
  video_url?: string;
  file_name?: string;
  duration?: number;
  resolution?: string;
  error?: string;
}

export interface AnalysisStatus {
  task_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  message?: string;
}

export interface UploadResponse {
  task_id: string;
  message: string;
  status?: string;
  filename?: string;
  file_path?: string;
  size_bytes?: number;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface RecentAnalysis {
  id: string;
  file_name: string;
  authenticity_score: number;
  status: string;
  created_at: string;
  risk_level: RiskLevel;
}

export type RiskLevel = 'AUTHENTIC' | 'SUSPICIOUS' | 'HIGH_RISK' | 'DEEPFAKE';

export interface UploadState {
  file: File | null;
  progress: number;
  isUploading: boolean;
  taskId: string | null;
  error: string | null;
}

export interface AnalysisState {
  status: AnalysisStatus | null;
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  progress: number;
}

export interface StatsData {
  totalScanned: number;
  threatsFound: number;
  cleanVideos: number;
  avgProcessingTime: number;
}
