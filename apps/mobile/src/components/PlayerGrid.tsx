import { ScrollView, StyleSheet } from 'react-native';
import type { GamePlayerWithInfo } from '@munchkin/shared';
import { spacing } from '../theme';
import { PlayerCard } from './PlayerCard';

interface PlayerGridProps {
  gamePlayers: GamePlayerWithInfo[];
  maxLevel: number;
  victoryLevel: number;
  isOwner?: boolean;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
}

export function PlayerGrid({
  gamePlayers,
  maxLevel,
  victoryLevel,
  isOwner = true,
  onIncrement,
  onDecrement,
}: PlayerGridProps) {
  const sorted = [...gamePlayers].sort((a, b) => b.level - a.level);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {sorted.map((gp) => (
        <PlayerCard
          key={gp.id}
          gamePlayer={gp}
          maxLevel={maxLevel}
          isVictory={gp.level >= victoryLevel}
          isOwner={isOwner}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  container: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
});
