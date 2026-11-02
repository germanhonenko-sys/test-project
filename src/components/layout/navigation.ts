import {
  BookOpen,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  Send,
  Settings,
  Sparkles,
  Users,
  WandSparkles,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
  hash?: string
}

export const mainNav: NavItem[] = [
  { label: 'Дашборд', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Мои задачи', to: '/tasks', icon: ListTodo },
  { label: 'Проекты', to: '/projects', icon: FolderKanban },
  { label: 'Команда', to: '/team', icon: Users },
  { label: 'База знаний', to: '/knowledge-base', icon: BookOpen },
]

export const aiNav: NavItem[] = [
  { label: 'AI-ассистент', to: '/ai', icon: Sparkles },
  { label: 'Генератор задач', to: '/ai', icon: WandSparkles, hash: '#generator' },
]

export const systemNav: NavItem[] = [
  { label: 'Интеграция с Telegram', to: '/integrations', icon: Send },
  { label: 'Настройки', to: '/settings', icon: Settings },
]

export function isNavActive(item: NavItem, pathname: string, hash: string) {
  if (item.hash) return pathname === item.to && hash === item.hash
  if (item.to === '/ai') return pathname === '/ai' && hash !== '#generator'
  return pathname === item.to
}

export function sectionMeta(pathname: string, hash: string) {
  if (pathname === '/ai' && hash === '#generator') {
    return { title: 'Генератор задач', crumb: 'AI' }
  }
  const map: Record<string, { title: string; crumb: string }> = {
    '/dashboard': { title: 'Дашборд', crumb: 'Обзор' },
    '/tasks': { title: 'Мои задачи', crumb: 'Задачи' },
    '/projects': { title: 'Проекты', crumb: 'Проекты' },
    '/team': { title: 'Команда', crumb: 'Команда' },
    '/knowledge-base': { title: 'База знаний', crumb: 'Знания' },
    '/ai': { title: 'AI-ассистент', crumb: 'AI' },
    '/integrations': { title: 'Интеграция с Telegram', crumb: 'Интеграции' },
    '/settings': { title: 'Настройки', crumb: 'Настройки' },
  }
  return map[pathname] ?? { title: 'AivibeBoard', crumb: 'Пространство' }
}
