// ================================================
// SHARED CONSTANTS — Munchkin Level Tracker
// ================================================

export const AVATAR_COLORS = [
  '#c9943a', // gold
  '#b02828', // ruby
  '#2d7a4a', // emerald
  '#2855a0', // sapphire
  '#7a2d9a', // amethyst
  '#9a5a1a', // bronze
] as const;

export const LEVEL_LIMITS = {
  NORMAL: { max: 10, victory: 11 },
  EPIC: { max: 20, victory: 21 },
  MIN: 1,
} as const;

export const GAME_CONFIG = {
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 6,
  SNAPSHOT_INTERVAL_MS: 15 * 60 * 1000, // 15 minutos
} as const;

export const STORAGE_KEYS = {
  GAME_STORE: 'munchkin-game-store',
  SYNC_QUEUE: 'munchkin-sync-queue',
} as const;
