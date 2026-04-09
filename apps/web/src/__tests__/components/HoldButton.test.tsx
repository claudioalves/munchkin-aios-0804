import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { HoldButton } from '@/components/HoldButton/HoldButton';

describe('HoldButton', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renderiza com o label padrão', () => {
    render(<HoldButton onComplete={vi.fn()} />);
    expect(screen.getByText('Segurar 3s para encerrar')).toBeInTheDocument();
  });

  it('renderiza com label personalizado', () => {
    render(<HoldButton onComplete={vi.fn()} label="Segurar para confirmar" />);
    expect(screen.getByText('Segurar para confirmar')).toBeInTheDocument();
  });

  it('chama onComplete após segurar o holdDuration completo', () => {
    const onComplete = vi.fn();
    render(<HoldButton onComplete={onComplete} holdDuration={1000} />);
    const btn = screen.getByRole('button');

    fireEvent.pointerDown(btn);
    act(() => {
      vi.advanceTimersByTime(1100);
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('não chama onComplete ao soltar antes do tempo', () => {
    const onComplete = vi.fn();
    render(<HoldButton onComplete={onComplete} holdDuration={1000} />);
    const btn = screen.getByRole('button');

    fireEvent.pointerDown(btn);
    act(() => { vi.advanceTimersByTime(400); });
    fireEvent.pointerUp(btn);
    act(() => { vi.advanceTimersByTime(700); });

    expect(onComplete).not.toHaveBeenCalled();
  });

  it('cancela ao mover o ponteiro para fora', () => {
    const onComplete = vi.fn();
    render(<HoldButton onComplete={onComplete} holdDuration={1000} />);
    const btn = screen.getByRole('button');

    fireEvent.pointerDown(btn);
    act(() => { vi.advanceTimersByTime(400); });
    fireEvent.pointerLeave(btn);
    act(() => { vi.advanceTimersByTime(700); });

    expect(onComplete).not.toHaveBeenCalled();
  });
});
