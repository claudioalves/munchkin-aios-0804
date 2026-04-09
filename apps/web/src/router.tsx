import { createBrowserRouter } from 'react-router-dom';
import Home from '@/pages/Home';
import AuthPage from '@/pages/AuthPage';
import PlayersPage from '@/pages/PlayersPage';
import NewGamePage from '@/pages/NewGamePage';
import NewGameConfigPage from '@/pages/NewGameConfigPage';
import GamePage from '@/pages/GamePage';
import SettingsPage from '@/pages/SettingsPage';
import SpectatePage from '@/pages/SpectatePage';
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';

export const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/auth', element: <AuthPage /> },
  { path: '/spectate/:gameId', element: <SpectatePage /> },
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/players', element: <PlayersPage /> },
      { path: '/new-game', element: <NewGamePage /> },
      { path: '/new-game/config', element: <NewGameConfigPage /> },
      { path: '/game', element: <GamePage /> },
      { path: '/settings', element: <SettingsPage /> },
    ],
  },
]);
