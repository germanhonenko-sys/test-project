import { Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AvatarGroup } from '../../components/ui/Avatar.tsx'
import { Badge } from '../../components/ui/Badge.tsx'
import { useI18n } from '../../i18n/useI18n.ts'
import { statusLabel } from '../../i18n/labels.ts'
import { useAppStore } from '../../store/useAppStore.ts'
import { taskStatuses, type Board } from '../../types/index.ts'
import { cn } from '../../utils/cn.ts'
import { statusBadgeClass } from '../../utils/tones.ts'
import { usersByIds } from '../../utils/users.ts'
import { profileAsUser } from './profileUser.ts'

export function BoardCard({
  board,
  highlighted = false,
  onEdit,
  onDelete,
}: {
  board: Board
  highlighted?: boolean
  onEdit: () => void
  onDelete: () => void
}) {
  const boardTasks = useAppStore((state) => state.boardTasks)
  const profiles = useAppStore((state) => state.profiles)
  const currentUserId = useAppStore((state) => state.currentUserId)
  const { locale, t } = useI18n()
  const tasks = boardTasks.filter((task) => task.boardId === board.id)
  const members = usersByIds(profiles.map(profileAsUser), board.memberIds)
  const canManage = board.ownerId === currentUserId

  return (
    <Link
      id={`board-${board.id}`}
      to={`/boards/${board.id}`}
      className={cn(
        'flex h-full flex-col rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-colors hover:border-zinc-300',
        highlighted && 'ring-2 ring-indigo-500',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-zinc-900">{board.name}</h3>
        {canManage ? (
          <div className="flex shrink-0 gap-1">
            <button
              type="button"
              aria-label={t('board.edit')}
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                onEdit()
              }}
              className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label={t('board.delete')}
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                onDelete()
              }}
              className="rounded-md p-1 text-zinc-400 hover:bg-rose-50 hover:text-rose-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-zinc-500">{board.description}</p>
      <div className="mt-4">
        <AvatarGroup users={members} />
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-2">
        {taskStatuses.map((status) => {
          const count = tasks.filter((task) => task.status === status).length
          return (
            <li
              key={status}
              className="flex items-center justify-between gap-2 rounded-lg bg-zinc-50 px-2.5 py-2"
            >
              <Badge className={statusBadgeClass[status]}>{statusLabel(status, locale)}</Badge>
              <span className="text-sm font-semibold tabular-nums text-zinc-900">{count}</span>
            </li>
          )
        })}
      </ul>
    </Link>
  )
}
