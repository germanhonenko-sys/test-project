import { loc } from '../i18n/text.ts'
import type { Workspace } from '../types/index.ts'

export const mockWorkspaces: Workspace[] = [
  {
    id: 'ws-aivibe',
    name: loc('Aivibe', 'Aivibe'),
    plan: loc('Pro', 'Pro'),
    projectDelta: loc('+2 за месяц', '+2 this month'),
  },
  {
    id: 'ws-northwind',
    name: loc('Студия Northwind', 'Northwind Studio'),
    plan: loc('Команда', 'Team'),
    projectDelta: loc('+1 за месяц', '+1 this month'),
  },
]
