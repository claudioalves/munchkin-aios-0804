interface AppHeaderProps {
  epicMode: boolean;
  playerCount: number;
  onBack: () => void;
  onChartOpen?: () => void;
  onShareOpen?: () => void;
}

export function AppHeader({ epicMode, playerCount, onBack, onChartOpen, onShareOpen }: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between py-2 px-1 gap-2">
      <button
        onClick={onBack}
        className="font-heading text-parchment-muted hover:text-parchment transition-colors text-sm shrink-0"
      >
        ← Menu
      </button>

      <div className="text-center min-w-0 flex-1">
        <h1 className="font-display text-brand-gold text-lg leading-none">
          Munchkin
        </h1>
        <p className="font-body text-parchment-dim text-xs">
          {epicMode ? 'Épico ★' : 'Normal'} · {playerCount} jogadores
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {onShareOpen && (
          <button
            onClick={onShareOpen}
            title="Compartilhar partida"
            className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg bg-surface-card border border-parchment-dim/30 hover:border-brand-gold/60 hover:text-brand-gold transition-colors text-parchment-muted"
          >
            <span className="text-base leading-none" aria-hidden>📤</span>
            <span className="font-heading text-[10px] leading-none">Compartilhar</span>
          </button>
        )}
        <button
          onClick={onChartOpen}
          disabled={!onChartOpen}
          title="Ver gráfico de evolução"
          className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg bg-surface-card border border-brand-gold/40 hover:border-brand-gold hover:text-brand-gold transition-colors text-parchment-muted disabled:opacity-0"
        >
          <span className="text-base leading-none" aria-hidden>📊</span>
          <span className="font-heading text-[10px] leading-none">Gráfico</span>
        </button>
      </div>
    </header>
  );
}
