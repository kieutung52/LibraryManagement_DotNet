import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../store/auth'

export default function AdminRoute() {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace state={{ from: location }} />
  }
  return <Outlet />
}
