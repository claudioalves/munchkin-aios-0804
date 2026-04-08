import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';

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
