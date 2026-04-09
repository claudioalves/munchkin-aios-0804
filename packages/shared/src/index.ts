// ================================================
// @munchkin/shared — Public API
// ================================================

export * from './types';
export * from './constants';
export type { Database, Json, Tables, TablesInsert, TablesUpdate } from './database.types';
export { ensureAnonymousSession, signUpWithEmail, signInWithEmail, signOut, getSessionUser, signInWithGoogle } from './services/auth';
export { getPlayers, createPlayer, deletePlayer } from './services/players';
export { getActiveGame, getGameById, createGame, finishGame, updateGameOrder } from './services/games';
export { updateLevel, captureSnapshot, getSnapshots } from './services/levels';
export { useGameStore } from './store/gameStore';
