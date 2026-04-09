import { Navigate, Outlet } from 'react-router-dom';
import { useGameStore } from '@munchkin/shared';

export default function ProtectedRoute() {
  const userId = useGameStore((s) => s.userId);

  if (!userId) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}
