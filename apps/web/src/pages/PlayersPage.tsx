import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { getPlayers } from '@munchkin/shared';
import type { Player } from '@munchkin/shared';
import { PlayerListItem } from '@/components/PlayerListItem/PlayerListItem';

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setPlayers(await getPlayers(supabase));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar jogadores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="min-h-screen bg-surface-base p-6 space-y-6 max-w-lg mx-auto">
      <header className="flex items-center gap-4">
        <Link
          to="/"
          className="text-parchment-muted hover:text-parchment transition-colors font-heading text-sm"
        >
          ← Voltar
        </Link>
        <h1 className="font-heading text-parchment text-xl flex-1">
          Jogadores
        </h1>
      </header>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 rounded-full border-2 border-brand-gold border-t-transparent animate-spin" />
        </div>
      )}

      {error && (
        <div className="bg-surface-card rounded-xl p-4 space-y-3">
          <p className="font-body text-brand-ruby">{error}</p>
          <button
            onClick={() => void load()}
            className="font-heading text-brand-gold text-sm hover:text-brand-gold-light transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!loading && !error && players.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <p className="font-body text-parchment-muted text-lg">
            Nenhum jogador cadastrado ainda.
          </p>
          <p className="font-body text-parchment-dim text-sm">
            Adicione jogadores para começar uma partida.
          </p>
        </div>
      )}

      {!loading && !error && players.length > 0 && (
        <ul className="space-y-2">
          {players.map((player) => (
            <PlayerListItem key={player.id} player={player} />
          ))}
        </ul>
      )}
    </div>
  );
}
