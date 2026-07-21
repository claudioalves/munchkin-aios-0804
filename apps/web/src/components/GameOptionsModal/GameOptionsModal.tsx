interface GameOptionsModalProps {
  isOpen: boolean;
  isTransActive: boolean;
  onClose: () => void;
  onToggleTrans: (active: boolean) => void;
  onEditTransNames: () => void;
}

export function GameOptionsModal({
  isOpen,
  isTransActive,
  onClose,
  onToggleTrans,
  onEditTransNames,
}: GameOptionsModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-card-enter"
      role="dialog"
      aria-modal="true"
      aria-labelledby="options-modal-title"
    >
      <div className="w-full max-w-sm rounded-2xl bg-surface-card border border-parchment-dim/30 p-6 flex flex-col gap-6 shadow-card">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden>⚙️</span>
            <h2 id="options-modal-title" className="font-heading text-lg font-bold text-parchment">
              Opções da Partida
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar opções"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-parchment-muted hover:text-parchment hover:bg-surface-elevated transition-colors text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Opção Dungeon Trans */}
        <div className="flex flex-col gap-3 p-4 rounded-xl bg-surface-base/60 border border-parchment-dim/20">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="font-heading font-semibold text-sm text-parchment">
                Dungeon Trans 👑
              </span>
              <span className="font-body text-xs text-parchment-muted">
                Troca temporária por nomes femininos
              </span>
            </div>

            {/* Toggle Switch */}
            <button
              onClick={() => onToggleTrans(!isTransActive)}
              role="switch"
              aria-checked={isTransActive}
              className={`relative w-12 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                isTransActive ? 'bg-brand-gold' : 'bg-surface-elevated border border-parchment-dim/40'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full shadow-md transition-transform ${
                  isTransActive ? 'translate-x-6 bg-surface-base' : 'translate-x-0 bg-parchment-muted'
                }`}
              />
            </button>
          </div>

          {isTransActive && (
            <button
              onClick={onEditTransNames}
              className="mt-2 py-2 px-3 rounded-lg bg-surface-card border border-brand-gold/40 hover:border-brand-gold font-heading text-xs text-brand-gold hover:text-parchment transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>✏️ Editar Nomes Femininos</span>
            </button>
          )}
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-surface-elevated border border-parchment-dim/30 font-heading text-sm text-parchment hover:border-parchment transition-colors cursor-pointer"
        >
          Concluído
        </button>
      </div>
    </div>
  );
}
