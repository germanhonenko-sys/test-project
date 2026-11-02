import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore.ts'
import { nextPathFromState } from '../../utils/auth.ts'

export function GuestOnly() {
  const sessionUserId = useAuthStore((state) => state.sessionUserId)
  const location = useLocation()

  if (sessionUserId) {
    return <Navigate to={nextPathFromState(location.state)} replace />
  }

  return <Outlet />
}
