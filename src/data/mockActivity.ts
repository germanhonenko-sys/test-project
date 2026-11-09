import { loc } from '../i18n/text.ts'
import type { Activity } from '../types/index.ts'
import { hoursAgo } from './time.ts'

export const mockActivity: Activity[] = [
  {
    id: 'act-1',
    workspaceId: 'ws-aivibe',
    actorId: 'jordan',
    kind: 'created',
    message: loc(
      'новая задача «Собрать боковое меню» в проекте «Разработка AivibeBoard».',
      'new task “Build the sidebar” in project “AivibeBoard development”.',
    ),
    timestamp: hoursAgo(2),
  },
  {
    id: 'act-2',
    workspaceId: 'ws-aivibe',
    actorId: 'sam',
    kind: 'comment',
    message: loc('комментарий к структуре страницы запуска.', 'comment on the launch page outline.'),
    timestamp: hoursAgo(3),
  },
  {
    id: 'act-3',
    workspaceId: 'ws-aivibe',
    actorId: 'alex',
    kind: 'status',
    message: loc(
      'статус «Проверить пайплайн загрузки медиа» изменён на «В работе».',
      'status of “Check the media upload pipeline” changed to “In progress”.',
    ),
    timestamp: hoursAgo(5),
  },
  {
    id: 'act-4',
    workspaceId: 'ws-aivibe',
    actorId: 'maya',
    kind: 'completed',
    message: loc('задача «Выбрать акцентный цвет» завершена.', 'task “Choose the accent color” completed.'),
    timestamp: hoursAgo(20),
  },
  {
    id: 'act-5',
    workspaceId: 'ws-aivibe',
    actorId: 'lena',
    kind: 'member',
    message: loc(
      'Джордан Блейк добавлен в проект «Платформа Medialog AI».',
      'Jordan Blake was added to project “Medialog AI platform”.',
    ),
    timestamp: hoursAgo(26),
  },
  {
    id: 'act-6',
    workspaceId: 'ws-aivibe',
    actorId: 'priya',
    kind: 'created',
    message: loc(
      'новая задача «Проверить пайплайн загрузки медиа» в проекте «Платформа Medialog AI».',
      'new task “Check the media upload pipeline” in project “Medialog AI platform”.',
    ),
    timestamp: hoursAgo(30),
  },
  {
    id: 'act-7',
    workspaceId: 'ws-northwind',
    actorId: 'sam',
    kind: 'comment',
    message: loc('комментарий к первому экрану сайта.', 'comment on the website hero.'),
    timestamp: hoursAgo(4),
  },
  {
    id: 'act-8',
    workspaceId: 'ws-northwind',
    actorId: 'jordan',
    kind: 'status',
    message: loc(
      'статус «Проверить навигацию клиентского портала» изменён на «В работе».',
      'status of “Review client portal navigation” changed to “In progress”.',
    ),
    timestamp: hoursAgo(8),
  },
  {
    id: 'act-9',
    workspaceId: 'ws-northwind',
    actorId: 'alex',
    kind: 'created',
    message: loc(
      'новая задача «Собрать обратную связь заказчика» в проекте «Обновление клиентского портала».',
      'new task “Collect client feedback” in project “Client portal refresh”.',
    ),
    timestamp: hoursAgo(28),
  },
]
