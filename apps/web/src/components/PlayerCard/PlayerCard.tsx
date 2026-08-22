import { LevelButton } from '@/components/LevelButton/LevelButton';

interface PlayerCardProps {
  gamePlayerId: string;
  name: string;
  color: string;
  level: number;
  maxLevel: number;
  rank: number;
  isLeader: boolean;
  isVictory: boolean;
  isOwner?: boolean | undefined;
  femaleName?: string | null | undefined;
  isTransActive?: boolean | undefined;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onPlayerClick?: ((id: string) => void) | undefined;
}

const RANK_COLOR_CLASS: Record<number, string> = {
  1: 'text-brand-gold',
  2: 'text-parchment',
  3: 'text-amber-600',
};

export function PlayerCard({
  gamePlayerId,
  name,
  color,
  level,
  maxLevel,
  rank,
  isLeader,
  isVictory,
  isOwner = true,
  femaleName,
  isTransActive = false,
  onIncrement,
  onDecrement,
  onPlayerClick,
}: PlayerCardProps) {
  const nameToDisplay = isTransActive && femaleName ? `${name} - (${femaleName})` : name;
  const rankColorClass = RANK_COLOR_CLASS[rank] ?? 'text-parchment-muted';

  return (
    <div
      className={`bg-surface-card rounded-xl p-4 flex flex-col items-center gap-3
        transition-all duration-300
        ${isVictory
          ? 'ring-2 ring-brand-emerald shadow-glow-emerald'
          : isLeader
          ? 'ring-2 ring-brand-gold animate-gold-pulse'
          : ''
        }`}
    >
      {/* Avatar + nome */}
      <button
        type="button"
        onClick={() => onPlayerClick?.(gamePlayerId)}
        className="flex items-center gap-2 w-full justify-center text-left hover:opacity-85 transition-opacity cursor-pointer px-1 py-0.5 rounded-lg hover:bg-surface-elevated/50"
        title="Ver/Editar jogador na partida"
      >
        <span className={`font-display font-black text-2xl leading-none flex-shrink-0 opacity-[0.10] ${rankColorClass}`}>
          {rank}º
        </span>
        <span
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: color }}
        />
        <span className="font-heading text-xs font-semibold tracking-wide uppercase text-parchment-muted truncate max-w-[200px]">
          {nameToDisplay}
        </span>
      </button>

      {/* Victory badge */}
      {isVictory && (
        <span className="font-heading text-brand-emerald text-xs tracking-widest uppercase">
          🏆 Vitória!
        </span>
      )}

      {/* Número de nível — protagonista */}
      <span
        className="font-display font-black leading-none select-none tabular-nums text-8xl"
        style={{ color: isVictory ? '#2d7a4a' : color }}
      >
        {level}
      </span>

      {/* Botões +/- */}
      <div className="flex gap-2 w-full">
        <LevelButton
          variant="decrement"
          disabled={!isOwner || isVictory || level <= 1}
          onClick={() => onDecrement(gamePlayerId)}
          aria-label={`Diminuir nível de ${name}`}
        />
        <LevelButton
          variant="increment"
          disabled={!isOwner || isVictory || level >= maxLevel}
          onClick={() => onIncrement(gamePlayerId)}
          aria-label={`Aumentar nível de ${name}`}
        />
      </div>
    </div>
  );
}
