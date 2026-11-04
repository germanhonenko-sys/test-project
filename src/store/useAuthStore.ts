import type { User as AuthUser } from '@supabase/supabase-js'
import { create } from 'zustand'
import { supabase } from '../lib/supabase.ts'
import type { User } from '../types/index.ts'
import {
  authErrorMessage,
  colorFromEmail,
  initialsFromName,
  isValidEmail,
  MIN_PASSWORD_LENGTH,
  normalizeEmail,
} from '../utils/auth.ts'
import { useAppStore } from './useAppStore.ts'

type AuthStatus = 'loading' | 'ready'

interface AuthState {
  status: AuthStatus
  sessionUserId: string | null
  login: (email: string, password: string) => Promise<string | null>
  register: (name: string, email: string, password: string) => Promise<string | null>
  logout: () => Promise<void>
  init: () => () => void
}

function userFromAuth(authUser: AuthUser): User {
  const email = normalizeEmail(authUser.email ?? '')
  const metaName = authUser.user_metadata?.name
  const name =
    typeof metaName === 'string' && metaName.trim()
      ? metaName.trim()
      : email.split('@')[0] || 'Пользователь'
  const workspaceId = useAppStore.getState().activeWorkspaceId

  return {
    id: authUser.id,
    name,
    role: 'Участник',
    email,
    initials: initialsFromName(name),
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
  if (!normalized || !password) return { normalized, error: 'Заполните почту и пароль.' }
  if (!isValidEmail(normalized)) return { normalized, error: 'Укажите корректную почту.' }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { normalized, error: `Пароль должен быть не короче ${MIN_PASSWORD_LENGTH} символов.` }
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
    if (!data.session) return 'Не удалось войти. Попробуйте ещё раз.'

    set({ sessionUserId: establishUser(data.session.user), status: 'ready' })
    return null
  },
  register: async (name, email, password) => {
    const trimmed = name.trim()
    if (!trimmed) return 'Укажите имя.'
    const { normalized, error } = validateCredentials(email, password)
    if (error) return error

    const { data, error: authError } = await supabase.auth.signUp({
      email: normalized,
      password,
      options: { data: { name: trimmed } },
    })
    if (authError) return authErrorMessage(authError)
    if (data.user && data.user.identities?.length === 0) return 'Эта почта уже зарегистрирована.'
    if (!data.session) {
      return 'Подтвердите почту по ссылке из письма. После подтверждения войдите — откроется главная.'
    }

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
