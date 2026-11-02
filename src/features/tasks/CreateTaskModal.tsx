import { useState, type FormEvent } from 'react'
import { Button } from '../../components/ui/Button.tsx'
import { Field, Input, Select } from '../../components/ui/Input.tsx'
import { Modal } from '../../components/ui/Modal.tsx'
import { useWorkspaceData } from '../../hooks/useWorkspaceData.ts'
import { useAppStore } from '../../store/useAppStore.ts'
import { taskPriorities, type TaskPriority } from '../../types/index.ts'
import { toStoredDate } from '../../utils/format.ts'
import { isTaskPriority } from '../../utils/guards.ts'

function TaskForm() {
  const closeCreateTask = useAppStore((state) => state.closeCreateTask)
  const addTask = useAppStore((state) => state.addTask)
  const { workspace, projects, members, currentUser } = useWorkspaceData()
  const [title, setTitle] = useState('')
  const [projectId, setProjectId] = useState(projects[0]?.id ?? '')
  const [priority, setPriority] = useState<TaskPriority>('Средний')
  const [assigneeId, setAssigneeId] = useState(currentUser.id)
  const [deadline, setDeadline] = useState('2026-11-20')
  const [error, setError] = useState('')

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) {
      setError('Укажите название задачи.')
      return
    }
    if (!projectId) {
      setError('Сначала выберите проект.')
      return
    }
    addTask({
      workspaceId: workspace.id,
      projectId,
      title: trimmed,
      assigneeId,
      priority,
      status: 'К выполнению',
      deadline: toStoredDate(deadline),
    })
    closeCreateTask()
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="Название">
        <Input
          autoFocus
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Что нужно сделать?"
        />
      </Field>
      <Field label="Проект">
        <Select value={projectId} onChange={(event) => setProjectId(event.target.value)}>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </Select>
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Приоритет">
          <Select
            value={priority}
            onChange={(event) => {
              if (isTaskPriority(event.target.value)) setPriority(event.target.value)
            }}
          >
            {taskPriorities.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Исполнитель">
          <Select value={assigneeId} onChange={(event) => setAssigneeId(event.target.value)}>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Field label="Срок">
        <Input type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} />
      </Field>
      {error ? (
        <p role="alert" className="text-sm text-rose-600">
          {error}
        </p>
      ) : null}
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={closeCreateTask}>
          Отмена
        </Button>
        <Button type="submit">Создать задачу</Button>
      </div>
    </form>
  )
}

export function CreateTaskModal() {
  const open = useAppStore((state) => state.createTaskOpen)
  const closeCreateTask = useAppStore((state) => state.closeCreateTask)

  return (
    <Modal
      open={open}
      onClose={closeCreateTask}
      title="Новая задача"
      description="Сохранится в этом демо-пространстве до обновления страницы."
    >
      {open ? <TaskForm /> : null}
    </Modal>
  )
}
