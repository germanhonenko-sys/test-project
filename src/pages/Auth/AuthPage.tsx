import { Sparkles } from 'lucide-react'
import { useEffect } from 'react'
import { LanguageToggle } from '../../components/layout/LanguageToggle.tsx'
import { Card } from '../../components/ui/Card.tsx'
import { useI18n } from '../../i18n/useI18n.ts'
import { MIN_PASSWORD_LENGTH } from '../../utils/auth.ts'
import { cn } from '../../utils/cn.ts'
import { LoginForm } from './LoginForm.tsx'
import { RegisterForm } from './RegisterForm.tsx'
import { useAuthForm } from './useAuthForm.ts'

export function AuthPage() {
  const form = useAuthForm()
  const { t } = useI18n()

  useEffect(() => {
    document.title = form.mode === 'login' ? t('auth.loginTitle') : t('auth.registerTitle')
  }, [form.mode, t])

  const error = form.error ? (
    <FormError message={t(`authError.${form.error}`, { min: MIN_PASSWORD_LENGTH })} />
  ) : null

  return (
    <div className="grid min-h-svh place-items-center bg-zinc-100 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-4 flex justify-end">
          <LanguageToggle />
        </div>
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
            <Sparkles className="h-5 w-5" />
          </span>
          <h1 className="mt-4 text-xl font-semibold text-zinc-900">AivibeBoard</h1>
          <p className="mt-1 text-sm text-zinc-500">{t('auth.subtitle')}</p>
        </div>

        <Card className="p-5 sm:p-6">
          <div className="grid grid-cols-2 rounded-lg bg-zinc-100 p-1" role="tablist" aria-label={t('auth.method')}>
            <ModeTab active={form.mode === 'login'} onClick={() => form.switchMode('login')} disabled={form.pending}>
              {t('auth.login')}
            </ModeTab>
            <ModeTab
              active={form.mode === 'register'}
              onClick={() => form.switchMode('register')}
              disabled={form.pending}
            >
              {t('auth.register')}
            </ModeTab>
          </div>

          {form.mode === 'login' ? (
            <LoginForm
              email={form.email}
              password={form.password}
              pending={form.pending}
              error={error}
              onEmailChange={form.setEmail}
              onPasswordChange={form.setPassword}
              onSubmit={form.onLogin}
            />
          ) : (
            <RegisterForm
              name={form.name}
              email={form.email}
              password={form.password}
              confirmPassword={form.confirmPassword}
              pending={form.pending}
              error={error}
              onNameChange={form.setName}
              onEmailChange={form.setEmail}
              onPasswordChange={form.setPassword}
              onConfirmPasswordChange={form.setConfirmPassword}
              onSubmit={form.onRegister}
            />
          )}
        </Card>
      </div>
    </div>
  )
}

function ModeTab({
  active,
  onClick,
  disabled,
  children,
}: {
  active: boolean
  onClick: () => void
  disabled?: boolean
  children: string
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'h-8 rounded-md text-sm font-medium transition-colors disabled:opacity-50',
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
