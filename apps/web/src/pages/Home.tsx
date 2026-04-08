import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { getActiveGame } from '@munchkin/shared';
import type { GameWithPlayers } from '@munchkin/shared';

export default function Home() {
  // undefined = carregando, null = sem jogo ativo, objeto = jogo ativo
  const [activeGame, setActiveGame] = useState<GameWithPlayers | null | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    getActiveGame(supabase)
      .then(setActiveGame)
      .catch(() => setActiveGame(null));
  }, []);

  return (
    <div className="min-h-screen bg-surface-base flex flex-col items-center justify-center p-8 gap-10">
      <header className="text-center space-y-2">
        <h1 className="font-display text-4xl text-brand-gold">
          Munchkin
        </h1>
        <p className="font-heading text-parchment-muted tracking-widest text-sm uppercase">
          Level Tracker
        </p>
      </header>

      <nav className="flex flex-col gap-3 w-full max-w-xs">
        <Link
          to="/new-game"
          className="bg-brand-gold text-surface-base font-heading font-semibold px-6 py-4 rounded-xl text-center hover:bg-brand-gold-light transition-colors shadow-glow-gold text-lg"
        >
          Novo Jogo
        </Link>

        {activeGame && (
          <button
            onClick={() => navigate('/game')}
            className="bg-brand-emerald text-parchment font-heading font-semibold px-6 py-4 rounded-xl text-center hover:bg-brand-emerald-light transition-colors text-lg"
          >
            Continuar Partida
          </button>
        )}

        <Link
          to="/players"
          className="border border-brand-gold text-brand-gold font-heading px-6 py-4 rounded-xl text-center hover:bg-surface-elevated transition-colors text-lg"
        >
          Gerenciar Jogadores
        </Link>

        <button
          disabled
          className="text-parchment-dim font-heading px-6 py-3 rounded-xl text-center text-sm cursor-not-allowed"
        >
          Regras (em breve)
        </button>

        <button
          disabled
          className="text-parchment-dim font-heading px-6 py-3 rounded-xl text-center text-sm cursor-not-allowed"
        >
          Configurações (em breve)
        </button>
      </nav>

      {/* Reservado para banner AdSense */}
      <div className="w-full max-w-xs h-16 rounded-xl bg-surface-card border border-parchment-dim/20 flex items-center justify-center">
        <span className="font-body text-parchment-dim text-xs">Publicidade</span>
      </div>
    </div>
  );
}
