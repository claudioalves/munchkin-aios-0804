import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';
import type { GamePlayerWithInfo, LevelSnapshot } from '../types';

export async function updateLevel(
  supabase: SupabaseClient<Database>,
  gamePlayerId: string,
  newLevel: number,
): Promise<void> {
  const { error } = await supabase
    .from('game_players')
    .update({ level: newLevel })
    .eq('id', gamePlayerId);
  if (error) throw new Error(`Failed to update level: ${error.message}`);
}

export async function captureSnapshot(
  supabase: SupabaseClient<Database>,
  gameId: string,
  players: GamePlayerWithInfo[],
): Promise<void> {
  const snapshots = players.map((p) => ({
    game_id: gameId,
    player_id: p.player_id,
    level: p.level,
  }));
  const { error } = await supabase.from('level_snapshots').insert(snapshots);
  if (error) throw new Error(`Failed to capture snapshot: ${error.message}`);
}

export async function getSnapshots(
  supabase: SupabaseClient<Database>,
  gameId: string,
): Promise<LevelSnapshot[]> {
  const { data, error } = await supabase
    .from('level_snapshots')
    .select('*')
    .eq('game_id', gameId)
    .order('captured_at', { ascending: true });
  if (error) throw new Error(`Failed to get snapshots: ${error.message}`);
  return data as LevelSnapshot[];
}
