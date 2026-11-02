import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageHeader, PageShell } from '../../components/layout/PageHeader.tsx'
import { ProjectCard } from '../../features/projects/ProjectCard.tsx'
import { useWorkspaceData } from '../../hooks/useWorkspaceData.ts'

export function ProjectsPage() {
  const { projects, workspace } = useWorkspaceData()
  const [params] = useSearchParams()
  const highlightId = params.get('project') ?? undefined

  useEffect(() => {
    if (!highlightId) return
    document.getElementById(`project-${highlightId}`)?.scrollIntoView({ block: 'center' })
  }, [highlightId])

  return (
    <PageShell>
      <PageHeader
        eyebrow={workspace.name}
        title="Проекты"
        description="Текущие направления, прогресс и люди, которые их ведут."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} highlighted={project.id === highlightId} />
        ))}
      </div>
    </PageShell>
  )
}
