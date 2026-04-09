import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { getPlayers, createPlayer, deletePlayer, updatePlayer, AVATAR_COLORS } from '@munchkin/shared';
import type { Player } from '@munchkin/shared';
import { PlayerListItem } from '@/components/PlayerListItem/PlayerListItem';
import { AddPlayerForm } from '@/components/AddPlayerForm/AddPlayerForm';
import { ConfirmDialog } from '@/components/ConfirmDialog/ConfirmDialog';
import { useLang } from '@/i18n/LanguageContext';

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Player | null>(null);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { t } = useLang();

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

  const handleEdit = (player: Player) => {
    setEditingPlayer(player);
    setEditName(player.name);
    setEditColor(player.color);
  };

  const handleSaveEdit = async () => {
    if (!editingPlayer || !editName.trim()) return;
    setIsSaving(true);
    try {
      const updated = await updatePlayer(supabase, editingPlayer.id, {
        name: editName,
        color: editColor,
      });
      setPlayers((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setEditingPlayer(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao editar jogador');
    } finally {
      setIsSaving(false);
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
          {t('players.title')}
        </h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="font-heading text-brand-gold text-sm hover:text-brand-gold-light transition-colors"
          >
            {t('players.add')}
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
            {t('players.noPlayers')}
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="font-heading text-brand-gold text-sm hover:text-brand-gold-light transition-colors"
          >
            {t('players.addFirst')}
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
              onEdit={() => handleEdit(player)}
            />
          ))}
        </ul>
      )}

      {/* Edit Player Modal */}
      {editingPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-surface-card border border-brand-gold/40 rounded-2xl p-6 w-full max-w-xs flex flex-col gap-5">
            <h2 className="font-heading text-parchment text-lg">{t('players.editTitle')}</h2>

            <div className="space-y-2">
              <label className="font-body text-parchment-dim text-xs uppercase tracking-wider">
                {t('players.name')}
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-surface-elevated border border-parchment-dim rounded-lg px-3 py-2 font-body text-parchment text-sm focus:outline-none focus:border-brand-gold transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="font-body text-parchment-dim text-xs uppercase tracking-wider">
                {t('players.color')}
              </label>
              <div className="grid grid-cols-6 gap-2">
                {AVATAR_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setEditColor(c)}
                    className={`w-8 h-8 rounded-full transition-all ${
                      editColor === c ? 'ring-2 ring-brand-gold ring-offset-2 ring-offset-surface-card scale-110' : ''
                    }`}
                    style={{ backgroundColor: c }}
                    aria-label={c}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setEditingPlayer(null)}
                disabled={isSaving}
                className="flex-1 border border-parchment-dim text-parchment font-heading px-4 py-2 rounded-xl hover:bg-surface-elevated transition-colors text-sm"
              >
                {t('players.cancel')}
              </button>
              <button
                onClick={() => void handleSaveEdit()}
                disabled={isSaving || !editName.trim()}
                className="flex-1 bg-brand-gold text-surface-base font-heading font-semibold px-4 py-2 rounded-xl hover:bg-brand-gold-light transition-colors text-sm disabled:opacity-40"
              >
                {isSaving ? '...' : t('players.save')}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title={`${t('players.delete')} ${pendingDelete?.name ?? ''}?`}
        description={t('players.deleteConfirm')}
        confirmLabel={t('players.delete')}
        onConfirm={() => void handleDeleteConfirm()}
        onCancel={() => setPendingDelete(null)}
        danger
      />
    </div>
  );
}
