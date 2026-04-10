import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';
import type { Player } from '../types';

export async function getPlayers(supabase: SupabaseClient<Database>): Promise<Player[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: true });
  if (error) throw new Error(`Failed to fetch players: ${error.message}`);
  return data ?? [];
}

export async function createPlayer(
  supabase: SupabaseClient<Database>,
  name: string,
  color: string,
): Promise<Player> {
  const { data, error } = await supabase
    .from('players')
    .insert({ name: name.trim(), color })
    .select()
    .single();
  if (error) throw new Error(`Failed to create player: ${error.message}`);
  if (!data) throw new Error('Player creation returned no data');
  return data;
}

export async function deletePlayer(
  supabase: SupabaseClient<Database>,
  id: string,
): Promise<void> {
  const { error } = await supabase.from('players').delete().eq('id', id);
  if (error) throw new Error(`Failed to delete player: ${error.message}`);
}

export async function updatePlayer(
  supabase: SupabaseClient<Database>,
  id: string,
  updates: { name?: string; color?: string; avatar_url?: string | null },
): Promise<Player> {
  const payload: Database['public']['Tables']['players']['Update'] = {};
  if (updates.name !== undefined) payload.name = updates.name.trim();
  if (updates.color !== undefined) payload.color = updates.color;
  if (updates.avatar_url !== undefined) payload.avatar_url = updates.avatar_url;

  const { data, error } = await supabase
    .from('players')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(`Failed to update player: ${error.message}`);
  if (!data) throw new Error('Player update returned no data');
  return data;
}
