import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getGameEvents } from '@munchkin/shared';
import type { GameEvent } from '@munchkin/shared';
import { supabase } from '../lib/supabase';
import { colors, spacing, fontSize, radius } from '../theme';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'GameLog'>;

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatEvent(event: GameEvent): string {
  if (event.event_type === 'level_up') {
    return `${event.player_name} subiu para o nível ${event.new_value ?? ''}`;
  }
  if (event.event_type === 'level_down') {
    return `${event.player_name} desceu para o nível ${event.new_value ?? ''}`;
  }
  if (event.event_type === 'game_start') return 'Partida iniciada';
  if (event.event_type === 'game_end') return 'Partida encerrada';
  return event.event_type;
}

export function GameLogScreen({ route }: Props) {
  const { gameId } = route.params;
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getGameEvents(supabase, gameId)
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setIsLoading(false));
  }, [gameId]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.brandGold} />
      </View>
    );
  }

  if (events.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyIcon}>📋</Text>
        <Text style={styles.emptyText}>Nenhum evento registrado ainda.</Text>
        <Text style={styles.emptyHint}>Os eventos aparecerão aqui conforme a partida avançar.</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.listContent}
      data={events}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.time}>{formatTime(item.created_at)}</Text>
          <Text style={[
            styles.arrow,
            item.event_type === 'level_up' ? styles.arrowUp : styles.arrowDown,
          ]}>
            {item.event_type === 'level_up' ? '↑' : item.event_type === 'level_down' ? '↓' : '·'}
          </Text>
          <Text style={[
            styles.desc,
            item.event_type === 'level_up' ? styles.textUp : styles.textDown,
          ]}>
            {formatEvent(item)}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: colors.brandBg,
  },
  listContent: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brandBg,
    gap: spacing.sm,
    padding: spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyText: {
    color: colors.brandMuted,
    fontSize: fontSize.sm,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyHint: {
    color: colors.brandMuted,
    fontSize: fontSize.xs,
    textAlign: 'center',
    opacity: 0.7,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.brandCard,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.brandBorder,
  },
  time: {
    color: colors.brandMuted,
    fontSize: fontSize.xs,
    fontVariant: ['tabular-nums'],
    width: 42,
  },
  arrow: {
    fontSize: fontSize.md,
    fontWeight: '700',
    width: 16,
    textAlign: 'center',
  },
  arrowUp: {
    color: colors.brandGold,
  },
  arrowDown: {
    color: colors.brandMuted,
  },
  desc: {
    fontSize: fontSize.sm,
    flex: 1,
  },
  textUp: {
    color: colors.brandText,
  },
  textDown: {
    color: colors.brandMuted,
  },
});
