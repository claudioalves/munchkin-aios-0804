import { LevelButton } from '@/components/LevelButton/LevelButton';

interface PlayerCardProps {
  gamePlayerId: string;
  name: string;
  color: string;
  level: number;
  maxLevel: number;
  isLeader: boolean;
  isVictory: boolean;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
}

export function PlayerCard({
  gamePlayerId,
  name,
  color,
  level,
  maxLevel,
  isLeader,
  isVictory,
  onIncrement,
  onDecrement,
}: PlayerCardProps) {
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
      <div className="flex items-center gap-2 w-full justify-center">
        <span
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: color }}
        />
        <span className="font-heading text-sm font-semibold tracking-wider uppercase text-parchment-muted truncate max-w-[120px]">
          {name}
        </span>
      </div>

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
          disabled={isVictory || level <= 1}
          onClick={() => onDecrement(gamePlayerId)}
          aria-label={`Diminuir nível de ${name}`}
        />
        <LevelButton
          variant="increment"
          disabled={isVictory || level >= maxLevel}
          onClick={() => onIncrement(gamePlayerId)}
          aria-label={`Aumentar nível de ${name}`}
        />
      </div>
    </div>
  );
}
