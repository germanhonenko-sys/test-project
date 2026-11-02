import { ArrowRight, CircleCheck, MessageSquare, Plus, UserPlus, type LucideIcon } from 'lucide-react'
import { Avatar } from '../../components/ui/Avatar.tsx'
import { Card } from '../../components/ui/Card.tsx'
import { useWorkspaceData } from '../../hooks/useWorkspaceData.ts'
import type { ActivityKind } from '../../types/index.ts'
import { formatRelative } from '../../utils/format.ts'
import { userById } from '../../utils/users.ts'

const activityIcon: Record<ActivityKind, LucideIcon> = {
  created: Plus,
  completed: CircleCheck,
  status: ArrowRight,
  member: UserPlus,
  comment: MessageSquare,
}

export function ActivityFeed() {
  const { activity, users } = useWorkspaceData()
  const items = activity.slice(0, 6)

  return (
    <Card className="p-4">
      <h2 className="text-sm font-semibold text-zinc-900">Недавняя активность</h2>
      <p className="mt-0.5 text-xs text-zinc-500">Что команда изменила за последнее время.</p>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-500">Пока нет событий.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((item) => {
            const actor = userById(users, item.actorId)
            const Icon = activityIcon[item.kind]
            return (
              <li key={item.id} className="flex gap-3">
                {actor ? <Avatar user={actor} size="sm" /> : null}
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-zinc-600">
                    <span className="font-medium text-zinc-900">{actor?.name ?? 'Кто-то'}</span> — {item.message}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-zinc-400">
                    <Icon className="h-3 w-3" />
                    {formatRelative(item.timestamp)}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}
