import { CircleCheck, FolderKanban, ListTodo, TrendingUp, Users } from 'lucide-react'
import { AvatarGroup } from '../../components/ui/Avatar.tsx'
import { Card } from '../../components/ui/Card.tsx'
import { useWorkspaceData } from '../../hooks/useWorkspaceData.ts'

export function StatGrid() {
  const { projects, tasks, members, currentUser, workspace } = useWorkspaceData()
  const active = projects.filter((project) => project.status === 'По плану' || project.status === 'Под угрозой').length
  const mine = tasks.filter((task) => task.assigneeId === currentUser.id)
  const inProgress = mine.filter((task) => task.status === 'В работе').length
  const done = tasks.filter((task) => task.status === 'Готово').length
  const percent = tasks.length === 0 ? 0 : Math.round((done / tasks.length) * 100)

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Card className="p-4">
        <div className="flex items-start justify-between">
          <p className="text-sm text-zinc-500">Активные проекты</p>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <FolderKanban className="h-4 w-4" />
          </span>
        </div>
        <p className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">{active}</p>
        <p className="mt-1 flex items-center gap-1 text-xs text-emerald-700">
          <TrendingUp className="h-3 w-3" />
          {workspace.projectDelta}
        </p>
      </Card>
      <Card className="p-4">
        <div className="flex items-start justify-between">
          <p className="text-sm text-zinc-500">Мои задачи</p>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <ListTodo className="h-4 w-4" />
          </span>
        </div>
        <p className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">{mine.length}</p>
        <p className="mt-1 text-xs text-zinc-500">{inProgress} в работе</p>
      </Card>
      <Card className="p-4">
        <div className="flex items-start justify-between">
          <p className="text-sm text-zinc-500">Завершено</p>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <CircleCheck className="h-4 w-4" />
          </span>
        </div>
        <p className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">{done}</p>
        <p className="mt-1 text-xs text-zinc-500">{percent}% задач пространства</p>
      </Card>
      <Card className="p-4">
        <div className="flex items-start justify-between">
          <p className="text-sm text-zinc-500">Участники</p>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Users className="h-4 w-4" />
          </span>
        </div>
        <p className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">{members.length}</p>
        <div className="mt-2">
          <AvatarGroup users={members} />
        </div>
      </Card>
    </div>
  )
}
