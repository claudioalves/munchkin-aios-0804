import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@munchkin/shared';
import { useGameLog } from '@/hooks/useGameLog';
import type { GameEvent } from '@munchkin/shared';

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatEvent(event: GameEvent): string {
  if (event.event_type === 'level_up') {
    return `${event.player_name} subiu para o nível ${event.new_value ?? ''}`;
  }
  if (event.event_type === 'level_down') {
    return `${event.player_name} desceu para o nível ${event.new_value ?? ''}`;
  }
  if (event.event_type === 'game_start') return 'Partida iniciada';
  if (event.event_type === 'game_end') return 'Partida encerrada';
  return event.event_type;
}

function EventIcon({ type }: { type: GameEvent['event_type'] }) {
  if (type === 'level_up') return <span className="text-brand-gold">↑</span>;
  if (type === 'level_down') return <span className="text-parchment-muted">↓</span>;
  return <span className="text-parchment-dim">·</span>;
}

export default function GameLogPage() {
  const navigate = useNavigate();
  const { activeGame } = useGameStore();
  const { events, isLoading } = useGameLog(activeGame?.id ?? null);

  return (
    <div className="min-h-screen bg-surface-base flex flex-col max-w-2xl mx-auto p-4 gap-4">
      <header className="flex items-center gap-3 py-2">
        <button
          onClick={() => navigate('/game')}
          className="font-heading text-parchment-muted hover:text-parchment transition-colors text-sm shrink-0"
        >
          ← Partida
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-brand-gold text-lg leading-none">Log da Partida</h1>
          <p className="font-body text-parchment-dim text-xs mt-0.5">
            {events.length > 0 ? `${events.length} eventos` : 'Histórico de ações'}
          </p>
        </div>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 rounded-full border-2 border-brand-gold border-t-transparent animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center py-12 gap-3">
          <span className="text-5xl">📋</span>
          <p className="font-heading text-parchment-muted text-sm">Nenhum evento registrado ainda.</p>
          <p className="font-body text-parchment-dim text-xs">Os eventos aparecerão aqui conforme a partida avançar.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {events.map((event) => (
            <li
              key={event.id}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-surface-card border border-parchment-dim/20"
            >
              <span className="font-mono text-parchment-dim text-xs shrink-0 w-11">
                {formatTime(event.created_at)}
              </span>
              <EventIcon type={event.event_type} />
              <span
                className={`text-sm font-body flex-1 ${
                  event.event_type === 'level_up'
                    ? 'text-parchment'
                    : 'text-parchment-muted'
                }`}
              >
                {formatEvent(event)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
