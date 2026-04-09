import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useGameStore, getSessionUser } from '@munchkin/shared';
import { supabase } from '../lib/supabase';
import { colors, spacing, radius, fontSize } from '../theme';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const { userId, setUserId, activeGame } = useGameStore();

  useEffect(() => {
    async function init() {
      try {
        const user = await getSessionUser(supabase);
        if (user) {
          setUserId(user.id);
        } else {
          navigation.replace('Auth');
          return;
        }
      } catch {
        Alert.alert('Erro', 'Falha ao verificar sessão.');
        navigation.replace('Auth');
      } finally {
        setIsAuthLoading(false);
      }
    }
    void init();
  }, [setUserId, navigation]);

  if (isAuthLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.brandGold} />
        <Text style={styles.loadingText}>Inicializando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>⚔️</Text>
        <Text style={styles.heroSubtitle}>Munchkin</Text>
        <Text style={styles.heroTagline}>Rastreador de Níveis</Text>
      </View>

      <View style={styles.actions}>
        {activeGame && (
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={() => navigation.navigate('Game', { gameId: activeGame.id })}
          >
            <Text style={styles.buttonTextPrimary}>Retomar Partida ▶</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, styles.buttonGold]}
          onPress={() => navigation.navigate('NewGame')}
        >
          <Text style={styles.buttonTextGold}>Nova Partida +</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={() => navigation.navigate('Players')}
        >
          <Text style={styles.buttonTextSecondary}>Gerenciar Jogadores</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.userId}>
        {userId ? `ID: ${userId.slice(0, 8)}...` : 'Sem sessão'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  loadingText: {
    color: colors.brandMuted,
    fontSize: fontSize.sm,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  heroTitle: {
    fontSize: 72,
  },
  heroSubtitle: {
    fontSize: fontSize.xxl,
    color: colors.brandGold,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  heroTagline: {
    fontSize: fontSize.sm,
    color: colors.brandMuted,
    letterSpacing: 1,
  },
  actions: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  button: {
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    borderWidth: 1,
  },
  buttonPrimary: {
    backgroundColor: colors.brandGreen,
    borderColor: colors.brandGreen,
  },
  buttonGold: {
    backgroundColor: colors.brandGold,
    borderColor: colors.brandGold,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderColor: colors.brandBorder,
  },
  buttonTextPrimary: {
    color: '#fff',
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  buttonTextGold: {
    color: colors.brandBg,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  buttonTextSecondary: {
    color: colors.brandText,
    fontSize: fontSize.md,
    fontWeight: '500',
  },
  userId: {
    color: colors.brandBorder,
    fontSize: fontSize.xs,
    textAlign: 'center',
  },
});
