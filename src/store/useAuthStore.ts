import { create } from 'zustand'
import { mockUsers } from '../data/mockUsers.ts'
import type { User } from '../types/index.ts'
import {
  colorFromEmail,
  initialsFromName,
  isValidEmail,
  MIN_PASSWORD_LENGTH,
  normalizeEmail,
  readAccounts,
  writeAccounts,
  writeSession,
} from '../utils/auth.ts'
import { useAppStore } from './useAppStore.ts'

interface AuthState {
  sessionUserId: string | null
  login: (email: string, password: string) => string | null
  register: (name: string, email: string, password: string) => string | null
  logout: () => void
}

function establishSession(userId: string) {
  writeSession({ userId })
  useAppStore.getState().setCurrentUserId(userId)
}

export const useAuthStore = create<AuthState>((set) => ({
  sessionUserId: useAppStore.getState().currentUserId || null,
  login: (email, password) => {
    const normalized = normalizeEmail(email)
    if (!normalized || !password) return 'Заполните почту и пароль.'
    if (password.length < MIN_PASSWORD_LENGTH) {
      return `Пароль должен быть не короче ${MIN_PASSWORD_LENGTH} символов.`
    }

    const user = useAppStore.getState().users.find((item) => normalizeEmail(item.email) === normalized)
    if (!user) return 'Пользователь с такой почтой не найден.'

    const account = readAccounts().find((item) => normalizeEmail(item.email) === normalized)
    const isMock = mockUsers.some((item) => item.id === user.id)
    if (!isMock && account?.password !== password) return 'Неверный пароль.'

    establishSession(user.id)
    set({ sessionUserId: user.id })
    return null
  },
  register: (name, email, password) => {
    const trimmed = name.trim()
    const normalized = normalizeEmail(email)
    if (!trimmed) return 'Укажите имя.'
    if (!isValidEmail(normalized)) return 'Укажите корректную почту.'
    if (password.length < MIN_PASSWORD_LENGTH) {
      return `Пароль должен быть не короче ${MIN_PASSWORD_LENGTH} символов.`
    }

    const taken = useAppStore.getState().users.some((item) => normalizeEmail(item.email) === normalized)
    if (taken) return 'Эта почта уже зарегистрирована.'

    const workspaceId = useAppStore.getState().activeWorkspaceId
    const user: User = {
      id: `user-${crypto.randomUUID().slice(0, 8)}`,
      name: trimmed,
      role: 'Участник',
      email: normalized,
      initials: initialsFromName(trimmed),
      color: colorFromEmail(normalized),
      workspaceIds: workspaceId ? [workspaceId] : [],
    }

    writeAccounts([...readAccounts(), { email: normalized, password, user }])
    useAppStore.getState().addUser(user)
    establishSession(user.id)
    set({ sessionUserId: user.id })
    return null
  },
  logout: () => {
    writeSession(null)
    useAppStore.getState().setCurrentUserId('')
    set({ sessionUserId: null })
  },
}))
