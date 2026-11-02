import { taskPriorities, taskStatuses, type TaskPriority, type TaskStatus } from '../types/index.ts'

export function isTaskStatus(value: string): value is TaskStatus {
  return taskStatuses.some((status) => status === value)
}

export function isTaskPriority(value: string): value is TaskPriority {
  return taskPriorities.some((priority) => priority === value)
}
