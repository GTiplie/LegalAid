import { useState } from 'react';

const MIN_LENGTH = 20;
const MAX_LENGTH = 2000;

const PLACEHOLDER = `Ex. : Je suis locataire et mon propriétaire refuse de me rembourser mon dépôt de garantie de 1 200 $ après que j'ai quitté le logement en bon état. Le bail était d'un an et s'est terminé il y a trois semaines. Quels sont mes droits selon le Code civil du Québec ?`;

interface Props {
  onSubmit: (situation: string) => void;
  loading: boolean;
  disabled: boolean;
}

export default function AnalysisForm({ onSubmit, loading, disabled }: Props) {
  const [text, setText] = useState('');

  const charCount = text.length;
  const isUnderMin = charCount < MIN_LENGTH;
  const isNearMax = charCount >= MAX_LENGTH - 200;
  const isAtMax = charCount >= MAX_LENGTH;

  const counterColor = isAtMax
    ? 'text-red-600'
    : isNearMax
    ? 'text-orange-500'
    : charCount >= MIN_LENGTH
    ? 'text-green-600'
    : 'text-slate-400';

  const canSubmit = !loading && !disabled && !isUnderMin;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (canSubmit) {
      onSubmit(text);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label htmlFor="situation" className="text-sm font-medium text-slate-700">
        Décrivez votre situation juridique
      </label>

      <div className="relative">
        <textarea
          id="situation"
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_LENGTH))}
          placeholder={PLACEHOLDER}
          rows={6}
          className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-none"
          disabled={loading || disabled}
        />
        <span
          className={`absolute bottom-2 right-3 text-xs font-mono ${counterColor}`}
        >
          {charCount} / {MAX_LENGTH}
        </span>
      </div>

      {isUnderMin && charCount > 0 && (
        <p className="text-xs text-slate-400">
          Minimum {MIN_LENGTH} caractères requis ({MIN_LENGTH - charCount} restants).
        </p>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className="self-end px-5 py-2 rounded-lg bg-slate-800 text-white text-sm font-medium
          hover:bg-slate-700 active:bg-slate-900
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-colors"
      >
        {loading ? 'Analyse en cours…' : 'Analyser la situation'}
      </button>
    </form>
  );
}
