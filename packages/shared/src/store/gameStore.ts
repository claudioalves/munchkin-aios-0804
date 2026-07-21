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
  viewMode: 'grid' | 'list';
  isTransDungeonActive: boolean;

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
  setViewMode: (mode: 'grid' | 'list') => void;
  setTransDungeonActive: (active: boolean) => void;
  setPlayerFemaleName: (gamePlayerId: string, femaleName: string) => void;
  setAllFemaleNames: (femaleNamesMap: Record<string, string>) => void;
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
      sortMode: 'custom',
      lastSavedAt: null,
      isLoading: false,
      isSaving: false,
      viewMode: 'grid',
      isTransDungeonActive: false,

      // Actions
      setUserId: (id) =>
        set((state) => {
          // Troca de usuário: limpar dados do jogo anterior para evitar vazamento entre contas
          if (id !== state.userId) {
            return { userId: id, activeGame: null, gamePlayers: [], sortMode: 'custom', lastSavedAt: null, isTransDungeonActive: false };
          }
          return { userId: id };
        }),

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
          sortMode: 'custom',
          lastSavedAt: null,
          isTransDungeonActive: false,
        }),

      setViewMode: (mode) => set({ viewMode: mode }),

      setTransDungeonActive: (active) => set({ isTransDungeonActive: active }),

      setPlayerFemaleName: (gamePlayerId, femaleName) =>
        set((state) => ({
          gamePlayers: state.gamePlayers.map((p) =>
            p.id === gamePlayerId ? { ...p, female_name: femaleName } : p
          ),
        })),

      setAllFemaleNames: (femaleNamesMap) =>
        set((state) => ({
          gamePlayers: state.gamePlayers.map((p) =>
            femaleNamesMap[p.id] !== undefined
              ? { ...p, female_name: femaleNamesMap[p.id] || null }
              : p
          ),
        })),
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
        viewMode: state.viewMode,
        isTransDungeonActive: state.isTransDungeonActive,
      }),
    }
  )
);
