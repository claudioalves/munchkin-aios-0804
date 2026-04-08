import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';
import type { Player } from '../types';

export async function getPlayers(supabase: SupabaseClient<Database>): Promise<Player[]> {
  const { data, error } = await supabase
    .from('players')
    .select('*')
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
