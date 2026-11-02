import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card } from '../../components/ui/Card.tsx'
import { PageHeader, PageShell } from '../../components/layout/PageHeader.tsx'
import { TaskList } from '../../features/tasks/TaskList.tsx'
import { useWorkspaceData } from '../../hooks/useWorkspaceData.ts'
import { useAppStore } from '../../store/useAppStore.ts'
import { taskStatuses, type TaskStatus } from '../../types/index.ts'
import { cn } from '../../utils/cn.ts'
import { compareDeadline } from '../../utils/format.ts'

type StatusFilter = 'All' | TaskStatus

export function TasksPage() {
  const { tasks, currentUser, workspace } = useWorkspaceData()
  const compact = useAppStore((state) => state.preferences.compactLists)
  const [params] = useSearchParams()
  const highlightId = params.get('task') ?? undefined
  const [scope, setScope] = useState<'mine' | 'all'>('mine')
  const [status, setStatus] = useState<StatusFilter>('All')

  useEffect(() => {
    if (!highlightId) return
    const task = tasks.find((item) => item.id === highlightId)
    if (task && task.assigneeId !== currentUser.id) setScope('all')
  }, [highlightId, tasks, currentUser.id])

  useEffect(() => {
    if (!highlightId) return
    document.getElementById(`task-${highlightId}`)?.scrollIntoView({ block: 'center' })
  }, [highlightId, scope, status])

  const filters: StatusFilter[] = ['All', ...taskStatuses]
  const visible = tasks
    .filter((task) => (scope === 'mine' ? task.assigneeId === currentUser.id : true))
    .filter((task) => (status === 'All' ? true : task.status === status))
    .sort((a, b) => compareDeadline(a.deadline, b.deadline))

  return (
    <PageShell>
      <PageHeader
        eyebrow={workspace.name}
        title="Мои задачи"
        description="Все назначения в этом пространстве. Смена статуса сохраняется в демо до обновления страницы."
      />
      <div className="flex flex-wrap items-center gap-2">
        {(['mine', 'all'] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setScope(item)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium',
              scope === item ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-600 ring-1 ring-zinc-200',
            )}
          >
            {item === 'mine' ? 'Мои' : 'Все задачи'}
          </button>
        ))}
        <span className="mx-1 hidden h-4 w-px bg-zinc-200 sm:block" />
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setStatus(item)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium',
              status === item ? 'bg-indigo-600 text-white' : 'bg-white text-zinc-600 ring-1 ring-zinc-200',
            )}
          >
            {item === 'All' ? 'Все' : item}
          </button>
        ))}
      </div>
      <Card className="overflow-hidden">
        <TaskList
          tasks={visible}
          compact={compact}
          highlightId={highlightId}
          empty="Нет задач по этому фильтру."
        />
      </Card>
    </PageShell>
  )
}
