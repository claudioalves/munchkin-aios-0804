import { describe, it, expect, vi } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../database.types';
import { getPlayers, createPlayer, deletePlayer } from '../../services/players';

type MockSupabase = SupabaseClient<Database>;

const mockPlayer = {
  id: 'p-1', owner_id: 'u-1', name: 'Alice', color: '#ff0000',
  avatar_url: null, created_at: '2024-01-01T00:00:00Z',
};

describe('getPlayers', () => {
  it('retorna array de jogadores', async () => {
    const mockOrder = vi.fn().mockResolvedValue({ data: [mockPlayer], error: null });
    const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
    const supabase = { from: vi.fn().mockReturnValue({ select: mockSelect }) } as unknown as MockSupabase;

    const result = await getPlayers(supabase);

    expect(supabase.from).toHaveBeenCalledWith('players');
    expect(result).toEqual([mockPlayer]);
  });

  it('retorna array vazio quando data é null', async () => {
    const mockOrder = vi.fn().mockResolvedValue({ data: null, error: null });
    const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
    const supabase = { from: vi.fn().mockReturnValue({ select: mockSelect }) } as unknown as MockSupabase;

    const result = await getPlayers(supabase);

    expect(result).toEqual([]);
  });

  it('lança erro em caso de falha', async () => {
    const mockOrder = vi.fn().mockResolvedValue({ data: null, error: { message: 'fetch failed' } });
    const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
    const supabase = { from: vi.fn().mockReturnValue({ select: mockSelect }) } as unknown as MockSupabase;

    await expect(getPlayers(supabase)).rejects.toThrow('Failed to fetch players: fetch failed');
  });
});

describe('createPlayer', () => {
  it('insere e retorna o novo jogador', async () => {
    const mockSingle = vi.fn().mockResolvedValue({ data: mockPlayer, error: null });
    const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
    const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });
    const supabase = { from: vi.fn().mockReturnValue({ insert: mockInsert }) } as unknown as MockSupabase;

    const result = await createPlayer(supabase, 'Alice', '#ff0000');

    expect(supabase.from).toHaveBeenCalledWith('players');
    expect(mockInsert).toHaveBeenCalledWith({ name: 'Alice', color: '#ff0000' });
    expect(result).toEqual(mockPlayer);
  });

  it('trima espaços do nome', async () => {
    const mockSingle = vi.fn().mockResolvedValue({ data: mockPlayer, error: null });
    const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
    const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });
    const supabase = { from: vi.fn().mockReturnValue({ insert: mockInsert }) } as unknown as MockSupabase;

    await createPlayer(supabase, '  Alice  ', '#ff0000');

    expect(mockInsert).toHaveBeenCalledWith({ name: 'Alice', color: '#ff0000' });
  });

  it('lança erro em caso de falha', async () => {
    const mockSingle = vi.fn().mockResolvedValue({ data: null, error: { message: 'insert failed' } });
    const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
    const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });
    const supabase = { from: vi.fn().mockReturnValue({ insert: mockInsert }) } as unknown as MockSupabase;

    await expect(createPlayer(supabase, 'Alice', '#ff0000')).rejects.toThrow('Failed to create player: insert failed');
  });
});

describe('deletePlayer', () => {
  it('chama delete com o id correto', async () => {
    const mockEq = vi.fn().mockResolvedValue({ error: null });
    const mockDelete = vi.fn().mockReturnValue({ eq: mockEq });
    const supabase = { from: vi.fn().mockReturnValue({ delete: mockDelete }) } as unknown as MockSupabase;

    await deletePlayer(supabase, 'p-1');

    expect(supabase.from).toHaveBeenCalledWith('players');
    expect(mockEq).toHaveBeenCalledWith('id', 'p-1');
  });

  it('lança erro em caso de falha', async () => {
    const mockEq = vi.fn().mockResolvedValue({ error: { message: 'delete failed' } });
    const mockDelete = vi.fn().mockReturnValue({ eq: mockEq });
    const supabase = { from: vi.fn().mockReturnValue({ delete: mockDelete }) } as unknown as MockSupabase;

    await expect(deletePlayer(supabase, 'p-1')).rejects.toThrow('Failed to delete player: delete failed');
  });
});
