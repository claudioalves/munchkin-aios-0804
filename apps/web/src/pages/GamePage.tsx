import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { getActiveGame, useGameStore } from '@munchkin/shared';

export default function GamePage() {
  const navigate = useNavigate();
  const { activeGame, gamePlayers, setActiveGame, setGamePlayers } = useGameStore();

  useEffect(() => {
    if (activeGame) return;
    getActiveGame(supabase)
      .then((game) => {
        if (!game) {
          navigate('/');
          return;
        }
        setActiveGame(game);
        setGamePlayers(game.game_players);
      })
      .catch(() => navigate('/'));
  }, [activeGame, navigate, setActiveGame, setGamePlayers]);

  if (!activeGame) {
    return (
      <div className="min-h-screen bg-surface-base flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-brand-gold border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-base p-6 flex flex-col items-center justify-center gap-4">
      <h1 className="font-display text-3xl text-brand-gold">Partida em Andamento</h1>
      <p className="font-body text-parchment-muted text-sm">
        {activeGame.epic_mode ? 'Modo Épico' : 'Modo Normal'} —{' '}
        {gamePlayers.length} jogadores
      </p>
      <p className="font-body text-parchment-dim text-xs text-center max-w-xs">
        Tela de partida completa vem no EP-04.
      </p>
    </div>
  );
}
