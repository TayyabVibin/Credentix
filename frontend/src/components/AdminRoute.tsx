import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store/hooks.ts';

export default function AdminRoute() {
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'ADMIN') return <Navigate to="/" replace />;
  return <Outlet />;
}
