import { describe, it, expect, vi } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../database.types';
import { getSnapshots, updateLevel, captureSnapshot } from '../../services/levels';
import type { GamePlayerWithInfo, LevelSnapshot } from '../../types';

type MockSupabase = SupabaseClient<Database>;

describe('getSnapshots', () => {
  it('retorna snapshots corretamente', async () => {
    const mockData: LevelSnapshot[] = [
      { id: '1', game_id: 'g1', player_id: 'p1', level: 3, captured_at: '2024-01-01T10:00:00Z' },
    ];
    const mockOrder = vi.fn().mockResolvedValue({ data: mockData, error: null });
    const mockEq = vi.fn().mockReturnValue({ order: mockOrder });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    const supabase = { from: vi.fn().mockReturnValue({ select: mockSelect }) } as unknown as MockSupabase;

    const result = await getSnapshots(supabase, 'g1');

    expect(result).toEqual(mockData);
    expect(supabase.from).toHaveBeenCalledWith('level_snapshots');
    expect(mockSelect).toHaveBeenCalledWith('*');
    expect(mockEq).toHaveBeenCalledWith('game_id', 'g1');
    expect(mockOrder).toHaveBeenCalledWith('captured_at', { ascending: true });
  });

  it('lança erro quando Supabase retorna error', async () => {
    const mockOrder = vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } });
    const mockEq = vi.fn().mockReturnValue({ order: mockOrder });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    const supabase = { from: vi.fn().mockReturnValue({ select: mockSelect }) } as unknown as MockSupabase;

    await expect(getSnapshots(supabase, 'g1')).rejects.toThrow('Failed to get snapshots: DB error');
  });
});

describe('updateLevel', () => {
  it('chama a query correta para atualizar o nível', async () => {
    const mockEq = vi.fn().mockResolvedValue({ error: null });
    const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });
    const supabase = { from: vi.fn().mockReturnValue({ update: mockUpdate }) } as unknown as MockSupabase;

    await updateLevel(supabase, 'gp-1', 5);

    expect(supabase.from).toHaveBeenCalledWith('game_players');
    expect(mockUpdate).toHaveBeenCalledWith({ level: 5 });
    expect(mockEq).toHaveBeenCalledWith('id', 'gp-1');
  });

  it('lança erro em caso de falha', async () => {
    const mockEq = vi.fn().mockResolvedValue({ error: { message: 'update failed' } });
    const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });
    const supabase = { from: vi.fn().mockReturnValue({ update: mockUpdate }) } as unknown as MockSupabase;

    await expect(updateLevel(supabase, 'gp-1', 5)).rejects.toThrow('Failed to update level: update failed');
  });
});

describe('captureSnapshot', () => {
  const makePlayers = (): GamePlayerWithInfo[] => [
    {
      id: 'gp-1',
      game_id: 'g1',
      player_id: 'p-1',
      level: 3,
      position: 0,
      updated_at: '2024-01-01T00:00:00Z',
      player: {
        id: 'p-1',
        owner_id: 'u-1',
        name: 'Alice',
        color: '#ff0000',
        avatar_url: null,
        created_at: '2024-01-01T00:00:00Z',
      },
    },
    {
      id: 'gp-2',
      game_id: 'g1',
      player_id: 'p-2',
      level: 5,
      position: 1,
      updated_at: '2024-01-01T00:00:00Z',
      player: {
        id: 'p-2',
        owner_id: 'u-1',
        name: 'Bob',
        color: '#0000ff',
        avatar_url: null,
        created_at: '2024-01-01T00:00:00Z',
      },
    },
  ];

  it('insere snapshots para todos os jogadores', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null });
    const supabase = { from: vi.fn().mockReturnValue({ insert: mockInsert }) } as unknown as MockSupabase;
    const players = makePlayers();

    await captureSnapshot(supabase, 'g1', players);

    expect(supabase.from).toHaveBeenCalledWith('level_snapshots');
    expect(mockInsert).toHaveBeenCalledWith([
      { game_id: 'g1', player_id: 'p-1', level: 3 },
      { game_id: 'g1', player_id: 'p-2', level: 5 },
    ]);
  });

  it('lança erro em caso de falha', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: { message: 'insert failed' } });
    const supabase = { from: vi.fn().mockReturnValue({ insert: mockInsert }) } as unknown as MockSupabase;

    await expect(captureSnapshot(supabase, 'g1', makePlayers())).rejects.toThrow(
      'Failed to capture snapshot: insert failed',
    );
  });
});
