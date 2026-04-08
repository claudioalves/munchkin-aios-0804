import { createBrowserRouter } from 'react-router-dom';
import Home from '@/pages/Home';
import PlayersPage from '@/pages/PlayersPage';
import NewGamePage from '@/pages/NewGamePage';

export const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/players', element: <PlayersPage /> },
  { path: '/new-game', element: <NewGamePage /> },
]);
