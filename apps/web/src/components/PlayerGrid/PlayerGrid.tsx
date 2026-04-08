import type { GamePlayerWithInfo } from '@munchkin/shared';
import { PlayerCard } from '@/components/PlayerCard/PlayerCard';

interface PlayerGridProps {
  gamePlayers: GamePlayerWithInfo[];
  maxLevel: number;
  victoryLevel: number;
  onLevelChange: (gamePlayerId: string, currentLevel: number, delta: 1 | -1) => void;
}

export function PlayerGrid({
  gamePlayers,
  maxLevel,
  victoryLevel,
  onLevelChange,
}: PlayerGridProps) {
  const maxLevelInGame = Math.max(...gamePlayers.map((p) => p.level), 0);

  return (
    <div
      className="grid gap-4 w-full"
      style={{
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
      }}
    >
      {gamePlayers.map((gp, index) => {
        const isVictory = gp.level >= victoryLevel;
        const isLeader = gp.level === maxLevelInGame && maxLevelInGame > 1 && !isVictory;

        return (
          <div
            key={gp.id}
            className="animate-card-enter"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <PlayerCard
              gamePlayerId={gp.id}
              name={gp.player.name}
              color={gp.player.color}
              level={gp.level}
              maxLevel={maxLevel}
              isLeader={isLeader}
              isVictory={isVictory}
              onIncrement={(id) => onLevelChange(id, gp.level, 1)}
              onDecrement={(id) => onLevelChange(id, gp.level, -1)}
            />
          </div>
        );
      })}
    </div>
  );
}
