import type { FormEvent, ReactNode } from 'react'
import { Button } from '../../components/ui/Button.tsx'
import { Field, Input } from '../../components/ui/Input.tsx'
import { useI18n } from '../../i18n/useI18n.ts'

export function LoginForm({
  email,
  password,
  pending,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: {
  email: string
  password: string
  pending: boolean
  error: ReactNode
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  const { t } = useI18n()

  return (
    <form className="mt-5 space-y-4" onSubmit={onSubmit}>
      <Field label={t('auth.email')}>
        <Input
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          placeholder="alex@aivibe.io"
          onChange={(event) => onEmailChange(event.target.value)}
          required
        />
      </Field>
      <Field label={t('auth.password')}>
        <Input
          type="password"
          name="password"
          autoComplete="current-password"
          value={password}
          placeholder={t('auth.passwordHint')}
          onChange={(event) => onPasswordChange(event.target.value)}
          required
        />
      </Field>
      {error}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? t('auth.signingIn') : t('auth.signIn')}
      </Button>
      <p className="text-xs leading-5 text-zinc-500">{t('auth.loginHint')}</p>
    </form>
  )
}
