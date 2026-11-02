import type { ProjectStatus, TaskPriority, TaskStatus } from '../types/index.ts'

export const priorityBadgeClass: Record<TaskPriority, string> = {
  Низкий: 'bg-zinc-100 text-zinc-600',
  Средний: 'bg-sky-50 text-sky-700',
  Высокий: 'bg-amber-50 text-amber-800',
  Критический: 'bg-rose-50 text-rose-700',
}

export const statusBadgeClass: Record<TaskStatus, string> = {
  'К выполнению': 'bg-zinc-100 text-zinc-700',
  'В работе': 'bg-indigo-50 text-indigo-700',
  'На проверке': 'bg-violet-50 text-violet-700',
  Готово: 'bg-emerald-50 text-emerald-700',
}

export const projectStatusClass: Record<ProjectStatus, string> = {
  'По плану': 'bg-emerald-50 text-emerald-700',
  'Под угрозой': 'bg-amber-50 text-amber-800',
  'На паузе': 'bg-zinc-100 text-zinc-600',
  Завершён: 'bg-sky-50 text-sky-700',
}
