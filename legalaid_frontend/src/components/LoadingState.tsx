import { useEffect, useState } from 'react';

const MESSAGES = [
  'Recherche des articles applicables…',
  'Analyse juridique en cours…',
  'Synthèse de l\'information…',
  'Contrôle qualité…',
];

export default function LoadingState() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 py-10">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-700 rounded-full animate-spin" />
      <p className="text-sm text-slate-600 animate-pulse">{MESSAGES[msgIndex]}</p>
      <p className="text-xs text-slate-400">L'analyse peut prendre 30 à 60 secondes.</p>
    </div>
  );
}
