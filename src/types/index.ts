export const taskStatuses = ['К выполнению', 'В работе', 'На проверке', 'Готово'] as const
export type TaskStatus = (typeof taskStatuses)[number]

export const taskPriorities = ['Низкий', 'Средний', 'Высокий', 'Критический'] as const
export type TaskPriority = (typeof taskPriorities)[number]

export const projectStatuses = ['По плану', 'Под угрозой', 'На паузе', 'Завершён'] as const
export type ProjectStatus = (typeof projectStatuses)[number]

export const activityKinds = ['created', 'completed', 'status', 'member', 'comment'] as const
export type ActivityKind = (typeof activityKinds)[number]

export const documentCategories = ['Продукт', 'Разработка', 'Дизайн', 'Операции'] as const
export type DocumentCategory = (typeof documentCategories)[number]

export interface User {
  id: string
  name: string
  role: string
  email: string
  initials: string
  color: string
  workspaceIds: string[]
}

export interface Workspace {
  id: string
  name: string
  plan: string
  projectDelta: string
}

export interface Project {
  id: string
  workspaceId: string
  name: string
  description: string
  memberIds: string[]
  progress: number
  deadline: string
  status: ProjectStatus
}

export interface Task {
  id: string
  workspaceId: string
  projectId: string
  title: string
  assigneeId: string
  priority: TaskPriority
  status: TaskStatus
  deadline: string
}

export interface Activity {
  id: string
  workspaceId: string
  actorId: string
  kind: ActivityKind
  message: string
  timestamp: string
}

export interface KnowledgeDocument {
  id: string
  workspaceId: string
  name: string
  category: DocumentCategory
  updatedAt: string
  size: string
}

export interface AppNotification {
  id: string
  title: string
  body: string
  timestamp: string
  read: boolean
}

export interface AiHistoryItem {
  id: string
  workspaceId: string
  prompt: string
  subtasks: string[]
  createdAt: string
}

export interface Preferences {
  compactLists: boolean
  emailDigest: boolean
  desktopAlerts: boolean
}

export interface NewTaskInput {
  workspaceId: string
  projectId: string
  title: string
  assigneeId: string
  priority: TaskPriority
  status: TaskStatus
  deadline: string
}

export interface NewDocumentInput {
  workspaceId: string
  name: string
  category: DocumentCategory
  size: string
}
