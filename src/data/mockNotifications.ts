import type { AppNotification } from '../types/index.ts'
import { hoursAgo } from './time.ts'

export const mockNotifications: AppNotification[] = [
  {
    id: 'note-1',
    title: 'Задача на проверке',
    body: 'Майя Чен перевела «Сверстать макет дашборда» в статус «На проверке».',
    timestamp: hoursAgo(0.4),
    read: false,
  },
  {
    id: 'note-2',
    title: 'Срок близко',
    body: 'Задача «Проверить пайплайн загрузки медиа» должна быть готова 5 ноября.',
    timestamp: hoursAgo(1),
    read: false,
  },
  {
    id: 'note-3',
    title: 'Новый комментарий',
    body: 'Сэм Оконкво прокомментировал структуру страницы запуска.',
    timestamp: hoursAgo(3),
    read: false,
  },
]
