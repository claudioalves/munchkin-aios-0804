const MAX_RANK_OPACITY = 0.25;
const MIN_RANK_OPACITY = 0.1;

/**
 * Opacidade do badge de posição: decai linearmente de MAX_RANK_OPACITY (1º lugar)
 * até MIN_RANK_OPACITY (último lugar), mantendo quem está na frente mais visível.
 */
export function getRankOpacity(rank: number, totalPlayers: number): number {
  if (totalPlayers <= 1) return MAX_RANK_OPACITY;
  const ratio = (rank - 1) / (totalPlayers - 1);
  const clampedRatio = Math.min(Math.max(ratio, 0), 1);
  return MAX_RANK_OPACITY - clampedRatio * (MAX_RANK_OPACITY - MIN_RANK_OPACITY);
}
