import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { GamePlayerWithInfo, LevelSnapshot } from '@munchkin/shared';

interface ProgressChartProps {
  snapshots: LevelSnapshot[];
  gamePlayers: GamePlayerWithInfo[];
  maxLevel: number;
  onClose: () => void;
}

export function ProgressChart({ snapshots, gamePlayers, maxLevel, onClose }: ProgressChartProps) {
  const chartData = useMemo(() => {
    // Group snapshots by captured_at timestamp
    const byTime = new Map<string, Record<string, unknown>>();

    for (const snap of snapshots) {
      const time = new Date(snap.captured_at).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
      if (!byTime.has(time)) byTime.set(time, { time });
      const player = gamePlayers.find((p) => p.player_id === snap.player_id);
      if (player) {
        const entry = byTime.get(time)!;
        entry[player.player.name] = snap.level;
      }
    }

    return Array.from(byTime.values());
  }, [snapshots, gamePlayers]);

  const isEmpty = chartData.length < 2;

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface-card rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-parchment text-lg">Evolução dos Níveis</h2>
          <button
            onClick={onClose}
            className="font-heading text-parchment-muted hover:text-parchment transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>

        {isEmpty ? (
          <div className="h-48 flex items-center justify-center">
            <p className="font-body text-parchment-dim text-sm">Aguardando dados...</p>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: -16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis
                  dataKey="time"
                  tick={{ fill: '#a89070', fontSize: 11, fontFamily: 'inherit' }}
                />
                <YAxis
                  domain={[1, maxLevel]}
                  tick={{ fill: '#a89070', fontSize: 11, fontFamily: 'inherit' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e1a14',
                    border: '1px solid #3d3020',
                    borderRadius: '8px',
                    fontFamily: 'inherit',
                    fontSize: '12px',
                    color: '#e8d5b0',
                  }}
                />
                {gamePlayers.map((p) => (
                  <Line
                    key={p.id}
                    type="monotone"
                    dataKey={p.player.name}
                    stroke={p.player.color}
                    strokeWidth={2}
                    dot={{ fill: p.player.color, r: 3 }}
                    activeDot={{ r: 5 }}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
