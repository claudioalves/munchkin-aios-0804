import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Game, GamePlayerWithInfo, SortMode } from '../types';

interface GameStoreState {
  // Auth
  userId: string | null;

  // Active Game
  activeGame: Game | null;
  gamePlayers: GamePlayerWithInfo[];
  sortMode: SortMode;

  // Persistence
  lastSavedAt: string | null;

  // UI
  isLoading: boolean;
  isSaving: boolean;

  // Actions
  setUserId: (id: string | null) => void;
  setActiveGame: (game: Game | null) => void;
  setGamePlayers: (players: GamePlayerWithInfo[]) => void;
  setGamePlayersOrder: (orderedIds: string[]) => void;
  setSortMode: (mode: SortMode) => void;
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  setLastSavedAt: (timestamp: string) => void;
  updatePlayerLevel: (gamePlayerId: string, newLevel: number) => void;
  clearGame: () => void;
}

// Detectar storage disponível (web: localStorage, mobile: será sobrescrito via AsyncStorage)
const storage =
  typeof localStorage !== 'undefined'
    ? createJSONStorage(() => localStorage)
    : createJSONStorage(() => ({
        getItem: () => null,
        setItem: () => undefined,
        removeItem: () => undefined,
      }));

export const useGameStore = create<GameStoreState>()(
  persist(
    (set) => ({
      // Initial state
      userId: null,
      activeGame: null,
      gamePlayers: [],
      sortMode: 'level-desc',
      lastSavedAt: null,
      isLoading: false,
      isSaving: false,

      // Actions
      setUserId: (id) => set({ userId: id }),

      setActiveGame: (game) => set({ activeGame: game }),

      setGamePlayers: (players) => set({ gamePlayers: players }),

      setGamePlayersOrder: (orderedIds) =>
        set((state) => ({
          gamePlayers: orderedIds
            .map((id) => state.gamePlayers.find((p) => p.id === id))
            .filter((p): p is GamePlayerWithInfo => p !== undefined),
        })),

      setSortMode: (mode) => set({ sortMode: mode }),

      setLoading: (loading) => set({ isLoading: loading }),

      setSaving: (saving) => set({ isSaving: saving }),

      setLastSavedAt: (timestamp) => set({ lastSavedAt: timestamp }),

      updatePlayerLevel: (gamePlayerId, newLevel) =>
        set((state) => ({
          gamePlayers: state.gamePlayers.map((p) =>
            p.id === gamePlayerId ? { ...p, level: newLevel } : p
          ),
        })),

      clearGame: () =>
        set({
          activeGame: null,
          gamePlayers: [],
          sortMode: 'level-desc',
          lastSavedAt: null,
        }),
    }),
    {
      name: 'munchkin-store',
      storage,
      // Persistir apenas dados essenciais — token JWT é gerenciado pelo Supabase client
      partialize: (state) => ({
        userId: state.userId,
        activeGame: state.activeGame,
        gamePlayers: state.gamePlayers,
        sortMode: state.sortMode,
        lastSavedAt: state.lastSavedAt,
      }),
    }
  )
);
