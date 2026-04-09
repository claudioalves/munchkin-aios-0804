import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VictoryModal } from '@/components/VictoryModal/VictoryModal';

vi.mock('@/hooks/useTTS', () => ({
  useTTS: () => ({
    isSupported: false,
    speak: vi.fn(),
    stop: vi.fn(),
    voices: [],
    selectedVoiceURI: '',
    setVoice: vi.fn(),
    isSpeaking: false,
  }),
}));

const mockWinner = {
  id: 'gp-1',
  game_id: 'g-1',
  player_id: 'p-1',
  level: 10,
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
};

describe('VictoryModal', () => {
  it('renderiza o nome do vencedor', () => {
    render(<VictoryModal winner={mockWinner} onFinish={vi.fn()} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('renderiza o nível do vencedor', () => {
    render(<VictoryModal winner={mockWinner} onFinish={vi.fn()} />);
    expect(screen.getByText(/Nível 10/)).toBeInTheDocument();
  });

  it('exibe título "Vitória!"', () => {
    render(<VictoryModal winner={mockWinner} onFinish={vi.fn()} />);
    expect(screen.getByText('Vitória!')).toBeInTheDocument();
  });

  it('chama onFinish ao clicar em Encerrar Partida', async () => {
    const onFinish = vi.fn().mockResolvedValue(undefined);
    render(<VictoryModal winner={mockWinner} onFinish={onFinish} />);
    await userEvent.click(screen.getByText('Encerrar Partida'));
    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it('mostra "Encerrando..." durante o processamento', async () => {
    let resolve!: () => void;
    const onFinish = vi.fn().mockReturnValue(new Promise<void>((r) => { resolve = r; }));
    render(<VictoryModal winner={mockWinner} onFinish={onFinish} />);
    await userEvent.click(screen.getByText('Encerrar Partida'));
    expect(screen.getByText('Encerrando...')).toBeInTheDocument();
    await act(async () => { resolve(); });
  });
});
