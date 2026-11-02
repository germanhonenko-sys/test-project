import { Plus, Sparkles } from 'lucide-react'
import { Button, ButtonLink } from '../../components/ui/Button.tsx'
import { useWorkspaceData } from '../../hooks/useWorkspaceData.ts'
import { useAppStore } from '../../store/useAppStore.ts'
import { firstName } from '../../utils/users.ts'

export function DashboardHero() {
  const { currentUser } = useWorkspaceData()
  const openCreateTask = useAppStore((state) => state.openCreateTask)

  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">
          Добрый день, {firstName(currentUser.name)} 👋
        </h2>
        <p className="mt-1 text-sm text-zinc-500">Вот что происходит в рабочем пространстве сегодня.</p>
      </div>
      <div className="flex gap-2">
        <Button onClick={openCreateTask}>
          <Plus className="h-4 w-4" />
          Новая задача
        </Button>
        <ButtonLink to="/ai" variant="secondary">
          <Sparkles className="h-4 w-4" />
          Спросить AI
        </ButtonLink>
      </div>
    </div>
  )
}
