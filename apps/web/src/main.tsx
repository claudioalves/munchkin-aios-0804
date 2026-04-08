import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import App from './App';
import { supabase } from '@/lib/supabase';
import { ensureAnonymousSession, getActiveGame, useGameStore, STORAGE_KEYS } from '@munchkin/shared';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

async function initApp() {
  // 1. Sessão anônima
  try {
    const user = await ensureAnonymousSession(supabase);
    useGameStore.getState().setUserId(user.id);
  } catch (err) {
    console.error('Anonymous auth failed — running in degraded mode:', err);
    return; // render sem reconciliação se auth falhou
  }

  // 2. Reconciliação de estado: localStorage vs Supabase
  try {
    const { activeGame, lastSavedAt, setActiveGame, setGamePlayers, clearGame } =
      useGameStore.getState();

    const supabaseGame = await getActiveGame(supabase);

    if (!supabaseGame && activeGame) {
      // Jogo foi encerrado em outro dispositivo ou inconsistência
      localStorage.removeItem(STORAGE_KEYS.SYNC_QUEUE);
      clearGame();
    } else if (supabaseGame) {
      // Comparar timestamps: Supabase tem dados mais recentes?
      const supabaseTs =
        supabaseGame.game_players[0]?.updated_at ?? supabaseGame.started_at;
      const localTs = lastSavedAt ?? '1970-01-01T00:00:00.000Z';

      if (supabaseTs > localTs) {
        setActiveGame(supabaseGame);
        setGamePlayers(supabaseGame.game_players);
      }
    }
  } catch (err) {
    console.error('State reconciliation failed — using local state:', err);
  }
}

// Inicializar antes de renderizar
void initApp();

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
