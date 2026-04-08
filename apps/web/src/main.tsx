import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import App from './App';
import { supabase } from '@/lib/supabase';
import { ensureAnonymousSession, useGameStore } from '@munchkin/shared';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

// Inicializar sessão anônima antes de renderizar
// Se falhar (offline / Supabase indisponível), o app carrega em modo degradado
ensureAnonymousSession(supabase)
  .then((user) => {
    useGameStore.getState().setUserId(user.id);
  })
  .catch((err: unknown) => {
    console.error('Anonymous auth failed — running in degraded mode:', err);
  });

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
