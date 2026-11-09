import { Badge } from '../../components/ui/Badge.tsx'
import { useWorkspaceData } from '../../hooks/useWorkspaceData.ts'
import { useI18n } from '../../i18n/useI18n.ts'
import { statusLabel } from '../../i18n/labels.ts'
import { taskStatuses, type Project } from '../../types/index.ts'
import { cn } from '../../utils/cn.ts'
import { statusBadgeClass } from '../../utils/tones.ts'

export function BoardCard({ project, highlighted = false }: { project: Project; highlighted?: boolean }) {
  const { tasks } = useWorkspaceData()
  const { locale, text } = useI18n()
  const projectTasks = tasks.filter((task) => task.projectId === project.id)

  return (
    <article
      id={`board-${project.id}`}
      className={cn(
        'flex h-full flex-col rounded-xl border border-zinc-200 bg-white p-4 shadow-sm',
        highlighted && 'ring-2 ring-indigo-500',
      )}
    >
      <h3 className="text-sm font-semibold text-zinc-900">{text(project.name)}</h3>
      <ul className="mt-4 grid grid-cols-2 gap-2">
        {taskStatuses.map((status) => {
          const count = projectTasks.filter((task) => task.status === status).length
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
    </article>
  )
}
