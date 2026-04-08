import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { getPlayers, createPlayer, deletePlayer } from '@munchkin/shared';
import type { Player } from '@munchkin/shared';
import { PlayerListItem } from '@/components/PlayerListItem/PlayerListItem';
import { AddPlayerForm } from '@/components/AddPlayerForm/AddPlayerForm';
import { ConfirmDialog } from '@/components/ConfirmDialog/ConfirmDialog';

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Player | null>(null);

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

  const handleCreate = async (name: string, color: string) => {
    const optimisticId = `optimistic-${Date.now()}`;
    const optimisticPlayer: Player = {
      id: optimisticId,
      owner_id: '',
      name,
      color,
      avatar_url: null,
      created_at: new Date().toISOString(),
    };
    setPlayers((prev) => [...prev, optimisticPlayer]);
    setShowForm(false);
    try {
      const real = await createPlayer(supabase, name, color);
      setPlayers((prev) => prev.map((p) => (p.id === optimisticId ? real : p)));
    } catch (e) {
      setPlayers((prev) => prev.filter((p) => p.id !== optimisticId));
      setError(e instanceof Error ? e.message : 'Erro ao criar jogador');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!pendingDelete) return;
    const target = pendingDelete;
    setPendingDelete(null);
    setPlayers((prev) => prev.filter((p) => p.id !== target.id));
    try {
      await deletePlayer(supabase, target.id);
    } catch (e) {
      setPlayers((prev) =>
        [...prev, target].sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        ),
      );
      setError(e instanceof Error ? e.message : 'Erro ao remover jogador');
    }
  };

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
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="font-heading text-brand-gold text-sm hover:text-brand-gold-light transition-colors"
          >
            + Adicionar
          </button>
        )}
      </header>

      {showForm && (
        <AddPlayerForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
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

      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 rounded-full border-2 border-brand-gold border-t-transparent animate-spin" />
        </div>
      )}

      {!loading && !error && players.length === 0 && !showForm && (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <p className="font-body text-parchment-muted text-lg">
            Nenhum jogador cadastrado ainda.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="font-heading text-brand-gold text-sm hover:text-brand-gold-light transition-colors"
          >
            + Adicionar primeiro jogador
          </button>
        </div>
      )}

      {players.length > 0 && (
        <ul className="space-y-2">
          {players.map((player) => (
            <PlayerListItem
              key={player.id}
              player={player}
              onDelete={() => setPendingDelete(player)}
            />
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title={`Remover ${pendingDelete?.name ?? ''}?`}
        description="Esta ação não pode ser desfeita."
        confirmLabel="Remover"
        onConfirm={() => void handleDeleteConfirm()}
        onCancel={() => setPendingDelete(null)}
        danger
      />
    </div>
  );
}
