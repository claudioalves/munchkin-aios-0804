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
      className={`w-full h-14 rounded-xl font-heading font-bold text-base tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer
        disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
        ${
          isSpeaking
            ? 'bg-brand-emerald hover:bg-brand-emerald-light text-parchment shadow-glow-emerald border border-brand-emerald-light/40 animate-pulse'
            : 'bg-brand-gold hover:bg-brand-gold-light text-surface-base shadow-glow-gold border border-brand-gold-light/40 active:scale-[0.98]'
        }`}
    >
      {isSpeaking ? '⏹ Parar' : '🎙️ Narrar'}
    </button>
  );
}
