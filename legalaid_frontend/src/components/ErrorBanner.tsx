import type { AppError } from '../types';

interface Props {
  error: AppError;
  onDismiss: () => void;
}

function getMessage(error: AppError): string {
  switch (error.type) {
    case 'rate_limit':
      return 'Vous avez atteint votre limite de 3 consultations gratuites.';
    case 'not_initialized':
      return 'Le système juridique est en cours d\'initialisation. Veuillez réessayer dans quelques minutes.';
    case 'network':
      return 'Impossible de joindre le serveur. Vérifiez votre connexion.';
    case 'server':
      return `Une erreur serveur est survenue : ${error.message}`;
  }
}

export default function ErrorBanner({ error, onDismiss }: Props) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
      <span className="text-red-500 text-lg leading-none mt-0.5">✕</span>
      <div className="flex-1">
        <p className="text-sm text-red-800">{getMessage(error)}</p>
        {error.type === 'rate_limit' && (
          <p className="text-xs text-red-600 mt-1">
            Passez à la version <span className="font-medium">Premium</span> pour un accès illimité.
          </p>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="text-red-400 hover:text-red-600 text-sm leading-none"
        aria-label="Fermer"
      >
        ✕
      </button>
    </div>
  );
}
