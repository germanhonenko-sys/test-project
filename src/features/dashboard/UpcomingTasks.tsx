import { ButtonLink } from '../../components/ui/Button.tsx'
import { Card } from '../../components/ui/Card.tsx'
import { useWorkspaceData } from '../../hooks/useWorkspaceData.ts'
import { useI18n } from '../../i18n/useI18n.ts'
import { useAppStore } from '../../store/useAppStore.ts'
import { compareDeadline } from '../../utils/format.ts'
import { TaskList } from '../tasks/TaskList.tsx'

export function UpcomingTasks() {
  const { tasks, currentUser } = useWorkspaceData()
  const compact = useAppStore((state) => state.preferences.compactLists)
  const { t } = useI18n()
  const upcoming = tasks
    .filter((task) => task.assigneeId === currentUser.id && task.status !== 'Готово')
    .sort((a, b) => compareDeadline(a.deadline, b.deadline))
    .slice(0, 5)

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900">{t('dash.upcoming')}</h2>
          <p className="text-xs text-zinc-500">{t('dash.upcomingHint')}</p>
        </div>
        <ButtonLink to="/tasks" variant="ghost" size="sm">
          {t('dash.allTasks')}
        </ButtonLink>
      </div>
      <TaskList
        tasks={upcoming}
        compact={compact}
        empty={t('dash.upcomingEmpty')}
      />
    </Card>
  )
}
