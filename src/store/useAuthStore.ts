import type { User as AuthUser } from '@supabase/supabase-js'
import { create } from 'zustand'
import { supabase } from '../lib/supabase.ts'
import type { User } from '../types/index.ts'
import { both, loc } from '../i18n/text.ts'
import {
  authErrorMessage,
  colorFromEmail,
  initialsFromName,
  isValidEmail,
  MIN_PASSWORD_LENGTH,
  normalizeEmail,
  type AuthErrorCode,
} from '../utils/auth.ts'
import { useAppStore } from './useAppStore.ts'

type AuthStatus = 'loading' | 'ready'

interface AuthState {
  status: AuthStatus
  sessionUserId: string | null
  login: (email: string, password: string) => Promise<AuthErrorCode | null>
  register: (name: string, email: string, password: string) => Promise<AuthErrorCode | null>
  logout: () => Promise<void>
  init: () => () => void
}

function userFromAuth(authUser: AuthUser): User {
  const email = normalizeEmail(authUser.email ?? '')
  const metaName = authUser.user_metadata?.name
  const rawName = typeof metaName === 'string' ? metaName.trim() : ''
  const fallback = email.split('@')[0]
  const name = rawName
    ? both(rawName)
    : fallback
      ? both(fallback)
      : loc('Пользователь', 'User')
  const initialsSource = rawName || fallback
  const workspaceId = useAppStore.getState().activeWorkspaceId

  return {
    id: authUser.id,
    name,
    role: loc('Участник', 'Member'),
    email,
    initials: initialsSource ? both(initialsFromName(initialsSource)) : loc('П', 'U'),
    color: colorFromEmail(email || authUser.id),
    workspaceIds: workspaceId ? [workspaceId] : [],
  }
}

function establishUser(authUser: AuthUser | null) {
  if (!authUser) {
    useAppStore.getState().setCurrentUserId('')
    return null
  }

  const user = userFromAuth(authUser)
  const { users } = useAppStore.getState()
  if (!users.some((item) => item.id === user.id)) {
    useAppStore.setState({
      users: [
        ...users.filter((item) => item.email.toLowerCase() !== user.email.toLowerCase()),
        user,
      ],
    })
  }
  useAppStore.getState().setCurrentUserId(user.id)
  return user.id
}

function validateCredentials(email: string, password: string) {
  const normalized = normalizeEmail(email)
  if (!normalized || !password) return { normalized, error: 'fillCredentials' as const }
  if (!isValidEmail(normalized)) return { normalized, error: 'invalidEmail' as const }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { normalized, error: 'passwordLength' as const }
  }
  return { normalized, error: null }
}

export const useAuthStore = create<AuthState>((set) => ({
  status: 'loading',
  sessionUserId: null,
  login: async (email, password) => {
    const { normalized, error } = validateCredentials(email, password)
    if (error) return error

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: normalized,
      password,
    })
    if (authError) return authErrorMessage(authError)
    if (!data.session) return 'loginFailed'

    set({ sessionUserId: establishUser(data.session.user), status: 'ready' })
    return null
  },
  register: async (name, email, password) => {
    const trimmed = name.trim()
    if (!trimmed) return 'enterName'
    const { normalized, error } = validateCredentials(email, password)
    if (error) return error

    const { data, error: authError } = await supabase.auth.signUp({
      email: normalized,
      password,
      options: { data: { name: trimmed } },
    })
    if (authError) return authErrorMessage(authError)
    if (data.user && data.user.identities?.length === 0) return 'emailTaken'
    if (!data.session) return 'confirmThenHome'

    set({ sessionUserId: establishUser(data.session.user), status: 'ready' })
    return null
  },
  logout: async () => {
    await supabase.auth.signOut()
    establishUser(null)
    set({ sessionUserId: null, status: 'ready' })
  },
  init: () => {
    let active = true

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return
      const user = error ? null : (data.session?.user ?? null)
      set({ sessionUserId: establishUser(user), status: 'ready' })
    })

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return
      set({ sessionUserId: establishUser(session?.user ?? null), status: 'ready' })
    })

    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  },
}))
