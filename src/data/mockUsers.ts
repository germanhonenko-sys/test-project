import { loc } from '../i18n/text.ts'
import type { User } from '../types/index.ts'

export const mockUsers: User[] = [
  {
    id: 'alex',
    name: loc('Алексей Морозов', 'Alexey Morozov'),
    role: loc('Руководитель продукта', 'Product lead'),
    email: 'alex@aivibe.io',
    initials: loc('АМ', 'AM'),
    color: 'bg-indigo-600',
    workspaceIds: ['ws-aivibe', 'ws-northwind'],
  },
  {
    id: 'maya',
    name: loc('Майя Чен', 'Maya Chen'),
    role: loc('Продуктовый дизайнер', 'Product designer'),
    email: 'maya@aivibe.io',
    initials: loc('МЧ', 'MC'),
    color: 'bg-violet-600',
    workspaceIds: ['ws-aivibe'],
  },
  {
    id: 'jordan',
    name: loc('Джордан Блейк', 'Jordan Blake'),
    role: loc('Фронтенд-разработчик', 'Frontend developer'),
    email: 'jordan@aivibe.io',
    initials: loc('ДБ', 'JB'),
    color: 'bg-sky-600',
    workspaceIds: ['ws-aivibe', 'ws-northwind'],
  },
  {
    id: 'priya',
    name: loc('Прия Шах', 'Priya Shah'),
    role: loc('Бэкенд-разработчик', 'Backend developer'),
    email: 'priya@aivibe.io',
    initials: loc('ПШ', 'PS'),
    color: 'bg-emerald-600',
    workspaceIds: ['ws-aivibe'],
  },
  {
    id: 'sam',
    name: loc('Сэм Оконкво', 'Sam Okonkwo'),
    role: loc('Руководитель маркетинга', 'Marketing lead'),
    email: 'sam@aivibe.io',
    initials: loc('СО', 'SO'),
    color: 'bg-amber-600',
    workspaceIds: ['ws-aivibe', 'ws-northwind'],
  },
  {
    id: 'lena',
    name: loc('Лена Фогель', 'Lena Vogel'),
    role: loc('Менеджер проектов', 'Project manager'),
    email: 'lena@aivibe.io',
    initials: loc('ЛФ', 'LV'),
    color: 'bg-rose-600',
    workspaceIds: ['ws-aivibe'],
  },
]
