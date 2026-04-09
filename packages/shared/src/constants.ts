// ================================================
// SHARED CONSTANTS — Munchkin Level Tracker
// ================================================

export const AVATAR_COLORS = [
  // Quentes
  '#c9943a', '#b02828', '#e85d04', '#f48c06', '#dc2f02', '#9d0208',
  // Frias
  '#2855a0', '#1d3557', '#2d7a4a', '#1b4332', '#7a2d9a', '#3a0ca3',
  // Neutras
  '#9a5a1a', '#6b4226', '#4a4e69', '#22223b', '#606c38', '#283618',
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
