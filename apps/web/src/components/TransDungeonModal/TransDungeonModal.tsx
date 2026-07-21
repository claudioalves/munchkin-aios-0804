import { useState, useEffect, type FormEvent } from 'react';
import type { GamePlayerWithInfo } from '@munchkin/shared';

interface TransDungeonModalProps {
  isOpen: boolean;
  gamePlayers: GamePlayerWithInfo[];
  onClose: () => void;
  onSave: (femaleNamesMap: Record<string, string>) => void;
}

export function TransDungeonModal({
  isOpen,
  gamePlayers,
  onClose,
  onSave,
}: TransDungeonModalProps) {
  const [namesMap, setNamesMap] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      const initialMap: Record<string, string> = {};
      gamePlayers.forEach((gp) => {
        initialMap[gp.id] = gp.female_name || '';
      });
      setNamesMap(initialMap);
    }
  }, [isOpen, gamePlayers]);

  if (!isOpen) return null;

  const handleTextChange = (gpId: string, value: string) => {
    setNamesMap((prev) => ({ ...prev, [gpId]: value }));
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(namesMap);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-card-enter overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="trans-modal-title"
    >
      <form
        onSubmit={handleFormSubmit}
        className="w-full max-w-md my-auto rounded-2xl bg-surface-card border border-brand-gold/40 p-6 flex flex-col gap-5 shadow-card"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden>👑</span>
            <h2 id="trans-modal-title" className="font-heading text-lg font-bold text-parchment">
              Nomes Femininos (Dungeon Trans)
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar modal"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-parchment-muted hover:text-parchment hover:bg-surface-elevated transition-colors text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        <p className="font-body text-xs text-parchment-muted">
          Informe o nome feminino de cada jogador durante a troca de gênero desta dungeon. Ao encerrar a partida, estes nomes serão apagados.
        </p>

        {/* Lista de Jogadores */}
        <div className="flex flex-col gap-3 max-h-[50vh] overflow-y-auto pr-1">
          {gamePlayers.map((gp) => (
            <div
              key={gp.id}
              className="flex flex-col gap-1.5 p-3 rounded-xl bg-surface-base/80 border border-parchment-dim/20"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: gp.player.color }}
                />
                <span className="font-heading text-sm text-parchment font-semibold truncate">
                  {gp.player.name}
                </span>
              </div>
              <input
                type="text"
                value={namesMap[gp.id] || ''}
                onChange={(e) => handleTextChange(gp.id, e.target.value)}
                placeholder={`Ex: Nome feminino de ${gp.player.name}`}
                className="w-full px-3 py-2 rounded-lg bg-surface-card border border-parchment-dim/40 text-parchment placeholder:text-parchment-dim text-sm font-body focus:outline-none focus:border-brand-gold transition-colors"
              />
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-surface-elevated border border-parchment-dim/30 font-heading text-sm text-parchment-muted hover:text-parchment transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 py-2.5 rounded-xl bg-brand-gold hover:bg-brand-gold-light text-surface-base font-heading font-bold text-sm shadow-glow-gold transition-all cursor-pointer"
          >
            Salvar Nomes
          </button>
        </div>
      </form>
    </div>
  );
}
