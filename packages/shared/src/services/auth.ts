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
