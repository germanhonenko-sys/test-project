import { loc } from '../i18n/text.ts'
import type { Project } from '../types/index.ts'

export const mockProjects: Project[] = [
  {
    id: 'proj-board',
    workspaceId: 'ws-aivibe',
    name: loc('Разработка AivibeBoard', 'AivibeBoard development'),
    description: loc(
      'Основная работа над досками, задачами и AI-ассистентом.',
      'Core work on boards, tasks, and the AI assistant.',
    ),
    memberIds: ['alex', 'maya', 'jordan', 'priya'],
    progress: 68,
    deadline: '2026-11-28T12:00:00',
    status: 'По плану',
  },
  {
    id: 'proj-medialog',
    workspaceId: 'ws-aivibe',
    name: loc('Платформа Medialog AI', 'Medialog AI platform'),
    description: loc(
      'Клиентское пространство для анализа медиа и автоматических отчётов.',
      'Client workspace for media analysis and automated reports.',
    ),
    memberIds: ['lena', 'priya', 'jordan'],
    progress: 42,
    deadline: '2026-12-15T12:00:00',
    status: 'Под угрозой',
  },
  {
    id: 'proj-marketing',
    workspaceId: 'ws-aivibe',
    name: loc('Маркетинговый сайт', 'Marketing site'),
    description: loc(
      'Публичный сайт, история запуска и скриншоты продукта.',
      'Public site, launch story, and product screenshots.',
    ),
    memberIds: ['sam', 'maya', 'alex'],
    progress: 81,
    deadline: '2026-11-12T12:00:00',
    status: 'По плану',
  },
  {
    id: 'proj-automation',
    workspaceId: 'ws-aivibe',
    name: loc('Внутренняя автоматизация', 'Internal automation'),
    description: loc(
      'Дайджесты стендапов, передачи дел и повторяющиеся ритуалы команды.',
      'Standup digests, handoffs, and recurring team rituals.',
    ),
    memberIds: ['lena', 'alex'],
    progress: 27,
    deadline: '2026-12-05T12:00:00',
    status: 'На паузе',
  },
  {
    id: 'proj-portal',
    workspaceId: 'ws-northwind',
    name: loc('Обновление клиентского портала', 'Client portal refresh'),
    description: loc(
      'Более понятный портал со статусами, файлами и обратной связью заказчика.',
      'A clearer portal for statuses, files, and client feedback.',
    ),
    memberIds: ['jordan', 'alex', 'sam'],
    progress: 54,
    deadline: '2026-11-21T12:00:00',
    status: 'По плану',
  },
  {
    id: 'proj-brand',
    workspaceId: 'ws-northwind',
    name: loc('Гайдлайн бренда', 'Brand guidelines'),
    description: loc(
      'Голос, цвет и материалы, которые студия использует с клиентами.',
      'Voice, color, and materials the studio uses with clients.',
    ),
    memberIds: ['sam', 'alex'],
    progress: 73,
    deadline: '2026-11-16T12:00:00',
    status: 'По плану',
  },
]
