import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore.ts'
import { useAuthStore } from '../../store/useAuthStore.ts'
import { AuthLoading } from './AuthLoading.tsx'

export function RequireAuth() {
  const status = useAuthStore((state) => state.status)
  const sessionUserId = useAuthStore((state) => state.sessionUserId)
  const currentUserId = useAppStore((state) => state.currentUserId)
  const location = useLocation()

  if (status === 'loading') return <AuthLoading />

  if (!sessionUserId || !currentUserId) {
    return <Navigate to="/auth" replace state={{ from: location }} />
  }

  return <Outlet />
}
