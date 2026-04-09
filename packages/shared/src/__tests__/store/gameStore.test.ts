import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../../store/gameStore';
import type { Game, GamePlayerWithInfo } from '../../types';

const baseGame: Game = {
  id: 'game-1',
  owner_id: 'user-1',
  epic_mode: false,
  max_level: 10,
  victory_level: 10,
  status: 'active',
  player_order: [],
  sort_mode: 'level-desc',
  started_at: '2024-01-01T00:00:00Z',
  finished_at: null,
};

const basePlayer: GamePlayerWithInfo = {
  id: 'gp-1',
  game_id: 'game-1',
  player_id: 'p-1',
  level: 1,
  position: 0,
  updated_at: '2024-01-01T00:00:00Z',
  player: {
    id: 'p-1',
    owner_id: 'user-1',
    name: 'Alice',
    color: '#ff0000',
    avatar_url: null,
    created_at: '2024-01-01T00:00:00Z',
  },
};

const secondPlayer: GamePlayerWithInfo = {
  id: 'gp-2',
  game_id: 'game-1',
  player_id: 'p-2',
  level: 3,
  position: 1,
  updated_at: '2024-01-01T00:00:00Z',
  player: {
    id: 'p-2',
    owner_id: 'user-1',
    name: 'Bob',
    color: '#0000ff',
    avatar_url: null,
    created_at: '2024-01-01T00:00:00Z',
  },
};

const estadoInicial = {
  userId: null,
  activeGame: null,
  gamePlayers: [],
  sortMode: 'level-desc' as const,
  lastSavedAt: null,
  isLoading: false,
  isSaving: false,
};

describe('gameStore', () => {
  beforeEach(() => {
    useGameStore.setState(estadoInicial);
  });

  describe('setActiveGame', () => {
    it('atualiza activeGame com o jogo informado', () => {
      useGameStore.getState().setActiveGame(baseGame);
      expect(useGameStore.getState().activeGame).toEqual(baseGame);
    });

    it('define activeGame como null', () => {
      useGameStore.setState({ activeGame: baseGame });
      useGameStore.getState().setActiveGame(null);
      expect(useGameStore.getState().activeGame).toBeNull();
    });
  });

  describe('setGamePlayers', () => {
    it('substitui o array de jogadores', () => {
      useGameStore.setState({ gamePlayers: [basePlayer] });
      useGameStore.getState().setGamePlayers([secondPlayer]);
      expect(useGameStore.getState().gamePlayers).toEqual([secondPlayer]);
    });

    it('aceita array vazio', () => {
      useGameStore.setState({ gamePlayers: [basePlayer] });
      useGameStore.getState().setGamePlayers([]);
      expect(useGameStore.getState().gamePlayers).toEqual([]);
    });
  });

  describe('updatePlayerLevel', () => {
    it('atualiza apenas o nível do jogador correto', () => {
      useGameStore.setState({ gamePlayers: [basePlayer, secondPlayer] });
      useGameStore.getState().updatePlayerLevel('gp-1', 5);
      const players = useGameStore.getState().gamePlayers;
      expect(players[0].level).toBe(5);
      expect(players[1].level).toBe(3);
    });

    it('não altera outros campos do jogador', () => {
      useGameStore.setState({ gamePlayers: [basePlayer] });
      useGameStore.getState().updatePlayerLevel('gp-1', 7);
      const player = useGameStore.getState().gamePlayers[0];
      expect(player.id).toBe('gp-1');
      expect(player.player.name).toBe('Alice');
    });

    it('não altera jogadores com id diferente', () => {
      useGameStore.setState({ gamePlayers: [basePlayer, secondPlayer] });
      useGameStore.getState().updatePlayerLevel('gp-2', 9);
      expect(useGameStore.getState().gamePlayers[0].level).toBe(1);
    });
  });

  describe('setGamePlayersOrder', () => {
    it('reordena jogadores pelo array de IDs', () => {
      useGameStore.setState({ gamePlayers: [basePlayer, secondPlayer] });
      useGameStore.getState().setGamePlayersOrder(['gp-2', 'gp-1']);
      const players = useGameStore.getState().gamePlayers;
      expect(players[0].id).toBe('gp-2');
      expect(players[1].id).toBe('gp-1');
    });

    it('ignora IDs que não existem no array atual', () => {
      useGameStore.setState({ gamePlayers: [basePlayer] });
      useGameStore.getState().setGamePlayersOrder(['gp-999', 'gp-1']);
      const players = useGameStore.getState().gamePlayers;
      expect(players).toHaveLength(1);
      expect(players[0].id).toBe('gp-1');
    });
  });

  describe('setSortMode', () => {
    it('atualiza sortMode para o modo informado', () => {
      useGameStore.getState().setSortMode('random');
      expect(useGameStore.getState().sortMode).toBe('random');
    });

    it('atualiza sortMode para custom', () => {
      useGameStore.getState().setSortMode('custom');
      expect(useGameStore.getState().sortMode).toBe('custom');
    });
  });

  describe('clearGame', () => {
    it('reseta activeGame para null', () => {
      useGameStore.setState({ activeGame: baseGame });
      useGameStore.getState().clearGame();
      expect(useGameStore.getState().activeGame).toBeNull();
    });

    it('reseta gamePlayers para array vazio', () => {
      useGameStore.setState({ gamePlayers: [basePlayer] });
      useGameStore.getState().clearGame();
      expect(useGameStore.getState().gamePlayers).toEqual([]);
    });

    it('reseta sortMode para level-desc', () => {
      useGameStore.setState({ sortMode: 'custom' });
      useGameStore.getState().clearGame();
      expect(useGameStore.getState().sortMode).toBe('level-desc');
    });

    it('reseta lastSavedAt para null', () => {
      useGameStore.setState({ lastSavedAt: '2024-01-01T10:00:00Z' });
      useGameStore.getState().clearGame();
      expect(useGameStore.getState().lastSavedAt).toBeNull();
    });
  });

  describe('setLastSavedAt', () => {
    it('atualiza lastSavedAt com o timestamp informado', () => {
      const timestamp = '2024-06-15T12:00:00Z';
      useGameStore.getState().setLastSavedAt(timestamp);
      expect(useGameStore.getState().lastSavedAt).toBe(timestamp);
    });
  });
});
