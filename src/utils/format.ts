import type { Locale } from '../types/index.ts'

export function formatDeadline(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === 'ru' ? 'ru-RU' : 'en-US', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(iso))
}

export function plural(count: number, one: string, few: string, many: string) {
  const abs = Math.abs(count) % 100
  const last = abs % 10
  if (abs > 10 && abs < 20) return many
  if (last > 1 && last < 5) return few
  if (last === 1) return one
  return many
}

export function formatRelative(iso: string, locale: Locale) {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (minutes < 1) return locale === 'ru' ? 'Только что' : 'Just now'
  if (minutes < 60) {
    return locale === 'ru' ? `${minutes} мин. назад` : `${minutes} min ago`
  }
  const hours = Math.round(minutes / 60)
  if (hours < 24) {
    if (locale === 'ru') return `${hours} ч. назад`
    return hours === 1 ? '1 hr ago' : `${hours} hr ago`
  }
  const days = Math.round(hours / 24)
  if (days < 14) {
    if (locale === 'ru') return `${days} дн. назад`
    return days === 1 ? '1 day ago' : `${days} days ago`
  }
  return formatDeadline(iso, locale)
}

export function formatTasks(count: number, locale: Locale) {
  if (locale === 'en') return `${count} ${count === 1 ? 'task' : 'tasks'}`
  return `${count} ${plural(count, 'задача', 'задачи', 'задач')}`
}

export function formatProjects(count: number, locale: Locale) {
  if (locale === 'en') return `${count} ${count === 1 ? 'project' : 'projects'}`
  return `${count} ${plural(count, 'проект', 'проекта', 'проектов')}`
}

export function isOverdue(iso: string) {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  return new Date(iso).getTime() < start.getTime()
}

export function compareDeadline(a: string, b: string) {
  return new Date(a).getTime() - new Date(b).getTime()
}

export function formatBytes(bytes: number, locale: Locale) {
  const unit = locale === 'ru' ? (['Б', 'КБ', 'МБ'] as const) : (['B', 'KB', 'MB'] as const)
  if (bytes < 1024) return `${bytes} ${unit[0]}`
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} ${unit[1]}`
  const mega = (bytes / (1024 * 1024)).toFixed(1)
  return `${locale === 'ru' ? mega.replace('.', ',') : mega} ${unit[2]}`
}

export function toStoredDate(value: string) {
  return `${value}T12:00:00`
}
