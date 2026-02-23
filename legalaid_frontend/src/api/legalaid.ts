import type { LegalResponse, ConsultationStatus, HealthResponse, AppError } from '../types';

const API_BASE = 'http://localhost:8000';

export class ApiError extends Error {
  constructor(public readonly appError: AppError) {
    super(appError.type);
  }
}

export async function analyseSituation(
  situation: string,
  userId: string
): Promise<LegalResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}/analyse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ situation, user_id: userId }),
    });
  } catch {
    throw new ApiError({ type: 'network' });
  }

  if (response.status === 429) {
    throw new ApiError({ type: 'rate_limit' });
  }
  if (response.status === 503) {
    throw new ApiError({ type: 'not_initialized' });
  }
  if (!response.ok) {
    const text = await response.text().catch(() => 'Erreur inconnue');
    throw new ApiError({ type: 'server', message: text });
  }

  return response.json() as Promise<LegalResponse>;
}

export async function getConsultationStatus(
  userId: string
): Promise<ConsultationStatus> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}/consultations/${encodeURIComponent(userId)}`);
  } catch {
    throw new ApiError({ type: 'network' });
  }

  if (!response.ok) {
    throw new ApiError({ type: 'server', message: 'Impossible de récupérer le statut.' });
  }

  return response.json() as Promise<ConsultationStatus>;
}

export async function checkHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE}/health`);
  if (!response.ok) {
    throw new Error('Health check failed');
  }
  return response.json() as Promise<HealthResponse>;
}
