import { ActivityFeed } from '../../features/dashboard/ActivityFeed.tsx'
import { DashboardHero } from '../../features/dashboard/DashboardHero.tsx'
import { ProjectOverview } from '../../features/dashboard/ProjectOverview.tsx'
import { StatGrid } from '../../features/dashboard/StatGrid.tsx'
import { UpcomingTasks } from '../../features/dashboard/UpcomingTasks.tsx'
import { AiComposer } from '../../features/ai-assistant/AiComposer.tsx'
import { PageShell } from '../../components/layout/PageHeader.tsx'

export function DashboardPage() {
  return (
    <PageShell>
      <DashboardHero />
      <StatGrid />
      <ProjectOverview />
      <div className="grid gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <UpcomingTasks />
        </div>
        <div className="flex flex-col gap-6 xl:col-span-2">
          <AiComposer
            title="Пусть AI разложит работу"
            description="Сложные идеи превращаются в структурированные задачи, с ответственными и следующим шагом."
            placeholder="Опишите, что нужно сделать..."
            actionLabel="Сгенерировать задачи"
          />
          <ActivityFeed />
        </div>
      </div>
    </PageShell>
  )
}
