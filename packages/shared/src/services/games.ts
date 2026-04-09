import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';
import type { GameWithPlayers } from '../types';

export async function getActiveGame(
  supabase: SupabaseClient<Database>,
): Promise<GameWithPlayers | null> {
  const { data, error } = await supabase
    .from('games')
    .select(`*, game_players (*, player:players (*))`)
    .eq('status', 'active')
    .maybeSingle();
  if (error) throw new Error(`Failed to fetch active game: ${error.message}`);
  return data as GameWithPlayers | null;
}

export async function createGame(
  supabase: SupabaseClient<Database>,
  playerIds: string[],
  epicMode: boolean,
  lang?: string,
): Promise<GameWithPlayers> {
  const { data: game, error: gameError } = await supabase
    .from('games')
    .insert({ epic_mode: epicMode, player_order: playerIds, ...(lang ? { lang } : {}) })
    .select()
    .single();
  if (gameError) throw new Error(`Failed to create game: ${gameError.message}`);
  if (!game) throw new Error('Game creation returned no data');

  const gpInserts = playerIds.map((playerId, index) => ({
    game_id: game.id,
    player_id: playerId,
    level: 1,
    position: index,
  }));

  const { data: gamePlayers, error: gpError } = await supabase
    .from('game_players')
    .insert(gpInserts)
    .select(`*, player:players (*)`);
  if (gpError) throw new Error(`Failed to create game players: ${gpError.message}`);

  return { ...game, game_players: gamePlayers ?? [] } as GameWithPlayers;
}

export async function finishGame(
  supabase: SupabaseClient<Database>,
  gameId: string,
): Promise<void> {
  const { error } = await supabase.from('games').delete().eq('id', gameId);
  if (error) throw new Error(`Failed to finish game: ${error.message}`);
}

export async function getGameById(
  supabase: SupabaseClient<Database>,
  gameId: string,
): Promise<GameWithPlayers | null> {
  const { data, error } = await supabase
    .from('games')
    .select(`*, game_players (*, player:players (*))`)
    .eq('id', gameId)
    .maybeSingle();
  if (error) throw new Error(`Failed to fetch game: ${error.message}`);
  return data as GameWithPlayers | null;
}

export async function updateGameOrder(
  supabase: SupabaseClient<Database>,
  gameId: string,
  playerOrder: string[],
): Promise<void> {
  const { error } = await supabase
    .from('games')
    .update({ player_order: playerOrder })
    .eq('id', gameId);
  if (error) throw new Error(`Failed to update game order: ${error.message}`);
}
