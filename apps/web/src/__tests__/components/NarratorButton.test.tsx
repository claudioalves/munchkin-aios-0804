import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NarratorButton } from '@/components/NarratorButton/NarratorButton';

describe('NarratorButton', () => {
  it('exibe "Narrar" quando não está narrando', () => {
    render(<NarratorButton isSupported isSpeaking={false} onClick={vi.fn()} />);
    expect(screen.getByText(/Narrar/)).toBeInTheDocument();
  });

  it('exibe "Parar" quando está narrando', () => {
    render(<NarratorButton isSupported isSpeaking onClick={vi.fn()} />);
    expect(screen.getByText(/Parar/)).toBeInTheDocument();
  });

  it('está desabilitado quando !isSupported', () => {
    render(<NarratorButton isSupported={false} isSpeaking={false} onClick={vi.fn()} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('chama onClick ao clicar', async () => {
    const onClick = vi.fn();
    render(<NarratorButton isSupported isSpeaking={false} onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('não chama onClick quando desabilitado', async () => {
    const onClick = vi.fn();
    render(<NarratorButton isSupported={false} isSpeaking={false} onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });
});
