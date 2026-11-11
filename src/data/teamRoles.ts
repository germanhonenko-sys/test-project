import { loc } from '../i18n/text.ts'
import type { Localized } from '../types/index.ts'

export const teamRoles = [
  'frontend',
  'backend',
  'fullstack',
  'mobile',
  'qa',
  'devops',
  'design',
  'product',
  'project',
  'lead',
  'analyst',
] as const

export type TeamRole = (typeof teamRoles)[number]

const labels: Record<TeamRole, Localized> = {
  frontend: loc('Фронтенд-разработчик', 'Frontend developer'),
  backend: loc('Бэкенд-разработчик', 'Backend developer'),
  fullstack: loc('Фулстек-разработчик', 'Fullstack developer'),
  mobile: loc('Мобильный разработчик', 'Mobile developer'),
  qa: loc('QA-инженер', 'QA engineer'),
  devops: loc('DevOps-инженер', 'DevOps engineer'),
  design: loc('UI/UX-дизайнер', 'UI/UX designer'),
  product: loc('Менеджер продукта', 'Product manager'),
  project: loc('Менеджер проектов', 'Project manager'),
  lead: loc('Тимлид', 'Team lead'),
  analyst: loc('Аналитик', 'Analyst'),
}

export function isTeamRole(value: string): value is TeamRole {
  return (teamRoles as readonly string[]).includes(value)
}

export function teamRoleLabel(value: string): Localized {
  return isTeamRole(value) ? labels[value] : loc('Участник', 'Member')
}

export function teamRoleKey(role: Localized): TeamRole | '' {
  const match = teamRoles.find((key) => labels[key].ru === role.ru && labels[key].en === role.en)
  return match ?? ''
}
