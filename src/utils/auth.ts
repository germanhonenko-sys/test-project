import type { User } from '../types/index.ts'

const SESSION_KEY = 'aivibe-auth-session'
const ACCOUNTS_KEY = 'aivibe-registered-accounts'

export const MIN_PASSWORD_LENGTH = 6

const avatarColors = [
  'bg-indigo-600',
  'bg-violet-600',
  'bg-sky-600',
  'bg-emerald-600',
  'bg-amber-600',
  'bg-rose-600',
] as const

export interface AuthSession {
  userId: string
}

export interface RegisteredAccount {
  email: string
  password: string
  user: User
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const first = parts[0]
  if (!first) return '?'
  const second = parts[1]
  if (!second) return first.slice(0, 2).toLocaleUpperCase('ru')
  return `${first[0] ?? ''}${second[0] ?? ''}`.toLocaleUpperCase('ru')
}

export function colorFromEmail(email: string) {
  let hash = 0
  for (const char of email) hash = (hash + char.charCodeAt(0)) % avatarColors.length
  return avatarColors[hash] ?? avatarColors[0]
}

export function nextPathFromState(state: unknown) {
  if (!state || typeof state !== 'object' || !('from' in state)) return '/dashboard'
  const from = (state as { from?: { pathname?: string; search?: string; hash?: string } }).from
  const pathname = from?.pathname
  if (!pathname || !pathname.startsWith('/') || pathname.startsWith('//') || pathname === '/auth') {
    return '/dashboard'
  }
  return `${pathname}${from.search ?? ''}${from.hash ?? ''}`
}

function readJson(key: string): unknown {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as unknown
  } catch {
    return null
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Демо-хранилище недоступно в приватном режиме.
  }
}

function isUser(value: unknown): value is User {
  if (!value || typeof value !== 'object') return false
  const user = value as Partial<User>
  return (
    typeof user.id === 'string' &&
    typeof user.name === 'string' &&
    typeof user.role === 'string' &&
    typeof user.email === 'string' &&
    typeof user.initials === 'string' &&
    typeof user.color === 'string' &&
    Array.isArray(user.workspaceIds) &&
    user.workspaceIds.every((id) => typeof id === 'string')
  )
}

export function readSession(): AuthSession | null {
  const parsed = readJson(SESSION_KEY)
  if (!parsed || typeof parsed !== 'object') return null
  const userId = (parsed as { userId?: unknown }).userId
  return typeof userId === 'string' && userId ? { userId } : null
}

export function writeSession(session: AuthSession | null) {
  try {
    if (!session) localStorage.removeItem(SESSION_KEY)
    else writeJson(SESSION_KEY, session)
  } catch {
    // Демо-хранилище недоступно в приватном режиме.
  }
}

export function readAccounts(): RegisteredAccount[] {
  const parsed = readJson(ACCOUNTS_KEY)
  if (!Array.isArray(parsed)) return []
  return parsed.flatMap((item) => {
    if (!item || typeof item !== 'object') return []
    const account = item as Partial<RegisteredAccount>
    if (typeof account.email !== 'string' || typeof account.password !== 'string' || !isUser(account.user)) {
      return []
    }
    return [{ email: normalizeEmail(account.email), password: account.password, user: account.user }]
  })
}

export function writeAccounts(accounts: RegisteredAccount[]) {
  writeJson(ACCOUNTS_KEY, accounts)
}

export function mergeUsers(base: User[], extra: User[]) {
  const ids = new Set(base.map((user) => user.id))
  const emails = new Set(base.map((user) => normalizeEmail(user.email)))
  const additions = extra.filter((user) => !ids.has(user.id) && !emails.has(normalizeEmail(user.email)))
  return [...base, ...additions]
}
