import { useState, useEffect, type FormEvent } from 'react';
import type { GamePlayerWithInfo } from '@munchkin/shared';

interface PlayerProfileModalProps {
  gp: GamePlayerWithInfo | null;
  isTransActive: boolean;
  onClose: () => void;
  onSaveFemaleName: (gamePlayerId: string, femaleName: string) => void;
}

export function PlayerProfileModal({
  gp,
  isTransActive,
  onClose,
  onSaveFemaleName,
}: PlayerProfileModalProps) {
  const [femaleName, setFemaleName] = useState('');

  useEffect(() => {
    if (gp) {
      setFemaleName(gp.female_name || '');
    }
  }, [gp]);

  if (!gp) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSaveFemaleName(gp.id, femaleName.trim());
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-card-enter"
      role="dialog"
      aria-modal="true"
      aria-labelledby="player-profile-title"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl bg-surface-card border border-parchment-dim/30 p-6 flex flex-col gap-5 shadow-card"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="w-4 h-4 rounded-full shrink-0"
              style={{ backgroundColor: gp.player.color }}
            />
            <h2 id="player-profile-title" className="font-heading text-lg font-bold text-parchment truncate max-w-[200px]">
              {gp.player.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar perfil"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-parchment-muted hover:text-parchment hover:bg-surface-elevated transition-colors text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Nível atual */}
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-surface-base/60 border border-parchment-dim/20">
          <span className="font-heading text-xs text-parchment-muted uppercase tracking-wider">
            Nível na Partida
          </span>
          <span className="font-display text-2xl font-black text-brand-gold">
            {gp.level}
          </span>
        </div>

        {/* Campo de Nome Feminino se a Dungeon Trans estiver ativa ou disponível */}
        {isTransActive ? (
          <div className="flex flex-col gap-2">
            <label htmlFor="female-name-input" className="font-heading text-xs text-parchment-muted">
              Nome Feminino (Dungeon Trans 👑)
            </label>
            <input
              id="female-name-input"
              type="text"
              value={femaleName}
              onChange={(e) => setFemaleName(e.target.value)}
              placeholder="Digite o nome feminino"
              className="w-full px-3 py-2.5 rounded-xl bg-surface-base border border-parchment-dim/40 text-parchment placeholder:text-parchment-dim text-sm font-body focus:outline-none focus:border-brand-gold transition-colors"
            />
          </div>
        ) : (
          <div className="text-xs text-parchment-dim italic">
            Para ativar ou gerenciar nomes femininos da dungeon, use o menu de Opções ⚙️ da partida.
          </div>
        )}

        {/* Ações */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-surface-elevated border border-parchment-dim/30 font-heading text-sm text-parchment-muted hover:text-parchment transition-colors cursor-pointer"
          >
            Fechar
          </button>
          {isTransActive && (
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-brand-gold hover:bg-brand-gold-light text-surface-base font-heading font-bold text-sm shadow-glow-gold transition-all cursor-pointer"
            >
              Salvar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
