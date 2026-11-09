import type { Locale } from '../types/index.ts'
import { messages } from './messages.ts'

type Leaves<T, P extends string = ''> = T extends string
  ? P
  : { [K in keyof T & string]: Leaves<T[K], P extends '' ? K : `${P}.${K}`> }[keyof T & string]

export type MessageKey = Leaves<(typeof messages)['ru']>

function lookup(source: object, key: string) {
  const value = key.split('.').reduce<unknown>((current, part) => {
    if (current && typeof current === 'object' && part in current) {
      return (current as Record<string, unknown>)[part]
    }
    return undefined
  }, source)
  return typeof value === 'string' ? value : key
}

export function translate(locale: Locale, key: MessageKey, vars?: Record<string, string | number>) {
  const template = lookup(messages[locale], key)
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (_, name: string) => String(vars[name] ?? ''))
}
