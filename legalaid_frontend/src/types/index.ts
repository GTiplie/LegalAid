export interface SituationRequest {
  situation: string;
  user_id: string;
}

export interface LegalResponse {
  response: string;
  consultations_remaining: number;
  articles_cited: string[];
  processing_time: number;
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
  rag_initialized: boolean;
  documents_loaded: number;
  version: string;
}

export type AppError =
  | { type: 'rate_limit' }
  | { type: 'not_initialized' }
  | { type: 'network' }
  | { type: 'server'; message: string };
