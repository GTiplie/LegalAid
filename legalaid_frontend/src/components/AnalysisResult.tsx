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

function extractDisclaimer(text: string): { body: string; disclaimer: string | null } {
  const disclaimerKeywords = [
    'avertissement',
    'mise en garde',
    'disclaimer',
    'ces informations ne constituent pas',
    'cet avis ne remplace pas',
    'consultez un avocat',
    'à titre informatif seulement',
  ];

  const lines = text.split('\n');
  const disclaimerStartIndex = lines.findIndex((line) =>
    disclaimerKeywords.some((kw) => line.toLowerCase().includes(kw))
  );

  if (disclaimerStartIndex === -1) return { body: text, disclaimer: null };

  const body = lines.slice(0, disclaimerStartIndex).join('\n').trim();
  const disclaimer = lines.slice(disclaimerStartIndex).join('\n').trim();
  return { body, disclaimer };
}

export default function AnalysisResult({ result, onReset }: Props) {
  const { body, disclaimer } = extractDisclaimer(result.response);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-800">Résultat de l'analyse</h2>
        <span className="text-xs text-slate-400">
          {result.processing_time.toFixed(1)}s · {result.articles_cited.length} article(s) cité(s)
        </span>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
        {formatResponse(body)}
      </div>

      {disclaimer && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
          <span className="text-amber-500 text-lg leading-none mt-0.5">⚠️</span>
          <p className="text-sm text-amber-800 leading-relaxed">{disclaimer}</p>
        </div>
      )}

      {result.articles_cited.length > 0 && (
        <div className="text-xs text-slate-400">
          <span className="font-medium text-slate-500">Articles cités : </span>
          {result.articles_cited.join(', ')}
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
