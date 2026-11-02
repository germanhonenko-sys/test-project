import type { KnowledgeDocument } from '../types/index.ts'
import { hoursAgo } from './time.ts'

export const mockDocuments: KnowledgeDocument[] = [
  {
    id: 'doc-brief',
    workspaceId: 'ws-aivibe',
    name: 'Бриф продукта.pdf',
    category: 'Продукт',
    updatedAt: hoursAgo(6),
    size: '1,2 МБ',
  },
  {
    id: 'doc-api',
    workspaceId: 'ws-aivibe',
    name: 'Руководство по API.md',
    category: 'Разработка',
    updatedAt: hoursAgo(18),
    size: '86 КБ',
  },
  {
    id: 'doc-tokens',
    workspaceId: 'ws-aivibe',
    name: 'Дизайн-токены.fig',
    category: 'Дизайн',
    updatedAt: hoursAgo(30),
    size: '4,8 МБ',
  },
  {
    id: 'doc-ritual',
    workspaceId: 'ws-aivibe',
    name: 'Ритуал спринта.docx',
    category: 'Операции',
    updatedAt: hoursAgo(50),
    size: '240 КБ',
  },
  {
    id: 'doc-ai',
    workspaceId: 'ws-aivibe',
    name: 'Спецификация AI-ассистента.pdf',
    category: 'Продукт',
    updatedAt: hoursAgo(12),
    size: '860 КБ',
  },
  {
    id: 'doc-voice',
    workspaceId: 'ws-northwind',
    name: 'Голос бренда.pdf',
    category: 'Дизайн',
    updatedAt: hoursAgo(10),
    size: '640 КБ',
  },
  {
    id: 'doc-requirements',
    workspaceId: 'ws-northwind',
    name: 'Требования к порталу.docx',
    category: 'Продукт',
    updatedAt: hoursAgo(22),
    size: '310 КБ',
  },
]
