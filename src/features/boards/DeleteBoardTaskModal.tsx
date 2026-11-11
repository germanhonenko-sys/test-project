import { useState } from 'react'
import { Button } from '../../components/ui/Button.tsx'
import { Modal } from '../../components/ui/Modal.tsx'
import { useI18n } from '../../i18n/useI18n.ts'
import { useAppStore } from '../../store/useAppStore.ts'
import type { BoardTask } from '../../types/index.ts'

export function DeleteBoardTaskModal({ task, onClose }: { task: BoardTask | null; onClose: () => void }) {
  const removeBoardTask = useAppStore((state) => state.removeBoardTask)
  const { t } = useI18n()
  const [error, setError] = useState(false)
  const [pending, setPending] = useState(false)

  return (
    <Modal
      open={task !== null}
      onClose={onClose}
      title={t('board.taskDeleteTitle')}
      description={task ? t('board.taskDeleteBody', { name: task.title }) : undefined}
    >
      {error ? (
        <p role="alert" className="mb-3 text-sm text-rose-600">
          {t('board.taskDeleteFailed')}
        </p>
      ) : null}
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose} disabled={pending}>
          {t('create.cancel')}
        </Button>
        <Button
          variant="danger"
          disabled={pending || !task}
          onClick={() => {
            if (!task) return
            setPending(true)
            setError(false)
            void removeBoardTask(task.id).then((removed) => {
              setPending(false)
              if (!removed) {
                setError(true)
                return
              }
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
