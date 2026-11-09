import { projectStatusLabel } from '../i18n/labels.ts'
import { searchText } from '../i18n/text.ts'
import type { Locale, Localized, Project, Task, User } from '../types/index.ts'

export interface SearchResult {
  id: string
  kind: 'project' | 'task'
  title: string
  detail: string
  to: string
}

export function searchWorkspace({
  query,
  projects,
  tasks,
  users,
  locale,
  text,
  projectLabel,
  noAssigneeLabel,
}: {
  query: string
  projects: Project[]
  tasks: Task[]
  users: User[]
  locale: Locale
  text: (value: Localized) => string
  projectLabel: string
  noAssigneeLabel: string
}): SearchResult[] {
  const trimmed = query.trim().toLowerCase()
  if (!trimmed) return []

  const projectHits: SearchResult[] = projects
    .filter((project) =>
      `${searchText(project.name)} ${searchText(project.description)}`.toLowerCase().includes(trimmed),
    )
    .slice(0, 5)
    .map((project) => ({
      id: project.id,
      kind: 'project',
      title: text(project.name),
      detail: projectStatusLabel(project.status, locale),
      to: `/projects?project=${project.id}`,
    }))

  const taskHits: SearchResult[] = tasks
    .filter((task) => searchText(task.title).toLowerCase().includes(trimmed))
    .slice(0, 5)
    .map((task) => {
      const project = projects.find((item) => item.id === task.projectId)
      const assignee = users.find((user) => user.id === task.assigneeId)
      const projectName = project ? text(project.name) : projectLabel
      const assigneeName = assignee ? text(assignee.name) : noAssigneeLabel
      return {
        id: task.id,
        kind: 'task',
        title: text(task.title),
        detail: `${projectName} · ${assigneeName}`,
        to: '/boards',
      }
    })

  return [...projectHits, ...taskHits]
}
