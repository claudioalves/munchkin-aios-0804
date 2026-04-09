import { describe, it, expect, vi } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../database.types';
import { getActiveGame, finishGame, updateGameOrder } from '../../services/games';

type MockSupabase = SupabaseClient<Database>;

describe('getActiveGame', () => {
  it('retorna o jogo ativo quando existe', async () => {
    const mockGame = {
      id: 'g1', owner_id: 'u1', epic_mode: false, max_level: 10,
      victory_level: 10, status: 'active', player_order: [], sort_mode: 'level-desc',
      started_at: '2024-01-01T00:00:00Z', finished_at: null,
      game_players: [],
    };
    const mockMaybeSingle = vi.fn().mockResolvedValue({ data: mockGame, error: null });
    const mockEq = vi.fn().mockReturnValue({ maybeSingle: mockMaybeSingle });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    const supabase = { from: vi.fn().mockReturnValue({ select: mockSelect }) } as unknown as MockSupabase;

    const result = await getActiveGame(supabase);

    expect(supabase.from).toHaveBeenCalledWith('games');
    expect(result).toEqual(mockGame);
  });

  it('retorna null quando não há jogo ativo', async () => {
    const mockMaybeSingle = vi.fn().mockResolvedValue({ data: null, error: null });
    const mockEq = vi.fn().mockReturnValue({ maybeSingle: mockMaybeSingle });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    const supabase = { from: vi.fn().mockReturnValue({ select: mockSelect }) } as unknown as MockSupabase;

    const result = await getActiveGame(supabase);

    expect(result).toBeNull();
  });

  it('lança erro em caso de falha', async () => {
    const mockMaybeSingle = vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } });
    const mockEq = vi.fn().mockReturnValue({ maybeSingle: mockMaybeSingle });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    const supabase = { from: vi.fn().mockReturnValue({ select: mockSelect }) } as unknown as MockSupabase;

    await expect(getActiveGame(supabase)).rejects.toThrow('Failed to fetch active game: DB error');
  });
});

describe('finishGame', () => {
  it('chama delete com o gameId correto', async () => {
    const mockEq = vi.fn().mockResolvedValue({ error: null });
    const mockDelete = vi.fn().mockReturnValue({ eq: mockEq });
    const supabase = { from: vi.fn().mockReturnValue({ delete: mockDelete }) } as unknown as MockSupabase;

    await finishGame(supabase, 'g1');

    expect(supabase.from).toHaveBeenCalledWith('games');
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith('id', 'g1');
  });

  it('lança erro em caso de falha', async () => {
    const mockEq = vi.fn().mockResolvedValue({ error: { message: 'delete failed' } });
    const mockDelete = vi.fn().mockReturnValue({ eq: mockEq });
    const supabase = { from: vi.fn().mockReturnValue({ delete: mockDelete }) } as unknown as MockSupabase;

    await expect(finishGame(supabase, 'g1')).rejects.toThrow('Failed to finish game: delete failed');
  });
});

describe('updateGameOrder', () => {
  it('chama update com player_order correto', async () => {
    const mockEq = vi.fn().mockResolvedValue({ error: null });
    const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });
    const supabase = { from: vi.fn().mockReturnValue({ update: mockUpdate }) } as unknown as MockSupabase;
    const order = ['gp-2', 'gp-1', 'gp-3'];

    await updateGameOrder(supabase, 'g1', order);

    expect(supabase.from).toHaveBeenCalledWith('games');
    expect(mockUpdate).toHaveBeenCalledWith({ player_order: order });
    expect(mockEq).toHaveBeenCalledWith('id', 'g1');
  });

  it('lança erro em caso de falha', async () => {
    const mockEq = vi.fn().mockResolvedValue({ error: { message: 'update failed' } });
    const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });
    const supabase = { from: vi.fn().mockReturnValue({ update: mockUpdate }) } as unknown as MockSupabase;

    await expect(updateGameOrder(supabase, 'g1', [])).rejects.toThrow('Failed to update game order: update failed');
  });
});
