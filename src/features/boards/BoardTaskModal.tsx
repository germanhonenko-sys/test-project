import { useState, type FormEvent } from 'react'
import { Button } from '../../components/ui/Button.tsx'
import { Field, Input, Select } from '../../components/ui/Input.tsx'
import { Modal } from '../../components/ui/Modal.tsx'
import { useI18n } from '../../i18n/useI18n.ts'
import { priorityLabel } from '../../i18n/labels.ts'
import { useAppStore } from '../../store/useAppStore.ts'
import { taskPriorities, type BoardTask, type TaskPriority, type TaskStatus, type User } from '../../types/index.ts'
import { toStoredDate } from '../../utils/format.ts'
import { isTaskPriority } from '../../utils/guards.ts'
import { profileAsUser } from './profileUser.ts'

function dateInputValue(value: string | null) {
  return value ? value.slice(0, 10) : ''
}

function BoardTaskForm({
  boardId,
  status,
  task,
  members,
  onClose,
}: {
  boardId: string
  status: TaskStatus
  task: BoardTask | null
  members: User[]
  onClose: () => void
}) {
  const addBoardTask = useAppStore((state) => state.addBoardTask)
  const updateBoardTask = useAppStore((state) => state.updateBoardTask)
  const profiles = useAppStore((state) => state.profiles)
  const [title, setTitle] = useState(task?.title ?? '')
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? 'Средний')
  const [assigneeId, setAssigneeId] = useState(task?.assigneeId ?? '')
  const [deadline, setDeadline] = useState(dateInputValue(task?.deadline ?? null))
  const [error, setError] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const [pending, setPending] = useState(false)
  const { locale, t, text } = useI18n()
  const extraAssignee =
    assigneeId && !members.some((member) => member.id === assigneeId)
      ? profiles.map(profileAsUser).find((user) => user.id === assigneeId)
      : undefined

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) {
      setError(true)
      setSaveError(false)
      return
    }
    const draft = {
      title: trimmed,
      priority,
      assigneeId: assigneeId || null,
      deadline: deadline ? toStoredDate(deadline) : null,
      status: task?.status ?? status,
    }
    setPending(true)
    setSaveError(false)
    const saved = task
      ? await updateBoardTask(task.id, draft)
      : await addBoardTask({ ...draft, boardId, status })
    setPending(false)
    if (!saved) {
      setSaveError(true)
      return
    }
    onClose()
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label={t('create.name')}>
        <Input
          autoFocus
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder={t('create.namePlaceholder')}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t('create.priority')}>
          <Select
            value={priority}
            onChange={(event) => {
              if (isTaskPriority(event.target.value)) setPriority(event.target.value)
            }}
          >
            {taskPriorities.map((item) => (
              <option key={item} value={item}>
                {priorityLabel(item, locale)}
              </option>
            ))}
          </Select>
        </Field>
        <Field label={t('create.assignee')}>
          <Select value={assigneeId} onChange={(event) => setAssigneeId(event.target.value)}>
            <option value="">{t('header.noAssignee')}</option>
            {extraAssignee ? (
              <option value={extraAssignee.id}>{text(extraAssignee.name)}</option>
            ) : null}
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {text(member.name)}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Field label={t('create.due')}>
        <Input type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} />
      </Field>
      {error ? (
        <p role="alert" className="text-sm text-rose-600">
          {t('create.titleRequired')}
        </p>
      ) : null}
      {saveError ? (
        <p role="alert" className="text-sm text-rose-600">
          {t('board.taskSaveFailed')}
        </p>
      ) : null}
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose} disabled={pending}>
          {t('create.cancel')}
        </Button>
        <Button type="submit" disabled={pending}>
          {task ? t('board.save') : t('create.submit')}
        </Button>
      </div>
    </form>
  )
}

export function BoardTaskModal({
  boardId,
  status,
  task,
  members,
  onClose,
}: {
  boardId: string
  status: TaskStatus | null
  task: BoardTask | null
  members: User[]
  onClose: () => void
}) {
  const { t } = useI18n()
  const open = task !== null || status !== null
  const column = task?.status ?? status

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={task ? t('board.taskEditTitle') : t('board.taskCreateTitle')}
      description={t('board.taskModalDescription')}
    >
      {open && column ? (
        <BoardTaskForm
          key={task?.id ?? column}
          boardId={boardId}
          status={column}
          task={task}
          members={members}
          onClose={onClose}
        />
      ) : null}
    </Modal>
  )
}
