export const MIN_PASSWORD_LENGTH = 6

const avatarColors = [
  'bg-indigo-600',
  'bg-violet-600',
  'bg-sky-600',
  'bg-emerald-600',
  'bg-amber-600',
  'bg-rose-600',
] as const

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

export type AuthErrorCode =
  | 'fillCredentials'
  | 'invalidEmail'
  | 'passwordLength'
  | 'invalidCredentials'
  | 'emailTaken'
  | 'confirmThenLogin'
  | 'rateLimit'
  | 'generic'
  | 'enterName'
  | 'loginFailed'
  | 'confirmThenHome'
  | 'passwordMismatch'

export function authErrorMessage(error: { message: string; code?: string }): AuthErrorCode {
  const message = error.message.toLowerCase()
  const code = error.code ?? ''

  if (code === 'invalid_credentials' || message.includes('invalid login credentials')) {
    return 'invalidCredentials'
  }
  if (
    code === 'email_exists' ||
    code === 'user_already_exists' ||
    message.includes('already registered') ||
    message.includes('already been registered')
  ) {
    return 'emailTaken'
  }
  if (code === 'email_not_confirmed' || message.includes('email not confirmed')) {
    return 'confirmThenLogin'
  }
  if (
    code === 'over_email_send_rate_limit' ||
    code === 'over_request_rate_limit' ||
    message.includes('rate limit')
  ) {
    return 'rateLimit'
  }
  if (message.includes('password') && (message.includes('at least') || message.includes('short') || message.includes('6'))) {
    return 'passwordLength'
  }
  if (
    code === 'email_address_invalid' ||
    message.includes('invalid format') ||
    message.includes('unable to validate email') ||
    (message.includes('email address') && message.includes('invalid'))
  ) {
    return 'invalidEmail'
  }
  return 'generic'
}
