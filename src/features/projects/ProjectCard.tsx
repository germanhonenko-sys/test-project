import { Link } from 'react-router-dom'
import { AvatarGroup } from '../../components/ui/Avatar.tsx'
import { Badge } from '../../components/ui/Badge.tsx'
import { Progress } from '../../components/ui/Progress.tsx'
import { useWorkspaceData } from '../../hooks/useWorkspaceData.ts'
import type { Project } from '../../types/index.ts'
import { cn } from '../../utils/cn.ts'
import { formatDeadline, plural } from '../../utils/format.ts'
import { projectStatusClass } from '../../utils/tones.ts'
import { usersByIds } from '../../utils/users.ts'

export function ProjectCard({ project, highlighted = false }: { project: Project; highlighted?: boolean }) {
  const { users, tasks } = useWorkspaceData()
  const members = usersByIds(users, project.memberIds)
  const taskCount = tasks.filter((task) => task.projectId === project.id).length

  return (
    <Link
      id={`project-${project.id}`}
      to={`/projects?project=${project.id}`}
      className={cn(
        'flex h-full flex-col rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-colors hover:border-zinc-300',
        highlighted && 'ring-2 ring-indigo-500',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-zinc-900">{project.name}</h3>
        <Badge className={projectStatusClass[project.status]}>{project.status}</Badge>
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-zinc-500">{project.description}</p>
      <div className="mt-4">
        <AvatarGroup users={members} />
      </div>
      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs text-zinc-500">
          <span>Прогресс</span>
          <span className="font-medium text-zinc-700">{project.progress}%</span>
        </div>
        <Progress value={project.progress} />
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
        <span>
          {taskCount} {plural(taskCount, 'задача', 'задачи', 'задач')}
        </span>
        <span>Срок {formatDeadline(project.deadline)}</span>
      </div>
    </Link>
  )
}
