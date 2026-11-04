import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore.ts'
import { nextPathFromState } from '../../utils/auth.ts'
import { AuthLoading } from './AuthLoading.tsx'

export function GuestOnly() {
  const status = useAuthStore((state) => state.status)
  const sessionUserId = useAuthStore((state) => state.sessionUserId)
  const location = useLocation()

  if (status === 'loading') return <AuthLoading />

  if (sessionUserId) {
    return <Navigate to={nextPathFromState(location.state)} replace />
  }

  return <Outlet />
}
