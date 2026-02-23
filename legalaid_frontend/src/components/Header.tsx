import { useEffect, useState } from 'react';
import { checkHealth } from '../api/legalaid';

export default function Header() {
  const [healthy, setHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    checkHealth()
      .then((h) => setHealthy(h.status === 'healthy' || h.rag_initialized))
      .catch(() => setHealthy(false));
  }, []);

  return (
    <header className="bg-slate-900 text-white py-6 px-4 shadow-lg">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            ⚖️ LegalAid AI
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Information juridique – Code civil du Québec
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              healthy === null
                ? 'bg-slate-500'
                : healthy
                ? 'bg-green-400'
                : 'bg-red-400'
            }`}
          />
          <span>
            {healthy === null ? 'Vérification…' : healthy ? 'En ligne' : 'Hors ligne'}
          </span>
        </div>
      </div>
    </header>
  );
}
