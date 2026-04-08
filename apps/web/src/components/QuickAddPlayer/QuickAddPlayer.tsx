import { type FormEvent, useRef, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createPlayer, AVATAR_COLORS } from '@munchkin/shared';
import type { Database, Player } from '@munchkin/shared';
import { ColorPicker } from '@/components/ColorPicker/ColorPicker';

interface QuickAddPlayerProps {
  supabase: SupabaseClient<Database>;
  onPlayerCreated: (player: Player) => void;
  defaultColor?: string;
}

export function QuickAddPlayer({
  supabase,
  onPlayerCreated,
  defaultColor,
}: QuickAddPlayerProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState<string>(defaultColor ?? AVATAR_COLORS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const player = await createPlayer(supabase, name.trim(), color);
      onPlayerCreated(player);
      setName('');
      inputRef.current?.focus();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao criar jogador');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="flex gap-2 items-center bg-surface-card rounded-xl px-3 py-2"
      >
        <div
          className="w-5 h-5 rounded-full flex-shrink-0 cursor-pointer"
          style={{ backgroundColor: color }}
          title="Mudar cor"
        />
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Nome do novo jogador..."
          maxLength={30}
          disabled={loading}
          className="flex-1 bg-transparent font-body text-parchment placeholder-parchment-dim focus:outline-none text-sm disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="bg-brand-gold text-surface-base font-heading font-semibold px-3 py-1 rounded-lg text-sm hover:bg-brand-gold-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
        >
          {loading ? '...' : '+ ADD'}
        </button>
      </form>

      <div className="px-3">
        <ColorPicker value={color} onChange={setColor} />
      </div>

      {error && (
        <p className="font-body text-brand-ruby text-sm px-3">{error}</p>
      )}
    </div>
  );
}
