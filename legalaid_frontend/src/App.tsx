import { useEffect, useState, useCallback } from 'react';
import Header from './components/Header';
import ConsultationCounter from './components/ConsultationCounter';
import AnalysisForm from './components/AnalysisForm';
import LoadingState from './components/LoadingState';
import AnalysisResult from './components/AnalysisResult';
import ErrorBanner from './components/ErrorBanner';
import { analyseSituation, getConsultationStatus, ApiError } from './api/legalaid';
import type { LegalResponse, ConsultationStatus, AppError } from './types';

function getOrCreateUserId(): string {
  const key = 'legalaid_user_id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export default function App() {
  const [userId] = useState<string>(getOrCreateUserId);
  const [consultationStatus, setConsultationStatus] = useState<ConsultationStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LegalResponse | null>(null);
  const [error, setError] = useState<AppError | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const status = await getConsultationStatus(userId);
      setConsultationStatus(status);
    } catch {
      // Non-critical: silently ignore status fetch errors
    } finally {
      setStatusLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  async function handleSubmit(situation: string) {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await analyseSituation(situation, userId);
      setResult(response);
      await fetchStatus();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.appError);
        if (err.appError.type === 'rate_limit') {
          await fetchStatus();
        }
      } else {
        setError({ type: 'network' });
      }
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setResult(null);
    setError(null);
  }

  const isExhausted = consultationStatus?.consultations_remaining === 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 flex flex-col gap-6">
        <ConsultationCounter status={consultationStatus} loading={statusLoading} />

        {error && (
          <ErrorBanner error={error} onDismiss={() => setError(null)} />
        )}

        {loading && <LoadingState />}

        {!loading && result && (
          <AnalysisResult result={result} onReset={handleReset} />
        )}

        {!loading && !result && (
          <AnalysisForm
            onSubmit={handleSubmit}
            loading={loading}
            disabled={isExhausted}
          />
        )}
      </main>

      <footer className="text-center text-xs text-slate-400 py-4 border-t border-slate-200">
        LegalAid AI — Information juridique uniquement. Ceci ne constitue pas un avis juridique professionnel.
      </footer>
    </div>
  );
}
