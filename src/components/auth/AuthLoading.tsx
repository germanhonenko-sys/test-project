import { useI18n } from '../../i18n/useI18n.ts'

export function AuthLoading() {
  const { t } = useI18n()
  return (
    <div className="grid min-h-svh place-items-center bg-zinc-100 text-sm text-zinc-500">{t('auth.loading')}</div>
  )
}
