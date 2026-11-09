import {
  BookOpen,
  FolderKanban,
  Kanban,
  LayoutDashboard,
  Send,
  Settings,
  Sparkles,
  Users,
  WandSparkles,
  type LucideIcon,
} from 'lucide-react'
import type { MessageKey } from '../../i18n/translate.ts'

export interface NavItem {
  labelKey: MessageKey
  to: string
  icon: LucideIcon
  hash?: string
}

export const mainNav: NavItem[] = [
  { labelKey: 'nav.dashboard', to: '/dashboard', icon: LayoutDashboard },
  { labelKey: 'nav.boards', to: '/boards', icon: Kanban },
  { labelKey: 'nav.projects', to: '/projects', icon: FolderKanban },
  { labelKey: 'nav.team', to: '/team', icon: Users },
  { labelKey: 'nav.knowledge', to: '/knowledge-base', icon: BookOpen },
]

export const aiNav: NavItem[] = [
  { labelKey: 'nav.assistant', to: '/ai', icon: Sparkles },
  { labelKey: 'nav.generator', to: '/ai', icon: WandSparkles, hash: '#generator' },
]

export const systemNav: NavItem[] = [
  { labelKey: 'nav.telegram', to: '/integrations', icon: Send },
  { labelKey: 'nav.settings', to: '/settings', icon: Settings },
]

export function isNavActive(item: NavItem, pathname: string, hash: string) {
  if (item.hash) return pathname === item.to && hash === item.hash
  if (item.to === '/ai') return pathname === '/ai' && hash !== '#generator'
  return pathname === item.to
}

export function sectionMeta(pathname: string, hash: string) {
  if (pathname === '/ai' && hash === '#generator') {
    return { titleKey: 'nav.generator' as const, crumbKey: 'crumb.ai' as const }
  }
  const map: Record<string, { titleKey: MessageKey; crumbKey: MessageKey }> = {
    '/dashboard': { titleKey: 'nav.dashboard', crumbKey: 'crumb.overview' },
    '/boards': { titleKey: 'nav.boards', crumbKey: 'crumb.boards' },
    '/projects': { titleKey: 'nav.projects', crumbKey: 'crumb.projects' },
    '/team': { titleKey: 'nav.team', crumbKey: 'crumb.team' },
    '/knowledge-base': { titleKey: 'nav.knowledge', crumbKey: 'crumb.knowledge' },
    '/ai': { titleKey: 'nav.assistant', crumbKey: 'crumb.ai' },
    '/integrations': { titleKey: 'nav.telegram', crumbKey: 'crumb.integrations' },
    '/settings': { titleKey: 'nav.settings', crumbKey: 'crumb.settings' },
  }
  return map[pathname] ?? { titleKey: 'appName' as const, crumbKey: 'crumb.space' as const }
}
