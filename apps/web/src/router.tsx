import { createBrowserRouter } from 'react-router-dom';
import Home from '@/pages/Home';
import PlayersPage from '@/pages/PlayersPage';

export const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/players', element: <PlayersPage /> },
]);
