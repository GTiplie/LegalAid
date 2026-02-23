import type { ConsultationStatus } from '../types';

interface Props {
  status: ConsultationStatus | null;
  loading: boolean;
}

export default function ConsultationCounter({ status, loading }: Props) {
  if (loading || !status) {
    return (
      <div className="flex justify-center">
        <span className="text-sm text-slate-500 animate-pulse">
          Chargement du statut…
        </span>
      </div>
    );
  }

  const remaining = status.consultations_remaining;
  const isExhausted = remaining === 0;

  const badgeColor = isExhausted
    ? 'bg-red-100 text-red-700 border-red-200'
    : remaining === 1
    ? 'bg-orange-100 text-orange-700 border-orange-200'
    : 'bg-green-100 text-green-700 border-green-200';

  return (
    <div className="flex flex-col items-center gap-2">
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${badgeColor}`}
      >
        {isExhausted ? (
          '0 consultation gratuite restante'
        ) : remaining === 1 ? (
          '1 consultation gratuite restante'
        ) : (
          `${remaining} consultations gratuites restantes`
        )}
      </span>

      {isExhausted && (
        <p className="text-sm text-slate-600 text-center max-w-sm">
          Vous avez utilisé toutes vos consultations gratuites.{' '}
          <span className="font-medium text-slate-800">
            Passez à la version Premium pour un accès illimité.
          </span>
        </p>
      )}
    </div>
  );
}
