import { Link } from 'react-router-dom'
import { Badge } from '../../components/ui/Badge.tsx'
import { useWorkspaceData } from '../../hooks/useWorkspaceData.ts'
import { useAppStore } from '../../store/useAppStore.ts'
import type { Task } from '../../types/index.ts'
import { taskStatuses } from '../../types/index.ts'
import { cn } from '../../utils/cn.ts'
import { formatDeadline, isOverdue } from '../../utils/format.ts'
import { isTaskStatus } from '../../utils/guards.ts'
import { priorityBadgeClass, statusBadgeClass } from '../../utils/tones.ts'
import { userById } from '../../utils/users.ts'

export function TaskList({
  tasks,
  compact = false,
  highlightId,
  empty,
}: {
  tasks: Task[]
  compact?: boolean
  highlightId?: string
  empty: string
}) {
  const { projects, users } = useWorkspaceData()
  const setTaskStatus = useAppStore((state) => state.setTaskStatus)

  if (tasks.length === 0) {
    return <p className="px-4 py-6 text-sm text-zinc-500">{empty}</p>
  }

  return (
    <ul>
      {tasks.map((task) => {
        const project = projects.find((item) => item.id === task.projectId)
        const assignee = userById(users, task.assigneeId)
        const overdue = task.status !== 'Готово' && isOverdue(task.deadline)
        const highlighted = task.id === highlightId
        return (
          <li
            key={task.id}
            id={`task-${task.id}`}
            className={cn(
              'flex flex-col gap-3 border-b border-zinc-100 px-4 last:border-b-0 sm:flex-row sm:items-center',
              compact ? 'py-2' : 'py-3',
              highlighted && 'bg-indigo-50/70',
            )}
          >
            <div className="min-w-0 flex-1">
              <Link
                to={`/tasks?task=${task.id}`}
                className="text-sm font-medium text-zinc-900 hover:text-indigo-700"
              >
                {task.title}
              </Link>
              <p className="mt-0.5 truncate text-xs text-zinc-500">
                {project?.name ?? 'Проект'} · {assignee?.name ?? 'Без исполнителя'}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={priorityBadgeClass[task.priority]}>{task.priority}</Badge>
              <select
                value={task.status}
                aria-label={`Статус: ${task.title}`}
                onChange={(event) => {
                  if (isTaskStatus(event.target.value)) setTaskStatus(task.id, event.target.value)
                }}
                className={cn(
                  'h-7 rounded-full px-2 text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500/30',
                  statusBadgeClass[task.status],
                )}
              >
                {taskStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <span className={cn('text-xs tabular-nums', overdue ? 'font-medium text-rose-600' : 'text-zinc-500')}>
                {formatDeadline(task.deadline)}
              </span>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
