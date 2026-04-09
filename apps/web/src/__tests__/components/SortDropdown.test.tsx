import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SortDropdown } from '@/components/SortDropdown/SortDropdown';

describe('SortDropdown', () => {
  it('exibe as 3 opções de ordenação', () => {
    render(<SortDropdown sortMode="level-desc" onSortChange={vi.fn()} />);
    expect(screen.getByText(/Por Nível/)).toBeInTheDocument();
    expect(screen.getByText(/Aleatório/)).toBeInTheDocument();
    expect(screen.getByText(/Personalizado/)).toBeInTheDocument();
  });

  it('chama onSortChange com "random" ao clicar em Aleatório', async () => {
    const onSortChange = vi.fn();
    render(<SortDropdown sortMode="level-desc" onSortChange={onSortChange} />);
    await userEvent.click(screen.getByText(/Aleatório/));
    expect(onSortChange).toHaveBeenCalledWith('random');
  });

  it('chama onSortChange com "custom" ao clicar em Personalizado', async () => {
    const onSortChange = vi.fn();
    render(<SortDropdown sortMode="level-desc" onSortChange={onSortChange} />);
    await userEvent.click(screen.getByText(/Personalizado/));
    expect(onSortChange).toHaveBeenCalledWith('custom');
  });

  it('chama onSortChange com "level-desc" ao clicar em Por Nível', async () => {
    const onSortChange = vi.fn();
    render(<SortDropdown sortMode="custom" onSortChange={onSortChange} />);
    await userEvent.click(screen.getByText(/Por Nível/));
    expect(onSortChange).toHaveBeenCalledWith('level-desc');
  });

  it('destaca o modo ativo com classe bg-brand-gold', () => {
    render(<SortDropdown sortMode="random" onSortChange={vi.fn()} />);
    const randomBtn = screen.getByText(/Aleatório/).closest('button')!;
    expect(randomBtn.className).toContain('bg-brand-gold');
  });

  it('os modos inativos não têm classe bg-brand-gold', () => {
    render(<SortDropdown sortMode="random" onSortChange={vi.fn()} />);
    const levelBtn = screen.getByText(/Por Nível/).closest('button')!;
    expect(levelBtn.className).not.toContain('bg-brand-gold');
  });
});
