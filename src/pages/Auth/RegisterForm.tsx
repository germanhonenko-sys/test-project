import { useState, type FormEvent, type ReactNode } from 'react'
import { Button } from '../../components/ui/Button.tsx'
import { Field, Input, Select } from '../../components/ui/Input.tsx'
import { useI18n } from '../../i18n/useI18n.ts'

const teamRoles = [
  'frontend',
  'backend',
  'fullstack',
  'mobile',
  'qa',
  'devops',
  'design',
  'product',
  'project',
  'lead',
  'analyst',
] as const

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
  const [role, setRole] = useState('')

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
      <Field label={t('auth.role')}>
        <Select name="role" value={role} onChange={(event) => setRole(event.target.value)} required>
          <option value="">{t('auth.rolePlaceholder')}</option>
          {teamRoles.map((item) => (
            <option key={item} value={item}>
              {t(`auth.roles.${item}`)}
            </option>
          ))}
        </Select>
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
