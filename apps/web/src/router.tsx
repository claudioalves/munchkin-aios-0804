import { createBrowserRouter } from 'react-router-dom';
import Home from '@/pages/Home';
import PlayersPage from '@/pages/PlayersPage';
import NewGamePage from '@/pages/NewGamePage';
import NewGameConfigPage from '@/pages/NewGameConfigPage';
import GamePage from '@/pages/GamePage';
import SettingsPage from '@/pages/SettingsPage';

export const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/players', element: <PlayersPage /> },
  { path: '/new-game', element: <NewGamePage /> },
  { path: '/new-game/config', element: <NewGameConfigPage /> },
  { path: '/game', element: <GamePage /> },
  { path: '/settings', element: <SettingsPage /> },
]);
