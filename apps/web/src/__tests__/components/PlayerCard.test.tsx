import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PlayerCard } from '@/components/PlayerCard/PlayerCard';

const defaultProps = {
  gamePlayerId: 'gp-1',
  name: 'Alice',
  color: '#ff0000',
  level: 3,
  maxLevel: 10,
  isLeader: false,
  isVictory: false,
  onIncrement: vi.fn(),
  onDecrement: vi.fn(),
};

describe('PlayerCard', () => {
  it('renderiza o nome do jogador', () => {
    render(<PlayerCard {...defaultProps} />);
    // CSS uppercase não afeta o textContent — o valor real no DOM é 'Alice'
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('renderiza o nível atual', () => {
    render(<PlayerCard {...defaultProps} level={7} />);
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('chama onIncrement com o gamePlayerId ao clicar em +', async () => {
    const onIncrement = vi.fn();
    render(<PlayerCard {...defaultProps} onIncrement={onIncrement} />);
    await userEvent.click(screen.getByLabelText('Aumentar nível de Alice'));
    expect(onIncrement).toHaveBeenCalledWith('gp-1');
  });

  it('chama onDecrement com o gamePlayerId ao clicar em −', async () => {
    const onDecrement = vi.fn();
    render(<PlayerCard {...defaultProps} onDecrement={onDecrement} />);
    await userEvent.click(screen.getByLabelText('Diminuir nível de Alice'));
    expect(onDecrement).toHaveBeenCalledWith('gp-1');
  });

  it('desabilita o botão − no nível 1', () => {
    render(<PlayerCard {...defaultProps} level={1} />);
    expect(screen.getByLabelText('Diminuir nível de Alice')).toBeDisabled();
  });

  it('desabilita o botão + no nível máximo', () => {
    render(<PlayerCard {...defaultProps} level={10} maxLevel={10} />);
    expect(screen.getByLabelText('Aumentar nível de Alice')).toBeDisabled();
  });

  it('exibe badge de vitória quando isVictory', () => {
    render(<PlayerCard {...defaultProps} isVictory />);
    expect(screen.getByText(/Vitória/)).toBeInTheDocument();
  });

  it('desabilita ambos os botões quando isVictory', () => {
    render(<PlayerCard {...defaultProps} isVictory level={10} maxLevel={10} />);
    expect(screen.getByLabelText('Aumentar nível de Alice')).toBeDisabled();
    expect(screen.getByLabelText('Diminuir nível de Alice')).toBeDisabled();
  });

  it('não exibe badge de vitória quando !isVictory', () => {
    render(<PlayerCard {...defaultProps} />);
    expect(screen.queryByText(/Vitória/)).not.toBeInTheDocument();
  });
});
