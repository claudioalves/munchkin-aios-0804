import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { getPlayers, GAME_CONFIG } from '@munchkin/shared';
import type { Player } from '@munchkin/shared';
import { QuickAddPlayer } from '@/components/QuickAddPlayer/QuickAddPlayer';

function StepIndicator({ step }: { step: 1 | 2 }) {
  return (
    <div className="flex items-center gap-2 font-body text-xs text-parchment-dim">
      <span
        className={`w-6 h-6 rounded-full flex items-center justify-center font-heading text-xs ${
          step >= 1 ? 'bg-brand-gold text-surface-base' : 'bg-surface-elevated text-parchment-dim border border-parchment-dim'
        }`}
      >
        1
      </span>
      <span className={step >= 1 ? 'text-parchment' : ''}>Jogadores</span>
      <div className="w-8 h-px bg-parchment-dim" />
      <span
        className={`w-6 h-6 rounded-full flex items-center justify-center font-heading text-xs ${
          step >= 2 ? 'bg-brand-gold text-surface-base' : 'bg-surface-elevated text-parchment-dim border border-parchment-dim'
        }`}
      >
        2
      </span>
      <span className={step >= 2 ? 'text-parchment' : ''}>Configuração</span>
    </div>
  );
}

export default function NewGamePage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    setError(null);
    getPlayers(supabase)
      .then(setPlayers)
      .catch((e) => setError(e instanceof Error ? e.message : 'Erro ao carregar jogadores'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
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

  const canProceed =
    selectedIds.size >= GAME_CONFIG.MIN_PLAYERS &&
    selectedIds.size <= GAME_CONFIG.MAX_PLAYERS;

  const handleNext = () => {
    navigate('/new-game/config', { state: { selectedIds: [...selectedIds] } });
  };

  return (
    <div className="min-h-screen bg-surface-base p-6 space-y-6 max-w-lg mx-auto">
      <header className="space-y-3">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-parchment-muted hover:text-parchment transition-colors font-heading text-sm"
          >
            ← Voltar
          </Link>
          <h1 className="font-heading text-parchment text-xl flex-1">Novo Jogo</h1>
        </div>
        <StepIndicator step={1} />
      </header>

      <p className="font-body text-parchment-muted text-sm">
        Selecionados: <span className="text-parchment font-semibold">{selectedIds.size}</span> / {GAME_CONFIG.MAX_PLAYERS}
        {selectedIds.size < GAME_CONFIG.MIN_PLAYERS && (
          <span className="text-parchment-dim"> — mínimo {GAME_CONFIG.MIN_PLAYERS}</span>
        )}
        {selectedIds.size === GAME_CONFIG.MAX_PLAYERS && (
          <span className="text-brand-gold-dark"> — máximo atingido</span>
        )}
      </p>

      {error && (
        <div className="bg-surface-card rounded-xl p-4 space-y-2">
          <p className="font-body text-brand-ruby text-sm">{error}</p>
          <button
            onClick={load}
            className="font-heading text-brand-gold text-sm hover:text-brand-gold-light transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 rounded-full border-2 border-brand-gold border-t-transparent animate-spin" />
        </div>
      ) : (
        <ul className="space-y-2">
          {players.map((player) => {
            const selected = selectedIds.has(player.id);
            const disabled = !selected && selectedIds.size >= GAME_CONFIG.MAX_PLAYERS;
            return (
              <li key={player.id}>
                <button
                  className="w-full text-left disabled:cursor-not-allowed"
                  onClick={() => toggleSelect(player.id)}
                  disabled={disabled}
                >
                  <div
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
                      selected
                        ? 'bg-surface-card ring-2 ring-brand-gold'
                        : disabled
                        ? 'bg-surface-card opacity-40'
                        : 'bg-surface-card hover:bg-surface-elevated'
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
                    {selected && (
                      <span className="text-brand-gold font-heading">✓</span>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="space-y-2">
        <p className="font-body text-parchment-dim text-xs uppercase tracking-wider px-1">
          Adicionar jogador rápido
        </p>
        <QuickAddPlayer supabase={supabase} onPlayerCreated={handlePlayerCreated} />
      </div>

      <button
        disabled={!canProceed}
        onClick={handleNext}
        className="w-full bg-brand-gold text-surface-base font-heading font-semibold px-6 py-4 rounded-xl hover:bg-brand-gold-light transition-colors shadow-glow-gold text-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
      >
        Próximo →
      </button>
    </div>
  );
}
