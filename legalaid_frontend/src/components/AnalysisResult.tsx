import type { LegalResponse } from '../types';

interface Props {
  result: LegalResponse;
  onReset: () => void;
}

function formatResponse(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  const nodes: React.ReactNode[] = [];
  let key = 0;

  for (const line of lines) {
    // Section headers: lines starting with ## or **Title**
    if (/^##\s+/.test(line)) {
      const title = line.replace(/^##\s+/, '');
      nodes.push(
        <h2 key={key++} className="text-base font-bold text-slate-800 mt-5 mb-1 border-b border-slate-200 pb-1">
          {title}
        </h2>
      );
    } else if (/^\*\*.*\*\*$/.test(line.trim())) {
      const title = line.trim().replace(/^\*\*|\*\*$/g, '');
      nodes.push(
        <h2 key={key++} className="text-base font-bold text-slate-800 mt-5 mb-1 border-b border-slate-200 pb-1">
          {title}
        </h2>
      );
    } else if (line.trim() === '') {
      nodes.push(<div key={key++} className="h-2" />);
    } else if (/^[-•]\s+/.test(line)) {
      const content = line.replace(/^[-•]\s+/, '');
      nodes.push(
        <li key={key++} className="ml-4 text-sm text-slate-700 list-disc">
          {renderInline(content)}
        </li>
      );
    } else {
      nodes.push(
        <p key={key++} className="text-sm text-slate-700 leading-relaxed">
          {renderInline(line)}
        </p>
      );
    }
  }

  return nodes;
}

function renderInline(text: string): React.ReactNode {
  // Bold: **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export default function AnalysisResult({ result, onReset }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-800">Résultat de l'analyse</h2>
        <span className="text-xs text-slate-400">
          {result.processing_time.toFixed(1)}s
        </span>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
        {formatResponse(result.analyse)}
      </div>

      {result.disclaimer && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
          <span className="text-amber-500 text-lg leading-none mt-0.5">⚠️</span>
          <p className="text-sm text-amber-800 leading-relaxed">{result.disclaimer}</p>
        </div>
      )}

      <button
        onClick={onReset}
        className="self-start px-4 py-2 rounded-lg border border-slate-300 text-sm text-slate-700
          hover:bg-slate-50 active:bg-slate-100 transition-colors"
      >
        Nouvelle consultation
      </button>
    </div>
  );
}
