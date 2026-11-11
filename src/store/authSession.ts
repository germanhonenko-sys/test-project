import type { User as AuthUser } from '@supabase/supabase-js'
import { teamRoleLabel } from '../data/teamRoles.ts'
import { both, loc } from '../i18n/text.ts'
import type { User } from '../types/index.ts'
import {
  colorFromEmail,
  initialsFromName,
  isValidEmail,
  MIN_PASSWORD_LENGTH,
  normalizeEmail,
} from '../utils/auth.ts'
import { useAppStore } from './useAppStore.ts'

export function userFromAuth(authUser: AuthUser): User {
  const email = normalizeEmail(authUser.email ?? '')
  const metaName = authUser.user_metadata?.name
  const rawName = typeof metaName === 'string' ? metaName.trim() : ''
  const fallback = email.split('@')[0]
  const name = rawName ? both(rawName) : fallback ? both(fallback) : loc('Пользователь', 'User')
  const initialsSource = rawName || fallback
  const workspaceId = useAppStore.getState().activeWorkspaceId
  const metaRole = authUser.user_metadata?.role

  return {
    id: authUser.id,
    name,
    role: teamRoleLabel(typeof metaRole === 'string' ? metaRole : ''),
    email,
    initials: initialsSource ? both(initialsFromName(initialsSource)) : loc('П', 'U'),
    color: colorFromEmail(email || authUser.id),
    workspaceIds: workspaceId ? [workspaceId] : [],
  }
}

export function establishUser(authUser: AuthUser | null) {
  if (!authUser) {
    useAppStore.getState().setCurrentUserId('')
    return null
  }

  const user = userFromAuth(authUser)
  const { users } = useAppStore.getState()
  const withoutEmailDupes = users.filter(
    (item) => item.id === user.id || item.email.toLowerCase() !== user.email.toLowerCase(),
  )
  useAppStore.setState({
    users: withoutEmailDupes.some((item) => item.id === user.id)
      ? withoutEmailDupes.map((item) => (item.id === user.id ? user : item))
      : [...withoutEmailDupes, user],
  })
  useAppStore.getState().setCurrentUserId(user.id)
  return user.id
}

export function validateCredentials(email: string, password: string) {
  const normalized = normalizeEmail(email)
  if (!normalized || !password) return { normalized, error: 'fillCredentials' as const }
  if (!isValidEmail(normalized)) return { normalized, error: 'invalidEmail' as const }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { normalized, error: 'passwordLength' as const }
  }
  return { normalized, error: null }
}
