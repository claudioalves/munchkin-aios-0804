import { View, Text, StyleSheet } from 'react-native';
import type { GamePlayerWithInfo } from '@munchkin/shared';
import { colors, spacing, radius, fontSize } from '../theme';
import { HoldButton } from './HoldButton';

interface PlayerCardProps {
  gamePlayer: GamePlayerWithInfo;
  maxLevel: number;
  isVictory: boolean;
  isOwner?: boolean;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
}

export function PlayerCard({
  gamePlayer,
  maxLevel,
  isVictory,
  isOwner = true,
  onIncrement,
  onDecrement,
}: PlayerCardProps) {
  const { id, level, player } = gamePlayer;
  const atMin = !isOwner || level <= 1;
  const atMax = !isOwner || level >= maxLevel || isVictory;

  return (
    <View
      style={[
        styles.card,
        { borderLeftColor: player.color, borderLeftWidth: 4 },
        isVictory && styles.victoryCard,
      ]}
    >
      {isVictory && (
        <View style={styles.victoryBadge}>
          <Text style={styles.victoryBadgeText}>🏆 Vitória!</Text>
        </View>
      )}

      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {player.name}
          </Text>
          <Text style={styles.levelLabel}>Nível</Text>
        </View>

        <View style={styles.controls}>
          <HoldButton
            label="+"
            accessibilityLabel={`Aumentar nível de ${player.name}`}
            onTrigger={() => onIncrement(id)}
            variant="increment"
            disabled={atMax}
          />

          <View style={styles.levelDisplay}>
            <Text style={[styles.levelNumber, { color: player.color }]}>
              {level}
            </Text>
          </View>

          <HoldButton
            label="−"
            accessibilityLabel={`Diminuir nível de ${player.name}`}
            onTrigger={() => onDecrement(id)}
            variant="decrement"
            disabled={atMin || isVictory}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.brandCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.brandBorder,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  victoryCard: {
    borderColor: '#c9a84c',
    backgroundColor: '#1a1a2e',
  },
  victoryBadge: {
    backgroundColor: '#c9a84c22',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginBottom: spacing.xs,
  },
  victoryBadgeText: {
    color: colors.brandGold,
    fontSize: fontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  info: {
    flex: 1,
    marginRight: spacing.md,
  },
  name: {
    color: colors.brandText,
    fontSize: fontSize.md,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  levelLabel: {
    color: colors.brandMuted,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  levelDisplay: {
    width: 48,
    alignItems: 'center',
  },
  levelNumber: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
  },
});
