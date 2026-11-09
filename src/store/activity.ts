import { statusLabel } from '../i18n/labels.ts'
import { loc } from '../i18n/text.ts'
import type { Activity, ActivityKind, Localized, Task, TaskStatus } from '../types/index.ts'

export function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`
}

export function activityEntry(
  workspaceId: string,
  actorId: string,
  kind: ActivityKind,
  message: Activity['message'],
): Activity {
  return {
    id: createId('activity'),
    workspaceId,
    actorId,
    kind,
    message,
    timestamp: new Date().toISOString(),
  }
}

export function taskCreatedActivity(task: Task, projectName: Localized, actorId: string) {
  return activityEntry(
    task.workspaceId,
    actorId,
    'created',
    loc(
      `новая задача «${task.title.ru}» в проекте «${projectName.ru}».`,
      `new task “${task.title.en}” in project “${projectName.en}”.`,
    ),
  )
}

export function taskStatusActivity(task: Task, status: TaskStatus, actorId: string) {
  const done = status === 'Готово'
  return activityEntry(
    task.workspaceId,
    actorId,
    done ? 'completed' : 'status',
    done
      ? loc(`задача «${task.title.ru}» завершена.`, `task “${task.title.en}” completed.`)
      : loc(
          `статус задачи «${task.title.ru}» изменён на «${statusLabel(status, 'ru')}».`,
          `task “${task.title.en}” status changed to “${statusLabel(status, 'en')}”.`,
        ),
  )
}
