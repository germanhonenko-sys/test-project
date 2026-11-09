import type { Locale, Localized } from '../types/index.ts'

export function loc(ru: string, en: string): Localized {
  return { ru, en }
}

export function both(value: string): Localized {
  return { ru: value, en: value }
}

export function text(value: Localized | string, locale: Locale) {
  return typeof value === 'string' ? value : value[locale]
}

export function searchText(value: Localized | string) {
  return typeof value === 'string' ? value : `${value.ru} ${value.en}`
}
