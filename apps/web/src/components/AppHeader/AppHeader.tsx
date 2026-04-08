interface AppHeaderProps {
  epicMode: boolean;
  playerCount: number;
  onBack: () => void;
  onChartOpen?: () => void;
}

export function AppHeader({ epicMode, playerCount, onBack, onChartOpen }: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between py-3 px-1">
      <button
        onClick={onBack}
        className="font-heading text-parchment-muted hover:text-parchment transition-colors text-sm"
      >
        ← Menu
      </button>

      <div className="text-center">
        <h1 className="font-display text-brand-gold text-lg leading-none">
          Munchkin
        </h1>
        <p className="font-body text-parchment-dim text-xs">
          {epicMode ? 'Épico ★' : 'Normal'} · {playerCount} jogadores
        </p>
      </div>

      <button
        onClick={onChartOpen}
        disabled={!onChartOpen}
        title="Ver gráfico de evolução"
        className="w-14 text-right font-heading text-parchment-muted hover:text-parchment transition-colors text-lg disabled:opacity-0"
      >
        📊
      </button>
    </header>
  );
}
