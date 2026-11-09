import { useCallback } from 'react'
import { useLocaleStore } from '../store/useLocaleStore.ts'
import type { Localized } from '../types/index.ts'
import { text as readText } from './text.ts'
import { translate, type MessageKey } from './translate.ts'

export function useI18n() {
  const locale = useLocaleStore((state) => state.locale)
  const setLocale = useLocaleStore((state) => state.setLocale)
  const t = useCallback(
    (key: MessageKey, vars?: Record<string, string | number>) => translate(locale, key, vars),
    [locale],
  )
  const text = useCallback((value: Localized | string) => readText(value, locale), [locale])
  return { locale, setLocale, t, text }
}
