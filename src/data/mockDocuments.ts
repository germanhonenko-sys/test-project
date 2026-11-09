import { loc } from '../i18n/text.ts'
import type { KnowledgeDocument } from '../types/index.ts'
import { hoursAgo } from './time.ts'

export const mockDocuments: KnowledgeDocument[] = [
  {
    id: 'doc-brief',
    workspaceId: 'ws-aivibe',
    name: loc('Бриф продукта.pdf', 'Product brief.pdf'),
    category: 'Продукт',
    updatedAt: hoursAgo(6),
    size: loc('1,2 МБ', '1.2 MB'),
  },
  {
    id: 'doc-api',
    workspaceId: 'ws-aivibe',
    name: loc('Руководство по API.md', 'API guide.md'),
    category: 'Разработка',
    updatedAt: hoursAgo(18),
    size: loc('86 КБ', '86 KB'),
  },
  {
    id: 'doc-tokens',
    workspaceId: 'ws-aivibe',
    name: loc('Дизайн-токены.fig', 'Design tokens.fig'),
    category: 'Дизайн',
    updatedAt: hoursAgo(30),
    size: loc('4,8 МБ', '4.8 MB'),
  },
  {
    id: 'doc-ritual',
    workspaceId: 'ws-aivibe',
    name: loc('Ритуал спринта.docx', 'Sprint ritual.docx'),
    category: 'Операции',
    updatedAt: hoursAgo(50),
    size: loc('240 КБ', '240 KB'),
  },
  {
    id: 'doc-ai',
    workspaceId: 'ws-aivibe',
    name: loc('Спецификация AI-ассистента.pdf', 'AI assistant spec.pdf'),
    category: 'Продукт',
    updatedAt: hoursAgo(12),
    size: loc('860 КБ', '860 KB'),
  },
  {
    id: 'doc-voice',
    workspaceId: 'ws-northwind',
    name: loc('Голос бренда.pdf', 'Brand voice.pdf'),
    category: 'Дизайн',
    updatedAt: hoursAgo(10),
    size: loc('640 КБ', '640 KB'),
  },
  {
    id: 'doc-requirements',
    workspaceId: 'ws-northwind',
    name: loc('Требования к порталу.docx', 'Portal requirements.docx'),
    category: 'Продукт',
    updatedAt: hoursAgo(22),
    size: loc('310 КБ', '310 KB'),
  },
]
