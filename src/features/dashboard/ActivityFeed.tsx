import { ArrowRight, CircleCheck, MessageSquare, Plus, UserPlus, type LucideIcon } from 'lucide-react'
import { Avatar } from '../../components/ui/Avatar.tsx'
import { Card } from '../../components/ui/Card.tsx'
import { useWorkspaceData } from '../../hooks/useWorkspaceData.ts'
import { useI18n } from '../../i18n/useI18n.ts'
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
  const { locale, t, text } = useI18n()

  return (
    <Card className="p-4">
      <h2 className="text-sm font-semibold text-zinc-900">{t('dash.activity')}</h2>
      <p className="mt-0.5 text-xs text-zinc-500">{t('dash.activityHint')}</p>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-500">{t('dash.activityEmpty')}</p>
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
                    <span className="font-medium text-zinc-900">{actor ? text(actor.name) : t('dash.someone')}</span> — {text(item.message)}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-zinc-400">
                    <Icon className="h-3 w-3" />
                    {formatRelative(item.timestamp, locale)}
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
