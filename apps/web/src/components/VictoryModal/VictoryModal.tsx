import { useState } from 'react';
import type { GamePlayerWithInfo } from '@munchkin/shared';

interface VictoryModalProps {
  winner: GamePlayerWithInfo;
  onFinish: () => Promise<void>;
}

export function VictoryModal({ winner, onFinish }: VictoryModalProps) {
  const [finishing, setFinishing] = useState(false);

  const handleFinish = async () => {
    setFinishing(true);
    try {
      await onFinish();
    } finally {
      setFinishing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
      <div className="bg-surface-card rounded-2xl p-8 max-w-sm w-full text-center space-y-6 shadow-card">
        <div className="space-y-2">
          <p className="font-display text-5xl text-brand-gold">🏆</p>
          <h2 className="font-display text-3xl text-brand-gold">Vitória!</h2>
        </div>

        <div className="space-y-1">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center font-heading text-surface-base text-2xl font-bold mx-auto"
            style={{ backgroundColor: winner.player.color }}
          >
            {winner.player.name[0]?.toUpperCase()}
          </div>
          <p className="font-heading text-parchment text-xl tracking-wide uppercase">
            {winner.player.name}
          </p>
          <p className="font-body text-parchment-muted text-sm">
            Nível {winner.level}
          </p>
        </div>

        <button
          onClick={() => void handleFinish()}
          disabled={finishing}
          className="w-full bg-brand-gold text-surface-base font-heading font-semibold px-6 py-4 rounded-xl hover:bg-brand-gold-light transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {finishing ? 'Encerrando...' : 'Encerrar Partida'}
        </button>
      </div>
    </div>
  );
}
