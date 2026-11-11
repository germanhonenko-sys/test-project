import { ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState, type DragEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PageHeader, PageShell } from '../../components/layout/PageHeader.tsx'
import { AvatarGroup } from '../../components/ui/Avatar.tsx'
import { Badge } from '../../components/ui/Badge.tsx'
import { Button, ButtonLink } from '../../components/ui/Button.tsx'
import { BoardTaskCard } from '../../features/boards/BoardTaskCard.tsx'
import { BoardTaskModal } from '../../features/boards/BoardTaskModal.tsx'
import { CreateBoardModal } from '../../features/boards/CreateBoardModal.tsx'
import { DeleteBoardModal } from '../../features/boards/DeleteBoardModal.tsx'
import { DeleteBoardTaskModal } from '../../features/boards/DeleteBoardTaskModal.tsx'
import { profileAsUser } from '../../features/boards/profileUser.ts'
import { useBoards } from '../../features/boards/useBoards.ts'
import { useWorkspaceData } from '../../hooks/useWorkspaceData.ts'
import { useI18n } from '../../i18n/useI18n.ts'
import { statusLabel } from '../../i18n/labels.ts'
import { useAppStore } from '../../store/useAppStore.ts'
import { taskStatuses, type BoardTask, type TaskStatus } from '../../types/index.ts'
import { cn } from '../../utils/cn.ts'
import { statusBadgeClass } from '../../utils/tones.ts'
import { usersByIds } from '../../utils/users.ts'

function StatusColumn({
  status,
  tasks,
  active,
  onAdd,
  onEdit,
  onDelete,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  onStatusChange,
}: {
  status: TaskStatus
  tasks: BoardTask[]
  active: boolean
  onAdd: () => void
  onEdit: (task: BoardTask) => void
  onDelete: (task: BoardTask) => void
  onDragOver: () => void
  onDragLeave: () => void
  onDrop: (taskId: string) => void
  onDragEnd: () => void
  onStatusChange: (taskId: string, status: TaskStatus) => void
}) {
  const { locale, t } = useI18n()

  function dropTask(event: DragEvent<HTMLElement>) {
    event.preventDefault()
    const taskId = event.dataTransfer.getData('text/plain')
    if (taskId) onDrop(taskId)
  }

  return (
    <section
      onDragOver={(event) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
        onDragOver()
      }}
      onDragLeave={(event) => {
        if (event.currentTarget.contains(event.relatedTarget as Node | null)) return
        onDragLeave()
      }}
      onDrop={dropTask}
      className={cn(
        'flex min-h-40 flex-col rounded-xl bg-zinc-100/80 p-3',
        active && 'ring-2 ring-indigo-400',
      )}
    >
      <header className="mb-3 flex items-center justify-between gap-2">
        <Badge className={statusBadgeClass[status]}>{statusLabel(status, locale)}</Badge>
        <span className="text-xs font-medium tabular-nums text-zinc-500">{tasks.length}</span>
      </header>
      <Button variant="secondary" size="sm" className="mb-3 w-full" onClick={onAdd}>
        <Plus className="h-4 w-4" />
        {t('board.addTask')}
      </Button>
      {tasks.length === 0 ? (
        <p className="px-1 text-xs text-zinc-400">{t('board.columnEmpty')}</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <BoardTaskCard
              key={task.id}
              task={task}
              onEdit={() => onEdit(task)}
              onDelete={() => onDelete(task)}
              onDragEnd={onDragEnd}
              onStatusChange={(next) => onStatusChange(task.id, next)}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

export function BoardViewPage() {
  const { boardId } = useParams()
  const navigate = useNavigate()
  const boards = useAppStore((state) => state.boards)
  const boardTasks = useAppStore((state) => state.boardTasks)
  const profiles = useAppStore((state) => state.profiles)
  const boardsStatus = useAppStore((state) => state.boardsStatus)
  const currentUserId = useAppStore((state) => state.currentUserId)
  const updateBoardTask = useAppStore((state) => state.updateBoardTask)
  const { workspace } = useWorkspaceData()
  const { t, text } = useI18n()
  const board = boards.find((item) => item.id === boardId)
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [taskDraft, setTaskDraft] = useState<{ status: TaskStatus; task: BoardTask | null } | null>(null)
  const [deletingTask, setDeletingTask] = useState<BoardTask | null>(null)
  const [dropStatus, setDropStatus] = useState<TaskStatus | null>(null)
  const [taskError, setTaskError] = useState(false)
  useBoards()

  if (!board) {
    return (
      <PageShell>
        <p className="text-sm text-zinc-500">
          {boardsStatus === 'ready' ? t('board.missing') : t('board.loading')}
        </p>
        <ButtonLink to="/boards" variant="secondary">
          {t('board.back')}
        </ButtonLink>
      </PageShell>
    )
  }

  const tasks = boardTasks.filter((task) => task.boardId === board.id)
  const members = usersByIds(profiles.map(profileAsUser), board.memberIds)
  const canManage = board.ownerId === currentUserId

  return (
    <PageShell>
      <Link to="/boards" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800">
        <ArrowLeft className="h-4 w-4" />
        {t('board.back')}
      </Link>
      <PageHeader
        eyebrow={text(workspace.name)}
        title={board.name}
        description={board.description}
        action={
          canManage ? (
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setEditing(true)}>
                <Pencil className="h-4 w-4" />
                {t('board.edit')}
              </Button>
              <Button variant="secondary" onClick={() => setDeleting(true)}>
                <Trash2 className="h-4 w-4" />
                {t('board.delete')}
              </Button>
            </div>
          ) : undefined
        }
      />
      <AvatarGroup users={members} />
      {taskError ? (
        <p role="alert" className="text-sm text-rose-600">
          {t('board.taskSaveFailed')}
        </p>
      ) : null}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {taskStatuses.map((status) => (
          <StatusColumn
            key={status}
            status={status}
            tasks={tasks.filter((task) => task.status === status)}
            active={dropStatus === status}
            onAdd={() => setTaskDraft({ status, task: null })}
            onEdit={(task) => setTaskDraft({ status: task.status, task })}
            onDelete={setDeletingTask}
            onDragOver={() => setDropStatus(status)}
            onDragLeave={() => setDropStatus((current) => (current === status ? null : current))}
            onDrop={(taskId) => {
              setDropStatus(null)
              void updateBoardTask(taskId, { status }).then((saved) => setTaskError(!saved))
            }}
            onDragEnd={() => setDropStatus(null)}
            onStatusChange={(taskId, next) => {
              void updateBoardTask(taskId, { status: next }).then((saved) => setTaskError(!saved))
            }}
          />
        ))}
      </div>
      <BoardTaskModal
        boardId={board.id}
        status={taskDraft?.status ?? null}
        task={taskDraft?.task ?? null}
        members={members}
        onClose={() => setTaskDraft(null)}
      />
      <DeleteBoardTaskModal task={deletingTask} onClose={() => setDeletingTask(null)} />
      <CreateBoardModal open={editing} board={board} onClose={() => setEditing(false)} />
      <DeleteBoardModal
        board={deleting ? board : null}
        onClose={() => setDeleting(false)}
        onDeleted={() => navigate('/boards')}
      />
    </PageShell>
  )
}
