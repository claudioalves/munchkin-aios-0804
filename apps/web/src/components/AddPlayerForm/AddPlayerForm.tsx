import { type FormEvent, useState } from 'react';
import { AVATAR_COLORS } from '@munchkin/shared';
import { ColorPicker } from '@/components/ColorPicker/ColorPicker';

interface AddPlayerFormProps {
  onSubmit: (name: string, color: string) => Promise<void>;
  onCancel: () => void;
}

function validateName(name: string): string | null {
  if (!name.trim()) return 'Nome é obrigatório';
  if (name.trim().length > 30) return `Máximo 30 caracteres (${name.trim().length}/30)`;
  return null;
}

export function AddPlayerForm({ onSubmit, onCancel }: AddPlayerFormProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState<string>(AVATAR_COLORS[0]);
  const [nameError, setNameError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const err = validateName(name);
    if (err) {
      setNameError(err);
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmit(name.trim(), color);
      setName('');
      setColor(AVATAR_COLORS[0]);
      setNameError(null);
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Erro ao criar jogador');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="bg-surface-elevated rounded-xl p-4 space-y-4"
    >
      <h3 className="font-heading text-parchment text-base">Novo Jogador</h3>

      <div className="space-y-1">
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (nameError) setNameError(validateName(e.target.value));
          }}
          placeholder="Nome do jogador"
          maxLength={35}
          autoFocus
          className="w-full bg-surface-card border border-parchment-dim rounded-lg px-3 py-2 font-body text-parchment placeholder-parchment-dim focus:outline-none focus:border-brand-gold transition-colors"
        />
        {nameError && (
          <p className="font-body text-brand-ruby text-sm">{nameError}</p>
        )}
      </div>

      <div className="space-y-2">
        <p className="font-body text-parchment-dim text-xs uppercase tracking-wider">
          Cor
        </p>
        <ColorPicker value={color} onChange={setColor} />
      </div>

      {submitError && (
        <p className="font-body text-brand-ruby text-sm">{submitError}</p>
      )}

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="font-heading text-parchment-muted px-4 py-2 rounded-lg hover:bg-surface-card transition-colors text-sm"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="bg-brand-gold text-surface-base font-heading font-semibold px-4 py-2 rounded-lg hover:bg-brand-gold-light transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Salvando...' : 'Adicionar'}
        </button>
      </div>
    </form>
  );
}
