import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageHeader, PageShell } from '../../components/layout/PageHeader.tsx'
import { Button } from '../../components/ui/Button.tsx'
import { BoardCard } from '../../features/boards/BoardCard.tsx'
import { CreateBoardModal } from '../../features/boards/CreateBoardModal.tsx'
import { DeleteBoardModal } from '../../features/boards/DeleteBoardModal.tsx'
import { useBoards } from '../../features/boards/useBoards.ts'
import { useWorkspaceData } from '../../hooks/useWorkspaceData.ts'
import { useI18n } from '../../i18n/useI18n.ts'
import { useAppStore } from '../../store/useAppStore.ts'
import type { Board } from '../../types/index.ts'

export function BoardsPage() {
  const workspace = useWorkspaceData().workspace
  const boards = useAppStore((state) => state.boards)
  const boardsStatus = useAppStore((state) => state.boardsStatus)
  const { t, text } = useI18n()
  const [params] = useSearchParams()
  const highlightId = params.get('board') ?? undefined
  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState<Board | null>(null)
  const [deleting, setDeleting] = useState<Board | null>(null)
  useBoards()

  useEffect(() => {
    if (!highlightId) return
    document.getElementById(`board-${highlightId}`)?.scrollIntoView({ block: 'center' })
  }, [highlightId, boards])

  return (
    <PageShell>
      <PageHeader
        eyebrow={text(workspace.name)}
        title={t('nav.boards')}
        description={t('page.boardsDescription')}
        action={
          <Button onClick={() => setCreateOpen(true)} disabled={boardsStatus !== 'ready'}>
            <Plus className="h-4 w-4" />
            {t('board.add')}
          </Button>
        }
      />
      {boardsStatus === 'loading' || boardsStatus === 'idle' ? (
        <p className="text-sm text-zinc-500">{t('board.loading')}</p>
      ) : boardsStatus === 'error' ? (
        <p className="text-sm text-rose-600">{t('board.saveFailed')}</p>
      ) : boards.length === 0 ? (
        <p className="text-sm text-zinc-500">{t('page.boardsEmpty')}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {boards.map((board) => (
            <BoardCard
              key={board.id}
              board={board}
              highlighted={board.id === highlightId}
              onEdit={() => setEditing(board)}
              onDelete={() => setDeleting(board)}
            />
          ))}
        </div>
      )}
      <CreateBoardModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <CreateBoardModal open={editing !== null} board={editing ?? undefined} onClose={() => setEditing(null)} />
      <DeleteBoardModal board={deleting} onClose={() => setDeleting(null)} />
    </PageShell>
  )
}
