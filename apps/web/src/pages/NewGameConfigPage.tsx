import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { createGame, useGameStore } from '@munchkin/shared';

function StepIndicator({ step: _step }: { step: 1 | 2 }) {
  return (
    <div className="flex items-center gap-2 font-body text-xs text-parchment-dim">
      <span className="w-6 h-6 rounded-full flex items-center justify-center font-heading text-xs bg-brand-gold-dark text-parchment">
        ✓
      </span>
      <span className="text-parchment-dim line-through">Jogadores</span>
      <div className="w-8 h-px bg-brand-gold" />
      <span className="w-6 h-6 rounded-full flex items-center justify-center font-heading text-xs bg-brand-gold text-surface-base">
        2
      </span>
      <span className="text-parchment">Configuração</span>
    </div>
  );
}

export default function NewGameConfigPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedIds: string[] = location.state?.selectedIds ?? [];
  const { setActiveGame, setGamePlayers } = useGameStore();

  const [epicMode, setEpicMode] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const maxLevel = epicMode ? 20 : 10;
  const victoryLevel = epicMode ? 21 : 11;

  const handleStart = async () => {
    if (selectedIds.length < 2) return;
    setCreating(true);
    setError(null);
    try {
      const game = await createGame(supabase, selectedIds, epicMode);
      setActiveGame(game);
      setGamePlayers(game.game_players);
      navigate('/game');
    } catch (e) {
      const msg = e instanceof Error ? e.message : '';
      if (msg.includes('idx_games_active_owner') || msg.includes('duplicate key')) {
        setError('Você já tem uma partida em andamento. Encerre-a antes de criar uma nova.');
      } else {
        setError(msg || 'Erro ao criar partida');
      }
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-base p-6 space-y-8 max-w-lg mx-auto">
      <header className="space-y-3">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/new-game')}
            className="text-parchment-muted hover:text-parchment transition-colors font-heading text-sm"
          >
            ← Voltar
          </button>
          <h1 className="font-heading text-parchment text-xl flex-1">Novo Jogo</h1>
        </div>
        <StepIndicator step={2} />
      </header>

      <section className="bg-surface-card rounded-xl p-6 space-y-5">
        <h2 className="font-heading text-parchment text-base">Configuração</h2>

        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="font-heading text-parchment text-sm">Modo Épico</p>
            <p className="font-body text-parchment-dim text-xs">
              Nível máximo:{' '}
              <strong className="text-parchment">{maxLevel}</strong>
              {' — '}Vitória em{' '}
              <strong className="text-brand-gold">{victoryLevel}</strong>
            </p>
          </div>
          <button
            onClick={() => setEpicMode((prev) => !prev)}
            aria-pressed={epicMode}
            className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
              epicMode ? 'bg-brand-emerald' : 'bg-surface-elevated border border-parchment-dim'
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200 ${
                epicMode ? 'left-6' : 'left-0.5'
              }`}
            />
          </button>
        </div>

        <div className="border-t border-parchment-dim/20 pt-4">
          <p className="font-body text-parchment-dim text-xs">
            {selectedIds.length} jogador{selectedIds.length !== 1 ? 'es' : ''} selecionado{selectedIds.length !== 1 ? 's' : ''}
          </p>
        </div>
      </section>

      {error && (
        <p className="font-body text-brand-ruby text-sm bg-surface-card rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <button
        onClick={() => void handleStart()}
        disabled={creating || selectedIds.length < 2}
        className="w-full bg-brand-gold text-surface-base font-heading font-semibold px-6 py-4 rounded-xl hover:bg-brand-gold-light transition-colors shadow-glow-gold text-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
      >
        {creating ? 'Criando partida...' : 'Iniciar Jogo ⚔'}
      </button>
    </div>
  );
}
