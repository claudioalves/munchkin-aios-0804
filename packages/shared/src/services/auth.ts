import type { SupabaseClient, User } from '@supabase/supabase-js';
import type { Database } from '../database.types';

/**
 * Garante que existe uma sessão anônima ativa.
 * - Se já existe sessão: retorna o usuário atual
 * - Se não existe: cria nova sessão anônima via Supabase Auth
 *
 * Recebe o supabase client como parâmetro para manter
 * packages/shared agnóstico à implementação (web vs mobile).
 */
export async function ensureAnonymousSession(
  supabase: SupabaseClient<Database>
): Promise<User> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user) {
    return session.user;
  }

  const { data, error } = await supabase.auth.signInAnonymously();

  if (error) {
    throw new Error(`Failed to create anonymous session: ${error.message}`);
  }

  if (!data.user) {
    throw new Error('Anonymous sign-in returned no user');
  }

  return data.user;
}

/**
 * Cria uma nova conta com email e senha.
 */
export async function signUpWithEmail(
  supabase: SupabaseClient<Database>,
  email: string,
  password: string,
): Promise<User> {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    throw new Error(`Failed to sign up: ${error.message}`);
  }

  if (!data.user) {
    throw new Error('Sign-up returned no user');
  }

  return data.user;
}

/**
 * Autentica com email e senha.
 */
export async function signInWithEmail(
  supabase: SupabaseClient<Database>,
  email: string,
  password: string,
): Promise<User> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    throw new Error(`Failed to sign in: ${error.message}`);
  }

  if (!data.user) {
    throw new Error('Sign-in returned no user');
  }

  return data.user;
}

/**
 * Encerra a sessão atual.
 */
export async function signOut(
  supabase: SupabaseClient<Database>,
): Promise<void> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(`Failed to sign out: ${error.message}`);
  }
}

/**
 * Retorna o usuário da sessão ativa, ou null se não houver sessão.
 */
export async function getSessionUser(
  supabase: SupabaseClient<Database>,
): Promise<User | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session?.user ?? null;
}

/**
 * Inicia o fluxo OAuth com Google.
 * Na web: redireciona para o Google. No mobile: usa skipBrowserRedirect=true para retornar a URL.
 */
export async function signInWithGoogle(
  supabase: SupabaseClient<Database>,
  redirectTo: string,
  skipBrowserRedirect = false,
): Promise<string | null> {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo, skipBrowserRedirect },
  });
  if (error) throw new Error(`Failed to sign in with Google: ${error.message}`);
  return data.url ?? null;
}
