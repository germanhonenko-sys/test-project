import { useWorkspaceData } from '../../hooks/useWorkspaceData.ts'
import { useI18n } from '../../i18n/useI18n.ts'
import { ProjectCard } from '../projects/ProjectCard.tsx'

export function ProjectOverview() {
  const { projects } = useWorkspaceData()
  const { t } = useI18n()

  return (
    <section>
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-zinc-900">{t('dash.projectOverview')}</h2>
        <p className="text-xs text-zinc-500">{t('dash.projectOverviewHint')}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}
