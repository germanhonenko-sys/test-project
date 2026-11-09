import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageHeader, PageShell } from '../../components/layout/PageHeader.tsx'
import { BoardCard } from '../../features/boards/BoardCard.tsx'
import { useWorkspaceData } from '../../hooks/useWorkspaceData.ts'
import { useI18n } from '../../i18n/useI18n.ts'

export function BoardsPage() {
  const { projects, workspace } = useWorkspaceData()
  const { t, text } = useI18n()
  const [params] = useSearchParams()
  const highlightId = params.get('board') ?? undefined

  useEffect(() => {
    if (!highlightId) return
    document.getElementById(`board-${highlightId}`)?.scrollIntoView({ block: 'center' })
  }, [highlightId])

  return (
    <PageShell>
      <PageHeader
        eyebrow={text(workspace.name)}
        title={t('nav.boards')}
        description={t('page.boardsDescription')}
      />
      {projects.length === 0 ? (
        <p className="text-sm text-zinc-500">{t('page.boardsEmpty')}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <BoardCard key={project.id} project={project} highlighted={project.id === highlightId} />
          ))}
        </div>
      )}
    </PageShell>
  )
}
