import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Switch,
  ActivityIndicator,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useGameStore, getPlayers, createGame, GAME_CONFIG } from '@munchkin/shared';
import type { Player } from '@munchkin/shared';
import { supabase } from '../lib/supabase';
import { colors, spacing, radius, fontSize } from '../theme';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'NewGame'>;

export function NewGameScreen({ navigation }: Props) {
  const { userId, setActiveGame } = useGameStore();
  const [players, setPlayers] = useState<Player[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [epicMode, setEpicMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const loadPlayers = useCallback(async () => {
    try {
      const data = await getPlayers(supabase);
      setPlayers(data);
    } catch {
      Alert.alert('Erro', 'Falha ao carregar jogadores.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPlayers();
  }, [loadPlayers]);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < GAME_CONFIG.MAX_PLAYERS) {
        next.add(id);
      }
      return next;
    });
  }

  const canCreate = selected.size >= GAME_CONFIG.MIN_PLAYERS;

  async function handleCreate() {
    if (!userId || !canCreate) return;
    setIsCreating(true);
    try {
      const game = await createGame(supabase, Array.from(selected), epicMode);
      setActiveGame(game);
      navigation.replace('Game', { gameId: game.id });
    } catch {
      Alert.alert('Erro', 'Falha ao criar partida.');
      setIsCreating(false);
    }
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.brandGold} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.configCard}>
        <View style={styles.configRow}>
          <View>
            <Text style={styles.configLabel}>Modo Épico</Text>
            <Text style={styles.configDesc}>Nível máximo 20</Text>
          </View>
          <Switch
            value={epicMode}
            onValueChange={setEpicMode}
            thumbColor={epicMode ? colors.brandGold : colors.brandMuted}
            trackColor={{ false: colors.brandBorder, true: '#6b4c1a' }}
          />
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        Selecionar Jogadores ({selected.size}/{GAME_CONFIG.MAX_PLAYERS})
      </Text>
      <Text style={styles.sectionHint}>
        Mínimo {GAME_CONFIG.MIN_PLAYERS} jogadores
      </Text>

      {players.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum jogador cadastrado.</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Players')}>
            <Text style={styles.emptyLink}>Cadastrar jogadores →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={players}
          keyExtractor={(p) => p.id}
          style={styles.list}
          renderItem={({ item }) => {
            const isSelected = selected.has(item.id);
            const isDisabled = !isSelected && selected.size >= GAME_CONFIG.MAX_PLAYERS;
            return (
              <TouchableOpacity
                style={[
                  styles.playerRow,
                  isSelected && styles.playerRowSelected,
                  isDisabled && styles.playerRowDisabled,
                ]}
                onPress={() => toggleSelect(item.id)}
                disabled={isDisabled}
              >
                <View
                  style={[styles.colorDot, { backgroundColor: item.color }]}
                />
                <Text style={styles.playerName}>{item.name}</Text>
                {isSelected && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            );
          }}
        />
      )}

      <TouchableOpacity
        style={[styles.createButton, !canCreate && styles.createButtonDisabled]}
        onPress={handleCreate}
        disabled={!canCreate || isCreating}
      >
        <Text style={styles.createButtonText}>
          {isCreating ? 'Criando...' : `Iniciar Partida (${selected.size} jogadores)`}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  configCard: {
    backgroundColor: colors.brandCard,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.brandBorder,
    marginBottom: spacing.md,
  },
  configRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  configLabel: {
    color: colors.brandText,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  configDesc: {
    color: colors.brandMuted,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  sectionTitle: {
    color: colors.brandGold,
    fontSize: fontSize.sm,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  sectionHint: {
    color: colors.brandMuted,
    fontSize: fontSize.xs,
    marginBottom: spacing.sm,
  },
  list: {
    flex: 1,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.brandCard,
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.brandBorder,
    gap: spacing.sm,
  },
  playerRowSelected: {
    borderColor: colors.brandGold,
    backgroundColor: '#1e1a0a',
  },
  playerRowDisabled: {
    opacity: 0.4,
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: radius.full,
  },
  playerName: {
    flex: 1,
    color: colors.brandText,
    fontSize: fontSize.md,
  },
  checkmark: {
    color: colors.brandGold,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  emptyText: {
    color: colors.brandMuted,
    fontSize: fontSize.sm,
  },
  emptyLink: {
    color: colors.brandGold,
    fontSize: fontSize.sm,
    textDecorationLine: 'underline',
  },
  createButton: {
    backgroundColor: colors.brandGold,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  createButtonDisabled: {
    opacity: 0.4,
  },
  createButtonText: {
    color: colors.brandBg,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
});
