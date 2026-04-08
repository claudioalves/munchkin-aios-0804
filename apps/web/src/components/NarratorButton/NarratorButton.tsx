interface NarratorButtonProps {
  isSupported: boolean;
  isSpeaking: boolean;
  onClick: () => void;
}

export function NarratorButton({ isSupported, isSpeaking, onClick }: NarratorButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={!isSupported}
      title={isSupported ? 'Narrar níveis' : 'Narração não disponível neste dispositivo'}
      className={`px-4 py-2 rounded-lg font-heading text-sm transition-colors
        disabled:opacity-40 disabled:cursor-not-allowed
        ${isSpeaking
          ? 'bg-brand-emerald text-parchment hover:bg-brand-emerald-light'
          : 'border border-parchment-dim text-parchment-muted hover:text-parchment hover:border-parchment'
        }`}
    >
      {isSpeaking ? '⏹ Parar' : '🎙️ Narrar'}
    </button>
  );
}
