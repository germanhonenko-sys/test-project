import { loc } from '../i18n/text.ts'
import type { AppNotification } from '../types/index.ts'
import { hoursAgo } from './time.ts'

export const mockNotifications: AppNotification[] = [
  {
    id: 'note-1',
    title: loc('Задача на проверке', 'Task in review'),
    body: loc(
      'Майя Чен перевела «Сверстать макет дашборда» в статус «На проверке».',
      'Maya Chen moved “Lay out the dashboard mockup” to “In review”.',
    ),
    timestamp: hoursAgo(0.4),
    read: false,
  },
  {
    id: 'note-2',
    title: loc('Срок близко', 'Deadline is close'),
    body: loc(
      'Задача «Проверить пайплайн загрузки медиа» должна быть готова 5 ноября.',
      '“Check the media upload pipeline” is due November 5.',
    ),
    timestamp: hoursAgo(1),
    read: false,
  },
  {
    id: 'note-3',
    title: loc('Новый комментарий', 'New comment'),
    body: loc(
      'Сэм Оконкво прокомментировал структуру страницы запуска.',
      'Sam Okonkwo commented on the launch page outline.',
    ),
    timestamp: hoursAgo(3),
    read: false,
  },
]
