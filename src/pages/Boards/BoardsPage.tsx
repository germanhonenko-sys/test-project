import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageHeader, PageShell } from '../../components/layout/PageHeader.tsx'
import { Button } from '../../components/ui/Button.tsx'
import { BoardCard } from '../../features/boards/BoardCard.tsx'
import { CreateBoardModal } from '../../features/boards/CreateBoardModal.tsx'
import { useWorkspaceData } from '../../hooks/useWorkspaceData.ts'
import { useI18n } from '../../i18n/useI18n.ts'

export function BoardsPage() {
  const { projects, workspace } = useWorkspaceData()
  const { t, text } = useI18n()
  const [params] = useSearchParams()
  const highlightId = params.get('board') ?? undefined
  const [createOpen, setCreateOpen] = useState(false)

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
        action={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            {t('board.add')}
          </Button>
        }
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
      <CreateBoardModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </PageShell>
  )
}
