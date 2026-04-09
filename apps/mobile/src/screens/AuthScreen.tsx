import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useGameStore, signInWithEmail, signUpWithEmail, getSessionUser, signInWithGoogle } from '@munchkin/shared';
import { supabase } from '../lib/supabase';
import { colors, spacing, radius, fontSize } from '../theme';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Mode = 'login' | 'signup';

type Props = NativeStackScreenProps<RootStackParamList, 'Auth'>;

WebBrowser.maybeCompleteAuthSession();

export function AuthScreen({ navigation }: Props) {
  const { setUserId } = useGameStore();

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Se já houver sessão ativa, ir direto para Home
  useEffect(() => {
    async function checkExistingSession() {
      const user = await getSessionUser(supabase);
      if (user) {
        setUserId(user.id);
        navigation.replace('Home');
      }
    }
    void checkExistingSession();
  }, [navigation, setUserId]);

  async function handleGoogle() {
    setIsLoading(true);
    setError(null);
    try {
      const redirectTo = AuthSession.makeRedirectUri({ scheme: 'munchkin' });
      const url = await signInWithGoogle(supabase, redirectTo, true);
      if (!url) throw new Error('URL de autenticação não disponível');

      const result = await WebBrowser.openAuthSessionAsync(url, redirectTo);
      if (result.type === 'success' && result.url) {
        const params = new URLSearchParams(result.url.split('#')[1] ?? '');
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        if (accessToken && refreshToken) {
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (sessionError) throw sessionError;
          if (data.user) {
            setUserId(data.user.id);
            navigation.replace('Home');
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao entrar com Google');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit() {
    setError(null);
    setIsLoading(true);

    try {
      let user;
      if (mode === 'login') {
        user = await signInWithEmail(supabase, email, password);
      } else {
        user = await signUpWithEmail(supabase, email, password);
      }
      setUserId(user.id);
      navigation.replace('Home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Munchkin</Text>
          <Text style={styles.subtitle}>LEVEL TRACKER</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, mode === 'login' && styles.tabActive]}
            onPress={() => { setMode('login'); setError(null); }}
          >
            <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>
              Entrar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, mode === 'signup' && styles.tabActive]}
            onPress={() => { setMode('signup'); setError(null); }}
          >
            <Text style={[styles.tabText, mode === 'signup' && styles.tabTextActive]}>
              Criar conta
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <TouchableOpacity style={styles.googleButton} onPress={() => { void handleGoogle(); }} disabled={isLoading}>
            <Text style={styles.googleButtonText}>🔵 Entrar com Google</Text>
          </TouchableOpacity>

          <View style={styles.separator}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>ou</Text>
            <View style={styles.separatorLine} />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>EMAIL</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
              placeholderTextColor={colors.brandMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>SENHA</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={colors.brandMuted}
              secureTextEntry
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </View>

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={() => { void handleSubmit(); }}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.brandBg} />
            ) : (
              <Text style={styles.submitButtonText}>
                {mode === 'login' ? 'Entrar' : 'Criar conta'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.brandCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.brandGold,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  header: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  title: {
    fontSize: fontSize.hero,
    color: colors.brandGold,
    fontWeight: '900',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: fontSize.xs,
    color: colors.brandMuted,
    letterSpacing: 4,
  },
  tabs: {
    flexDirection: 'row',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.brandBorder,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  tabActive: {
    backgroundColor: colors.brandGold,
  },
  tabText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.brandMuted,
  },
  tabTextActive: {
    color: colors.brandBg,
  },
  form: {
    gap: spacing.md,
  },
  field: {
    gap: spacing.xs,
  },
  label: {
    fontSize: fontSize.xs,
    color: colors.brandMuted,
    letterSpacing: 2,
  },
  input: {
    backgroundColor: colors.brandBg,
    borderWidth: 1,
    borderColor: colors.brandBorder,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.brandText,
    fontSize: fontSize.md,
  },
  errorBox: {
    backgroundColor: 'rgba(230,57,70,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(230,57,70,0.4)',
    borderRadius: radius.sm,
    padding: spacing.sm,
  },
  errorText: {
    color: colors.brandRed,
    fontSize: fontSize.sm,
  },
  submitButton: {
    backgroundColor: colors.brandGold,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: colors.brandBg,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  googleButton: {
    backgroundColor: '#fff',
    borderRadius: radius.sm,
    padding: spacing.sm,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  googleButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: fontSize.sm,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.brandBorder,
  },
  separatorText: {
    color: colors.brandMuted,
    fontSize: fontSize.xs,
  },
});
