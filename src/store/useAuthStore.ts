import { create } from 'zustand'
import { supabase } from '../lib/supabase.ts'
import { authErrorMessage, type AuthErrorCode } from '../utils/auth.ts'
import { establishUser, validateCredentials } from './authSession.ts'

type AuthStatus = 'loading' | 'ready'

interface AuthState {
  status: AuthStatus
  sessionUserId: string | null
  login: (email: string, password: string) => Promise<AuthErrorCode | null>
  register: (name: string, email: string, password: string) => Promise<AuthErrorCode | null>
  logout: () => Promise<void>
  init: () => () => void
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
