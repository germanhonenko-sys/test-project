import { useI18n } from '../../i18n/useI18n.ts'
import type { Locale } from '../../types/index.ts'
import { cn } from '../../utils/cn.ts'

const locales: Locale[] = ['ru', 'en']

export function LanguageToggle() {
  const { locale, setLocale, t } = useI18n()

  return (
    <div
      role="group"
      aria-label={t('lang.switch')}
      className="flex h-9 shrink-0 items-center rounded-lg border border-zinc-200 p-0.5"
    >
      {locales.map((item) => {
        const active = locale === item
        return (
          <button
            key={item}
            type="button"
            aria-pressed={active}
            onClick={() => setLocale(item)}
            className={cn(
              'h-8 rounded-md px-2 text-xs font-semibold uppercase',
              active ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-zinc-800',
            )}
          >
            {item}
          </button>
        )
      })}
    </div>
  )
}
