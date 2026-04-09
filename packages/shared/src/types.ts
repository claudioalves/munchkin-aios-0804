// ================================================
// SHARED TYPES — Munchkin Level Tracker
// ================================================

export interface Player {
  id: string;
  owner_id: string;
  name: string;
  color: string;
  avatar_url: string | null;
  created_at: string;
}

export interface Game {
  id: string;
  owner_id: string;
  epic_mode: boolean;
  max_level: number;
  victory_level: number;
  status: 'active' | 'finished';
  player_order: string[];
  sort_mode: SortMode;
  started_at: string;
  finished_at: string | null;
  lang?: string | null;
}

export interface GamePlayer {
  id: string;
  game_id: string;
  player_id: string;
  level: number;
  position: number;
  updated_at: string;
}

export interface GamePlayerWithInfo extends GamePlayer {
  player: Player;
}

export interface GameWithPlayers extends Game {
  game_players: GamePlayerWithInfo[];
}

export interface LevelSnapshot {
  id: string;
  game_id: string;
  player_id: string;
  level: number;
  captured_at: string;
}

export type SortMode = 'level-desc' | 'random' | 'custom';

export type Platform = 'web' | 'mobile';
