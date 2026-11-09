import { useState, type FormEvent } from 'react'
import { Avatar } from '../../components/ui/Avatar.tsx'
import { Button } from '../../components/ui/Button.tsx'
import { Field, Input, Textarea } from '../../components/ui/Input.tsx'
import { Modal } from '../../components/ui/Modal.tsx'
import { useWorkspaceData } from '../../hooks/useWorkspaceData.ts'
import { useI18n } from '../../i18n/useI18n.ts'
import { useAppStore } from '../../store/useAppStore.ts'
import { cn } from '../../utils/cn.ts'

function BoardForm({ onClose }: { onClose: () => void }) {
  const addBoard = useAppStore((state) => state.addBoard)
  const { workspace, members, currentUser } = useWorkspaceData()
  const { t, text } = useI18n()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [memberIds, setMemberIds] = useState<string[]>([currentUser.id])
  const [error, setError] = useState<'name' | 'description' | 'members' | null>(null)

  function toggleMember(id: string) {
    setMemberIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!name.trim()) {
      setError('name')
      return
    }
    if (!description.trim()) {
      setError('description')
      return
    }
    if (memberIds.length === 0) {
      setError('members')
      return
    }
    addBoard({
      workspaceId: workspace.id,
      name: name.trim(),
      description: description.trim(),
      memberIds,
    })
    onClose()
  }

  const errorText =
    error === 'name'
      ? t('board.nameRequired')
      : error === 'description'
        ? t('board.descriptionRequired')
        : error === 'members'
          ? t('board.membersRequired')
          : null

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label={t('board.name')}>
        <Input
          autoFocus
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder={t('board.namePlaceholder')}
        />
      </Field>
      <Field label={t('board.description')}>
        <Textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder={t('board.descriptionPlaceholder')}
        />
      </Field>
      <fieldset>
        <legend className="mb-1.5 text-xs font-medium text-zinc-600">{t('board.access')}</legend>
        <ul className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-zinc-200 p-1">
          {members.map((member) => {
            const checked = memberIds.includes(member.id)
            return (
              <li key={member.id}>
                <label
                  className={cn(
                    'flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5',
                    checked ? 'bg-indigo-50' : 'hover:bg-zinc-50',
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleMember(member.id)}
                    className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500/30"
                  />
                  <Avatar user={member} size="sm" />
                  <span className="text-sm text-zinc-800">{text(member.name)}</span>
                </label>
              </li>
            )
          })}
        </ul>
      </fieldset>
      {errorText ? (
        <p role="alert" className="text-sm text-rose-600">
          {errorText}
        </p>
      ) : null}
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>
          {t('create.cancel')}
        </Button>
        <Button type="submit">{t('board.submit')}</Button>
      </div>
    </form>
  )
}

export function CreateBoardModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n()

  return (
    <Modal open={open} onClose={onClose} title={t('board.modalTitle')} description={t('board.modalDescription')}>
      {open ? <BoardForm onClose={onClose} /> : null}
    </Modal>
  )
}
