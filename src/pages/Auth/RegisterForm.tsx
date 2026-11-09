import type { FormEvent, ReactNode } from 'react'
import { Button } from '../../components/ui/Button.tsx'
import { Field, Input } from '../../components/ui/Input.tsx'
import { useI18n } from '../../i18n/useI18n.ts'

export function RegisterForm({
  name,
  email,
  password,
  confirmPassword,
  pending,
  error,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}: {
  name: string
  email: string
  password: string
  confirmPassword: string
  pending: boolean
  error: ReactNode
  onNameChange: (value: string) => void
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onConfirmPasswordChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  const { t } = useI18n()

  return (
    <form className="mt-5 space-y-4" onSubmit={onSubmit}>
      <Field label={t('auth.name')}>
        <Input
          name="name"
          autoComplete="name"
          value={name}
          placeholder={t('auth.namePlaceholder')}
          onChange={(event) => onNameChange(event.target.value)}
          required
        />
      </Field>
      <Field label={t('auth.email')}>
        <Input
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          placeholder="anna@example.com"
          onChange={(event) => onEmailChange(event.target.value)}
          required
        />
      </Field>
      <Field label={t('auth.password')}>
        <Input
          type="password"
          name="password"
          autoComplete="new-password"
          value={password}
          placeholder={t('auth.passwordHint')}
          onChange={(event) => onPasswordChange(event.target.value)}
          required
        />
      </Field>
      <Field label={t('auth.confirmPassword')}>
        <Input
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => onConfirmPasswordChange(event.target.value)}
          required
        />
      </Field>
      {error}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? t('auth.creating') : t('auth.createAccount')}
      </Button>
      <p className="text-xs leading-5 text-zinc-500">{t('auth.registerHint')}</p>
    </form>
  )
}
