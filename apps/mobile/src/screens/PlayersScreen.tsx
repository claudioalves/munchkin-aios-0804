import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { getPlayers, createPlayer, deletePlayer, AVATAR_COLORS } from '@munchkin/shared';
import type { Player } from '@munchkin/shared';
import { supabase } from '../lib/supabase';
import { colors, spacing, radius, fontSize } from '../theme';

export function PlayersScreen() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>(AVATAR_COLORS[0]);
  const [isSaving, setIsSaving] = useState(false);

  const loadPlayers = useCallback(async () => {
    setIsLoading(true);
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

  async function handleCreate() {
    if (!newName.trim()) return;
    setIsSaving(true);
    try {
      await createPlayer(supabase, newName.trim(), selectedColor as string);
      setNewName('');
      await loadPlayers();
    } catch {
      Alert.alert('Erro', 'Falha ao criar jogador.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(player: Player) {
    Alert.alert(
      'Remover jogador',
      `Remover "${player.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePlayer(supabase, player.id);
              await loadPlayers();
            } catch {
              Alert.alert('Erro', 'Falha ao remover jogador.');
            }
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Novo Jogador</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome do jogador"
          placeholderTextColor={colors.brandMuted}
          value={newName}
          onChangeText={setNewName}
          maxLength={30}
        />
        <View style={styles.colorRow}>
          {AVATAR_COLORS.map((c) => (
            <TouchableOpacity
              key={c}
              style={[
                styles.colorDot,
                { backgroundColor: c },
                selectedColor === c && styles.colorDotSelected,
              ]}
              onPress={() => setSelectedColor(c)}
            />
          ))}
        </View>
        <TouchableOpacity
          style={[styles.addButton, (!newName.trim() || isSaving) && styles.addButtonDisabled]}
          onPress={handleCreate}
          disabled={!newName.trim() || isSaving}
        >
          <Text style={styles.addButtonText}>
            {isSaving ? 'Adicionando...' : 'Adicionar Jogador'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      {isLoading ? (
        <ActivityIndicator color={colors.brandGold} style={{ marginTop: spacing.lg }} />
      ) : (
        <FlatList
          data={players}
          keyExtractor={(p) => p.id}
          renderItem={({ item }) => (
            <View style={styles.playerRow}>
              <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
              <Text style={styles.playerName} numberOfLines={1}>
                {item.name}
              </Text>
              <TouchableOpacity onPress={() => handleDelete(item)} style={styles.deleteBtn}>
                <Text style={styles.deleteBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum jogador cadastrado.</Text>
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
  },
  form: {
    backgroundColor: colors.brandCard,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.brandBorder,
    gap: spacing.sm,
  },
  sectionTitle: {
    color: colors.brandGold,
    fontSize: fontSize.sm,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: colors.brandBg,
    borderWidth: 1,
    borderColor: colors.brandBorder,
    borderRadius: radius.sm,
    padding: spacing.sm,
    color: colors.brandText,
    fontSize: fontSize.md,
  },
  colorRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  colorDot: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorDotSelected: {
    borderColor: '#fff',
  },
  addButton: {
    backgroundColor: colors.brandGold,
    borderRadius: radius.sm,
    padding: spacing.sm,
    alignItems: 'center',
  },
  addButtonDisabled: {
    opacity: 0.4,
  },
  addButtonText: {
    color: colors.brandBg,
    fontWeight: '700',
    fontSize: fontSize.sm,
  },
  listContent: {
    gap: spacing.xs,
    paddingBottom: spacing.xl,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.brandCard,
    borderRadius: radius.sm,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.brandBorder,
    gap: spacing.sm,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: radius.full,
  },
  playerName: {
    flex: 1,
    color: colors.brandText,
    fontSize: fontSize.md,
  },
  deleteBtn: {
    padding: spacing.xs,
  },
  deleteBtnText: {
    color: colors.brandMuted,
    fontSize: fontSize.sm,
  },
  emptyText: {
    color: colors.brandMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
    fontSize: fontSize.sm,
  },
});
