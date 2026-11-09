import type {
  DocumentCategory,
  Locale,
  ProjectStatus,
  TaskPriority,
  TaskStatus,
} from '../types/index.ts'
import { translate, type MessageKey } from './translate.ts'

const taskStatusKey = {
  'К выполнению': 'status.todo',
  'В работе': 'status.doing',
  'На проверке': 'status.review',
  Готово: 'status.done',
} as const satisfies Record<TaskStatus, MessageKey>

const priorityKey = {
  Низкий: 'priority.low',
  Средний: 'priority.medium',
  Высокий: 'priority.high',
  Критический: 'priority.critical',
} as const satisfies Record<TaskPriority, MessageKey>

const projectStatusKey = {
  'По плану': 'projectStatus.onTrack',
  'Под угрозой': 'projectStatus.atRisk',
  'На паузе': 'projectStatus.paused',
  Завершён: 'projectStatus.done',
} as const satisfies Record<ProjectStatus, MessageKey>

const categoryKey = {
  Продукт: 'category.product',
  Разработка: 'category.engineering',
  Дизайн: 'category.design',
  Операции: 'category.operations',
} as const satisfies Record<DocumentCategory, MessageKey>

export function statusLabel(status: TaskStatus, locale: Locale) {
  return translate(locale, taskStatusKey[status])
}

export function priorityLabel(priority: TaskPriority, locale: Locale) {
  return translate(locale, priorityKey[priority])
}

export function projectStatusLabel(status: ProjectStatus, locale: Locale) {
  return translate(locale, projectStatusKey[status])
}

export function categoryLabel(category: DocumentCategory, locale: Locale) {
  return translate(locale, categoryKey[category])
}
