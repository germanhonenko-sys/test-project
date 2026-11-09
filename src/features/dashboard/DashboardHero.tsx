import { Plus, Sparkles } from 'lucide-react'
import { Button, ButtonLink } from '../../components/ui/Button.tsx'
import { useWorkspaceData } from '../../hooks/useWorkspaceData.ts'
import { useI18n } from '../../i18n/useI18n.ts'
import { useAppStore } from '../../store/useAppStore.ts'
import { firstName } from '../../utils/users.ts'

export function DashboardHero() {
  const { currentUser } = useWorkspaceData()
  const openCreateTask = useAppStore((state) => state.openCreateTask)
  const { t, text } = useI18n()

  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">
          {t('dash.greeting', { name: firstName(text(currentUser.name)) })}
        </h2>
        <p className="mt-1 text-sm text-zinc-500">{t('dash.today')}</p>
      </div>
      <div className="flex gap-2">
        <Button onClick={openCreateTask}>
          <Plus className="h-4 w-4" />
          {t('header.newTask')}
        </Button>
        <ButtonLink to="/ai" variant="secondary">
          <Sparkles className="h-4 w-4" />
          {t('dash.askAi')}
        </ButtonLink>
      </div>
    </div>
  )
}
