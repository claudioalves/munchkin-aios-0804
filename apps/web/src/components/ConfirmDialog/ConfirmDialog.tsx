import { useEffect } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  danger = false,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <div
        className="bg-surface-card rounded-xl p-6 shadow-card max-w-sm w-full space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-heading text-parchment text-lg">{title}</h2>
        {description && (
          <p className="font-body text-parchment-muted text-sm">{description}</p>
        )}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="font-heading text-parchment-muted px-4 py-2 rounded-lg hover:bg-surface-elevated transition-colors text-sm"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            autoFocus
            className={`font-heading font-semibold px-4 py-2 rounded-lg text-sm transition-colors ${
              danger
                ? 'bg-brand-ruby text-parchment hover:bg-brand-ruby-light'
                : 'bg-brand-gold text-surface-base hover:bg-brand-gold-light'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
