export interface SituationRequest {
  situation: string;
  user_id: string;
}

export interface LegalResponse {
  request_id: string;
  situation: string;
  analyse: string;
  processing_time: number;
  timestamp: string;
  disclaimer: string;
}

export interface ConsultationStatus {
  user_id: string;
  consultations_used: number;
  consultations_remaining: number;
  limit: number;
  is_premium: boolean;
}

export interface HealthResponse {
  status: string;
  version: string;
  vectorstore_ready: boolean;
  pdf_available: boolean;
}

export type AppError =
  | { type: 'rate_limit' }
  | { type: 'not_initialized' }
  | { type: 'network' }
  | { type: 'server'; message: string };
