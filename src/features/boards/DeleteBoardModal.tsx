import { useState } from 'react'
import { Button } from '../../components/ui/Button.tsx'
import { Modal } from '../../components/ui/Modal.tsx'
import { useI18n } from '../../i18n/useI18n.ts'
import { useAppStore } from '../../store/useAppStore.ts'
import type { Board } from '../../types/index.ts'

export function DeleteBoardModal({
  board,
  onClose,
  onDeleted,
}: {
  board: Board | null
  onClose: () => void
  onDeleted?: () => void
}) {
  const removeBoard = useAppStore((state) => state.removeBoard)
  const { t } = useI18n()
  const [error, setError] = useState(false)
  const [pending, setPending] = useState(false)

  return (
    <Modal
      open={board !== null}
      onClose={onClose}
      title={t('board.deleteTitle')}
      description={board ? t('board.deleteBody', { name: board.name }) : undefined}
    >
      {error ? (
        <p role="alert" className="mb-3 text-sm text-rose-600">
          {t('board.deleteFailed')}
        </p>
      ) : null}
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose} disabled={pending}>
          {t('create.cancel')}
        </Button>
        <Button
          variant="danger"
          disabled={pending}
          onClick={() => {
            if (!board) return
            setPending(true)
            void removeBoard(board.id).then((removed) => {
              setPending(false)
              if (!removed) {
                setError(true)
                return
              }
              onDeleted?.()
              onClose()
            })
          }}
        >
          {t('board.deleteConfirm')}
        </Button>
      </div>
    </Modal>
  )
}
