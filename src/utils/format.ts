export function formatDeadline(iso: string) {
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' }).format(new Date(iso))
}

export function plural(count: number, one: string, few: string, many: string) {
  const abs = Math.abs(count) % 100
  const last = abs % 10
  if (abs > 10 && abs < 20) return many
  if (last > 1 && last < 5) return few
  if (last === 1) return one
  return many
}

export function formatRelative(iso: string) {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (minutes < 1) return 'Только что'
  if (minutes < 60) return `${minutes} мин. назад`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} ч. назад`
  const days = Math.round(hours / 24)
  if (days < 14) return `${days} дн. назад`
  return formatDeadline(iso)
}

export function isOverdue(iso: string) {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  return new Date(iso).getTime() < start.getTime()
}

export function compareDeadline(a: string, b: string) {
  return new Date(a).getTime() - new Date(b).getTime()
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} Б`
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} КБ`
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`
}

export function toStoredDate(value: string) {
  return `${value}T12:00:00`
}
