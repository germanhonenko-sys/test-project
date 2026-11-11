import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore.ts'
import { nextPathFromState, type AuthErrorCode } from '../../utils/auth.ts'

export type AuthMode = 'login' | 'register'

export function useAuthForm() {
  const location = useLocation()
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const register = useAuthStore((state) => state.register)
  const [mode, setMode] = useState<AuthMode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<AuthErrorCode | null>(null)
  const [pending, setPending] = useState(false)

  function switchMode(next: AuthMode) {
    setMode(next)
    setError(null)
    setConfirmPassword('')
  }

  function finish() {
    navigate(nextPathFromState(location.state), { replace: true })
  }

  async function onLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError(null)
    const message = await login(email, password)
    setPending(false)
    if (message) {
      setError(message)
      return
    }
    finish()
  }

  async function onRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (password !== confirmPassword) {
      setError('passwordMismatch')
      return
    }
    const role = String(new FormData(event.currentTarget).get('role') ?? '')
    setPending(true)
    setError(null)
    const message = await register(name, email, password, role)
    setPending(false)
    if (message) {
      setError(message)
      return
    }
    finish()
  }

  return {
    mode,
    switchMode,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    pending,
    onLogin,
    onRegister,
  }
}
