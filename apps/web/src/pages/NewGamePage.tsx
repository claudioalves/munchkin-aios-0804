import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { getPlayers, GAME_CONFIG } from '@munchkin/shared';
import type { Player } from '@munchkin/shared';
import { QuickAddPlayer } from '@/components/QuickAddPlayer/QuickAddPlayer';

export default function NewGamePage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlayers(supabase)
      .then(setPlayers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < GAME_CONFIG.MAX_PLAYERS) {
        next.add(id);
      }
      return next;
    });
  };

  const handlePlayerCreated = (player: Player) => {
    setPlayers((prev) => [...prev, player]);
    setSelectedIds((prev) => new Set([...prev, player.id]));
  };

  const canStart =
    selectedIds.size >= GAME_CONFIG.MIN_PLAYERS &&
    selectedIds.size <= GAME_CONFIG.MAX_PLAYERS;

  return (
    <div className="min-h-screen bg-surface-base p-6 space-y-6 max-w-lg mx-auto">
      <header className="flex items-center gap-4">
        <Link
          to="/"
          className="text-parchment-muted hover:text-parchment transition-colors font-heading text-sm"
        >
          ← Voltar
        </Link>
        <div className="flex-1">
          <h1 className="font-heading text-parchment text-xl">Novo Jogo</h1>
          <p className="font-body text-parchment-dim text-xs">
            Passo 1/2: Selecione os jogadores
          </p>
        </div>
      </header>

      <p className="font-body text-parchment-muted text-sm">
        Selecionados: {selectedIds.size} / {GAME_CONFIG.MAX_PLAYERS}
        {selectedIds.size < GAME_CONFIG.MIN_PLAYERS && (
          <span className="text-parchment-dim"> (mínimo {GAME_CONFIG.MIN_PLAYERS})</span>
        )}
      </p>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 rounded-full border-2 border-brand-gold border-t-transparent animate-spin" />
        </div>
      ) : (
        <ul className="space-y-2">
          {players.map((player) => (
            <li key={player.id}>
              <button
                className="w-full text-left"
                onClick={() => toggleSelect(player.id)}
              >
                <div
                  className={`flex items-center gap-3 bg-surface-card rounded-xl px-4 py-3 transition-colors ${
                    selectedIds.has(player.id)
                      ? 'ring-2 ring-brand-gold'
                      : 'hover:bg-surface-elevated'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-heading text-surface-base text-sm font-bold flex-shrink-0"
                    style={{ backgroundColor: player.color }}
                  >
                    {player.name[0]?.toUpperCase()}
                  </div>
                  <span className="font-body text-parchment text-lg flex-1 truncate">
                    {player.name}
                  </span>
                  {selectedIds.has(player.id) && (
                    <span className="text-brand-gold text-sm font-heading">✓</span>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="space-y-2">
        <p className="font-body text-parchment-dim text-xs uppercase tracking-wider px-1">
          Adicionar jogador rápido
        </p>
        <QuickAddPlayer
          supabase={supabase}
          onPlayerCreated={handlePlayerCreated}
        />
      </div>

      <button
        disabled={!canStart}
        className="w-full bg-brand-gold text-surface-base font-heading font-semibold px-6 py-4 rounded-xl hover:bg-brand-gold-light transition-colors shadow-glow-gold text-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
      >
        Continuar →
      </button>
    </div>
  );
}
