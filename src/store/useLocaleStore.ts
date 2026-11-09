import { create } from 'zustand'
import type { Locale } from '../types/index.ts'

const STORAGE_KEY = 'aivibe.locale'

function readLocale(): Locale {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'ru'
  } catch {
    return 'ru'
  }
}

function applyLang(locale: Locale) {
  document.documentElement.lang = locale
}

applyLang(readLocale())

interface LocaleState {
  locale: Locale
  setLocale: (locale: Locale) => void
}

export const useLocaleStore = create<LocaleState>((set) => ({
  locale: readLocale(),
  setLocale: (locale) => {
    try {
      localStorage.setItem(STORAGE_KEY, locale)
    } catch {
      // Preference still applies for this session.
    }
    applyLang(locale)
    set({ locale })
  },
}))
