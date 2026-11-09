import { ArrowDown, ArrowUp, GripVertical, Minus, OctagonAlert, Pencil, Trash2 } from 'lucide-react'
import { useRef, useState, type DragEvent } from 'react'
import { Avatar } from '../../components/ui/Avatar.tsx'
import { Badge } from '../../components/ui/Badge.tsx'
import { useI18n } from '../../i18n/useI18n.ts'
import { priorityLabel, statusLabel } from '../../i18n/labels.ts'
import { useAppStore } from '../../store/useAppStore.ts'
import { taskStatuses, type BoardTask, type TaskPriority } from '../../types/index.ts'
import { cn } from '../../utils/cn.ts'
import { formatDeadline, isOverdue } from '../../utils/format.ts'
import { isTaskStatus } from '../../utils/guards.ts'
import { priorityBadgeClass, statusBadgeClass } from '../../utils/tones.ts'
import { usersByIds } from '../../utils/users.ts'
import { profileAsUser } from './profileUser.ts'

const priorityIcon: Record<TaskPriority, typeof ArrowDown> = {
  Низкий: ArrowDown,
  Средний: Minus,
  Высокий: ArrowUp,
  Критический: OctagonAlert,
}

const priorityIconClass: Record<TaskPriority, string> = {
  Низкий: 'text-zinc-400',
  Средний: 'text-sky-600',
  Высокий: 'text-amber-600',
  Критический: 'text-rose-600',
}

export function BoardTaskCard({
  task,
  onEdit,
  onDelete,
  onDragEnd,
}: {
  task: BoardTask
  onEdit: () => void
  onDelete: () => void
  onDragEnd: () => void
}) {
  const profiles = useAppStore((state) => state.profiles)
  const updateBoardTask = useAppStore((state) => state.updateBoardTask)
  const { locale, t, text } = useI18n()
  const allowDrag = useRef(false)
  const [dragging, setDragging] = useState(false)
  const assignee = usersByIds(profiles.map(profileAsUser), task.assigneeId ? [task.assigneeId] : [])[0]
  const overdue = task.deadline !== null && task.status !== 'Готово' && isOverdue(task.deadline)
  const PriorityIcon = priorityIcon[task.priority]

  function onDragStart(event: DragEvent<HTMLLIElement>) {
    if (!allowDrag.current) {
      event.preventDefault()
      return
    }
    event.dataTransfer.setData('text/plain', task.id)
    event.dataTransfer.effectAllowed = 'move'
    setDragging(true)
  }

  return (
    <li
      draggable
      onDragStart={onDragStart}
      onDragEnd={() => {
        allowDrag.current = false
        setDragging(false)
        onDragEnd()
      }}
      className={cn(
        'rounded-lg border border-zinc-200 bg-white p-3 shadow-sm',
        dragging && 'opacity-50',
      )}
    >
      <div className="flex items-start gap-2">
        <button
          type="button"
          aria-label={t('board.dragTask', { title: task.title })}
          onPointerDown={() => {
            allowDrag.current = true
          }}
          onPointerUp={() => {
            allowDrag.current = false
          }}
          className="mt-0.5 cursor-grab rounded-md p-0.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <PriorityIcon
          aria-label={priorityLabel(task.priority, locale)}
          className={cn('mt-0.5 h-4 w-4 shrink-0', priorityIconClass[task.priority])}
        />
        <p className="min-w-0 flex-1 text-sm font-medium text-zinc-900">{task.title}</p>
        <div className="flex shrink-0">
          <button
            type="button"
            aria-label={t('board.editTask', { title: task.title })}
            onClick={onEdit}
            className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={t('board.deleteTask', { title: task.title })}
            onClick={onDelete}
            className="rounded-md p-1 text-zinc-400 hover:bg-rose-50 hover:text-rose-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2 pl-6">
        {assignee ? <Avatar user={assignee} size="sm" /> : null}
        <p className="truncate text-xs text-zinc-500">
          {assignee ? text(assignee.name) : t('header.noAssignee')}
        </p>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge className={priorityBadgeClass[task.priority]}>{priorityLabel(task.priority, locale)}</Badge>
        <select
          value={task.status}
          aria-label={t('task.statusOf', { title: task.title })}
          onChange={(event) => {
            if (isTaskStatus(event.target.value)) updateBoardTask(task.id, { status: event.target.value })
          }}
          className={cn(
            'h-7 rounded-full px-2 text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500/30',
            statusBadgeClass[task.status],
          )}
        >
          {taskStatuses.map((status) => (
            <option key={status} value={status}>
              {statusLabel(status, locale)}
            </option>
          ))}
        </select>
        {task.deadline ? (
          <span className={cn('text-xs tabular-nums', overdue ? 'font-medium text-rose-600' : 'text-zinc-500')}>
            {formatDeadline(task.deadline, locale)}
          </span>
        ) : null}
      </div>
    </li>
  )
}
