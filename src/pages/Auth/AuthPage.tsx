import { Sparkles } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button.tsx'
import { Card } from '../../components/ui/Card.tsx'
import { Field, Input } from '../../components/ui/Input.tsx'
import { useAuthStore } from '../../store/useAuthStore.ts'
import { nextPathFromState } from '../../utils/auth.ts'
import { cn } from '../../utils/cn.ts'

type AuthMode = 'login' | 'register'

export function AuthPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const register = useAuthStore((state) => state.register)
  const [mode, setMode] = useState<AuthMode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    document.title = mode === 'login' ? 'Вход · AivibeBoard' : 'Регистрация · AivibeBoard'
  }, [mode])

  function switchMode(next: AuthMode) {
    setMode(next)
    setError(null)
    setConfirmPassword('')
  }

  function finish() {
    navigate(nextPathFromState(location.state), { replace: true })
  }

  function onLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const message = login(email, password)
    if (message) {
      setError(message)
      return
    }
    finish()
  }

  function onRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (password !== confirmPassword) {
      setError('Пароли не совпадают.')
      return
    }
    const message = register(name, email, password)
    if (message) {
      setError(message)
      return
    }
    finish()
  }

  return (
    <div className="grid min-h-svh place-items-center bg-zinc-100 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
            <Sparkles className="h-5 w-5" />
          </span>
          <h1 className="mt-4 text-xl font-semibold text-zinc-900">AivibeBoard</h1>
          <p className="mt-1 text-sm text-zinc-500">Войдите, чтобы открыть рабочее пространство.</p>
        </div>

        <Card className="p-5 sm:p-6">
          <div className="grid grid-cols-2 rounded-lg bg-zinc-100 p-1" role="tablist" aria-label="Способ входа">
            <ModeTab active={mode === 'login'} onClick={() => switchMode('login')}>
              Вход
            </ModeTab>
            <ModeTab active={mode === 'register'} onClick={() => switchMode('register')}>
              Регистрация
            </ModeTab>
          </div>

          {mode === 'login' ? (
            <form className="mt-5 space-y-4" onSubmit={onLogin}>
              <Field label="Почта">
                <Input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  placeholder="alex@aivibe.io"
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </Field>
              <Field label="Пароль">
                <Input
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  placeholder="Не короче 6 символов"
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </Field>
              {error ? <FormError message={error} /> : null}
              <Button type="submit" className="w-full">
                Войти
              </Button>
              <p className="text-xs leading-5 text-zinc-500">
                Демо без сервера. Для участника команды, например{' '}
                <span className="font-medium text-zinc-700">alex@aivibe.io</span>, подойдёт любой пароль от 6
                символов.
              </p>
            </form>
          ) : (
            <form className="mt-5 space-y-4" onSubmit={onRegister}>
              <Field label="Имя">
                <Input
                  name="name"
                  autoComplete="name"
                  value={name}
                  placeholder="Анна Соколова"
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </Field>
              <Field label="Почта">
                <Input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  placeholder="anna@example.com"
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </Field>
              <Field label="Пароль">
                <Input
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  value={password}
                  placeholder="Не короче 6 символов"
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </Field>
              <Field label="Повторите пароль">
                <Input
                  type="password"
                  name="confirmPassword"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                />
              </Field>
              {error ? <FormError message={error} /> : null}
              <Button type="submit" className="w-full">
                Создать аккаунт
              </Button>
              <p className="text-xs leading-5 text-zinc-500">
                Аккаунт сохранится в этом браузере и сразу откроет приложение.
              </p>
            </form>
          )}
        </Card>
      </div>
    </div>
  )
}

function ModeTab({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: string
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'h-8 rounded-md text-sm font-medium transition-colors',
        active ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-800',
      )}
    >
      {children}
    </button>
  )
}

function FormError({ message }: { message: string }) {
  return (
    <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
      {message}
    </p>
  )
}
