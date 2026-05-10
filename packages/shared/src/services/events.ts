import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';
import type { GameEvent } from '../types';

export async function logEvent(
  supabase: SupabaseClient<Database>,
  event: Omit<GameEvent, 'id' | 'created_at'>,
): Promise<void> {
  await supabase.from('game_events').insert(event);
}

export async function getGameEvents(
  supabase: SupabaseClient<Database>,
  gameId: string,
): Promise<GameEvent[]> {
  const { data, error } = await supabase
    .from('game_events')
    .select('*')
    .eq('game_id', gameId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(`Failed to get events: ${error.message}`);
  return (data ?? []) as GameEvent[];
}
