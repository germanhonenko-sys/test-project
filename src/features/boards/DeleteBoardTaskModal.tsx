import { Button } from '../../components/ui/Button.tsx'
import { Modal } from '../../components/ui/Modal.tsx'
import { useI18n } from '../../i18n/useI18n.ts'
import { useAppStore } from '../../store/useAppStore.ts'
import type { BoardTask } from '../../types/index.ts'

export function DeleteBoardTaskModal({ task, onClose }: { task: BoardTask | null; onClose: () => void }) {
  const removeBoardTask = useAppStore((state) => state.removeBoardTask)
  const { t } = useI18n()

  return (
    <Modal
      open={task !== null}
      onClose={onClose}
      title={t('board.taskDeleteTitle')}
      description={task ? t('board.taskDeleteBody', { name: task.title }) : undefined}
    >
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>
          {t('create.cancel')}
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            if (!task) return
            removeBoardTask(task.id)
            onClose()
          }}
        >
          {t('board.deleteConfirm')}
        </Button>
      </div>
    </Modal>
  )
}
