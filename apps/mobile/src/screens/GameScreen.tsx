import { useEffect, useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
  Share,
  Linking,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Speech from 'expo-speech';
import {
  useGameStore,
  getActiveGame,
  updateLevel,
  finishGame,
  captureSnapshot,
  GAME_CONFIG,
} from '@munchkin/shared';
import type { GamePlayerWithInfo } from '@munchkin/shared';
import { supabase } from '../lib/supabase';
import { useRealtimeGame } from '../hooks/useRealtimeGame';
import { colors, spacing, radius, fontSize } from '../theme';
import { PlayerGrid } from '../components/PlayerGrid';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Game'>;

export function GameScreen({ navigation }: Props) {
  const {
    userId,
    activeGame,
    gamePlayers,
    setActiveGame,
    setGamePlayers,
    updatePlayerLevel,
    clearGame,
    isLoading,
    setLoading,
  } = useGameStore();

  useRealtimeGame(activeGame?.id ?? null);
  const isOwner = !!userId && !!activeGame && userId === activeGame.owner_id;

  const [winner, setWinner] = useState<GamePlayerWithInfo | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const snapshotTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadGame = useCallback(async () => {
    setLoading(true);
    try {
      const game = await getActiveGame(supabase);
      if (!game) {
        navigation.replace('Home');
        return;
      }
      setActiveGame(game);
      setGamePlayers(game.game_players as GamePlayerWithInfo[]);
    } catch {
      Alert.alert('Erro', 'Falha ao carregar partida.');
    } finally {
      setLoading(false);
    }
  }, [navigation, setActiveGame, setGamePlayers, setLoading]);

  useEffect(() => {
    void loadGame();
  }, [loadGame]);

  // Snapshot periódico
  useEffect(() => {
    if (!activeGame || gamePlayers.length === 0) return;
    snapshotTimerRef.current = setInterval(async () => {
      try {
        await captureSnapshot(supabase, activeGame.id, gamePlayers);
      } catch {
        // silencioso — snapshot é best-effort
      }
    }, GAME_CONFIG.SNAPSHOT_INTERVAL_MS);
    return () => {
      if (snapshotTimerRef.current) clearInterval(snapshotTimerRef.current);
    };
  }, [activeGame, gamePlayers]);

  async function handleIncrement(gamePlayerId: string) {
    if (!activeGame) return;
    const gp = gamePlayers.find((p) => p.id === gamePlayerId);
    if (!gp) return;

    const newLevel = Math.min(gp.level + 1, activeGame.max_level + 1);
    updatePlayerLevel(gamePlayerId, newLevel);

    try {
      await updateLevel(supabase, gamePlayerId, newLevel);
      if (newLevel >= activeGame.victory_level) {
        announceWinner(gp, newLevel);
      }
    } catch {
      // Reverter
      updatePlayerLevel(gamePlayerId, gp.level);
    }
  }

  async function handleDecrement(gamePlayerId: string) {
    if (!activeGame) return;
    const gp = gamePlayers.find((p) => p.id === gamePlayerId);
    if (!gp) return;

    const newLevel = Math.max(gp.level - 1, 1);
    updatePlayerLevel(gamePlayerId, newLevel);

    try {
      await updateLevel(supabase, gamePlayerId, newLevel);
    } catch {
      updatePlayerLevel(gamePlayerId, gp.level);
    }
  }

  function announceWinner(gp: GamePlayerWithInfo, level: number) {
    const name = gp.player.name;
    setWinner({ ...gp, level });
    void Speech.speak(`${name} venceu! Nível ${level}!`, { language: 'pt-BR' });
  }

  const webBaseUrl = process.env.EXPO_PUBLIC_WEB_URL ?? 'https://munchkin-tracker.vercel.app';
  const spectateUrl = activeGame ? `${webBaseUrl}/spectate/${activeGame.id}` : '';

  function handleShareWhatsApp() {
    const text = encodeURIComponent(
      `👾 Estou jogando Munchkin! Acompanhe a partida ao vivo:\n${spectateUrl}`
    );
    void Linking.openURL(`https://wa.me/?text=${text}`);
  }

  async function handleShare() {
    try {
      await Share.share({
        message: `👾 Estou jogando Munchkin! Acompanhe a partida ao vivo:\n${spectateUrl}`,
        url: spectateUrl,
      });
    } catch {
      // ignorar cancelamento
    }
  }

  async function handleFinishGame() {
    if (!activeGame) return;
    setIsFinishing(true);
    try {
      await finishGame(supabase, activeGame.id);
      clearGame();
      setWinner(null);
      navigation.replace('Home');
    } catch {
      Alert.alert('Erro', 'Falha ao encerrar partida.');
      setIsFinishing(false);
    }
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.brandGold} />
        <Text style={styles.loadingText}>Carregando partida...</Text>
      </View>
    );
  }

  if (!activeGame) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {activeGame.epic_mode ? '⚔️ Modo Épico' : '⚔️ Partida'}
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.shareBtn}
            onPress={() => {
              Alert.alert('Compartilhar', 'Como deseja compartilhar?', [
                { text: 'Cancelar', style: 'cancel' },
                { text: '📱 WhatsApp', onPress: handleShareWhatsApp },
                { text: '↗ Outras opções', onPress: () => void handleShare() },
              ]);
            }}
          >
            <Text style={styles.shareBtnText}>📤</Text>
          </TouchableOpacity>
          {isOwner && (
            <TouchableOpacity
              style={styles.finishBtn}
              onPress={() => {
                Alert.alert('Encerrar Partida', 'Tem certeza?', [
                  { text: 'Cancelar', style: 'cancel' },
                  { text: 'Encerrar', style: 'destructive', onPress: handleFinishGame },
                ]);
              }}
            >
              <Text style={styles.finishBtnText}>Encerrar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {!isOwner && (
        <View style={styles.spectatorBanner}>
          <Text style={styles.spectatorText}>👁 Modo espectador — apenas visualizando</Text>
        </View>
      )}

      <PlayerGrid
        gamePlayers={gamePlayers}
        maxLevel={activeGame.max_level}
        victoryLevel={activeGame.victory_level}
        isOwner={isOwner}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
      />

      {/* Victory Modal */}
      <Modal visible={winner !== null} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTrophy}>🏆</Text>
            <Text style={styles.modalTitle}>Vitória!</Text>
            <Text style={styles.modalWinner}>{winner?.player.name}</Text>
            <Text style={styles.modalLevel}>Nível {winner?.level}</Text>
            <TouchableOpacity
              style={[styles.modalButton, isFinishing && styles.modalButtonDisabled]}
              onPress={handleFinishGame}
              disabled={isFinishing}
            >
              <Text style={styles.modalButtonText}>
                {isFinishing ? 'Encerrando...' : 'Encerrar Partida'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  loadingText: {
    color: colors.brandMuted,
    fontSize: fontSize.sm,
  },
  spectatorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.brandGold + '44',
    backgroundColor: colors.brandCard,
  },
  spectatorText: {
    color: colors.brandMuted,
    fontSize: fontSize.xs,
    fontStyle: 'italic',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.brandBorder,
  },
  headerTitle: {
    color: colors.brandGold,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  shareBtn: {
    padding: spacing.xs,
  },
  shareBtnText: {
    fontSize: fontSize.lg,
  },
  finishBtn: {
    backgroundColor: colors.brandRed + '22',
    borderWidth: 1,
    borderColor: colors.brandRed,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  finishBtnText: {
    color: colors.brandRed,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    backgroundColor: colors.brandCard,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.brandGold,
    width: '80%',
    gap: spacing.sm,
  },
  modalTrophy: {
    fontSize: 64,
  },
  modalTitle: {
    color: colors.brandGold,
    fontSize: fontSize.xxl,
    fontWeight: '800',
    letterSpacing: 2,
  },
  modalWinner: {
    color: colors.brandText,
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
  modalLevel: {
    color: colors.brandMuted,
    fontSize: fontSize.md,
  },
  modalButton: {
    backgroundColor: colors.brandGold,
    borderRadius: radius.md,
    padding: spacing.md,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.sm,
  },
  modalButtonDisabled: {
    opacity: 0.5,
  },
  modalButtonText: {
    color: colors.brandBg,
    fontWeight: '700',
    fontSize: fontSize.md,
  },
});
