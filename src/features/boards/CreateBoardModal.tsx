import { useState, type FormEvent } from 'react'
import { Avatar } from '../../components/ui/Avatar.tsx'
import { Button } from '../../components/ui/Button.tsx'
import { Field, Input, Textarea } from '../../components/ui/Input.tsx'
import { Modal } from '../../components/ui/Modal.tsx'
import { useI18n } from '../../i18n/useI18n.ts'
import { useAppStore } from '../../store/useAppStore.ts'
import type { Board } from '../../types/index.ts'
import { cn } from '../../utils/cn.ts'
import { profileAsUser } from './profileUser.ts'

function BoardForm({ board, onClose }: { board?: Board; onClose: () => void }) {
  const addBoard = useAppStore((state) => state.addBoard)
  const updateBoard = useAppStore((state) => state.updateBoard)
  const profiles = useAppStore((state) => state.profiles)
  const currentUserId = useAppStore((state) => state.currentUserId)
  const { t, text } = useI18n()
  const members = profiles.map(profileAsUser)
  const [name, setName] = useState(board?.name ?? '')
  const [description, setDescription] = useState(board?.description ?? '')
  const [memberIds, setMemberIds] = useState<string[]>(board?.memberIds ?? [currentUserId])
  const [error, setError] = useState<'name' | 'description' | 'members' | 'save' | null>(null)
  const [pending, setPending] = useState(false)

  function toggleMember(id: string) {
    setMemberIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  async function onSubmit(event: FormEvent) {
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
    setPending(true)
    const details = {
      name: name.trim(),
      description: description.trim(),
      memberIds,
    }
    const saved = board ? await updateBoard(board.id, details) : await addBoard(details)
    setPending(false)
    if (!saved) {
      setError('save')
      return
    }
    onClose()
  }

  const errorText =
    error === 'name'
      ? t('board.nameRequired')
      : error === 'description'
        ? t('board.descriptionRequired')
        : error === 'members'
          ? t('board.membersRequired')
          : error === 'save'
            ? t('board.saveFailed')
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
        <Button variant="secondary" onClick={onClose} disabled={pending}>
          {t('create.cancel')}
        </Button>
        <Button type="submit" disabled={pending}>
          {board ? t('board.save') : t('board.submit')}
        </Button>
      </div>
    </form>
  )
}

export function CreateBoardModal({
  open,
  board,
  onClose,
}: {
  open: boolean
  board?: Board
  onClose: () => void
}) {
  const { t } = useI18n()

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={board ? t('board.editTitle') : t('board.modalTitle')}
      description={t('board.modalDescription')}
    >
      {open ? <BoardForm key={board?.id ?? 'new'} board={board} onClose={onClose} /> : null}
    </Modal>
  )
}
