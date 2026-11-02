import { useWorkspaceData } from '../../hooks/useWorkspaceData.ts'
import { ProjectCard } from '../projects/ProjectCard.tsx'

export function ProjectOverview() {
  const { projects } = useWorkspaceData()

  return (
    <section>
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-zinc-900">Обзор проектов</h2>
        <p className="text-xs text-zinc-500">Активная и приостановленная работа в этом пространстве.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}
