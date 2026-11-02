import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore.ts'
import { useAuthStore } from '../../store/useAuthStore.ts'

export function RequireAuth() {
  const sessionUserId = useAuthStore((state) => state.sessionUserId)
  const currentUserId = useAppStore((state) => state.currentUserId)
  const location = useLocation()

  if (!sessionUserId || !currentUserId) {
    return <Navigate to="/auth" replace state={{ from: location }} />
  }

  return <Outlet />
}
