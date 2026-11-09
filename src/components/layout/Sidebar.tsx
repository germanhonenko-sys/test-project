import { Sparkles } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useMediaQuery } from '../../hooks/useMediaQuery.ts'
import { useWorkspaceData } from '../../hooks/useWorkspaceData.ts'
import { useI18n } from '../../i18n/useI18n.ts'
import { useAppStore } from '../../store/useAppStore.ts'
import { cn } from '../../utils/cn.ts'
import { SidebarAccount } from './SidebarAccount.tsx'
import { WorkspaceMenu } from './WorkspaceMenu.tsx'
import { aiNav, isNavActive, mainNav, systemNav, type NavItem } from './navigation.ts'

function NavLinks({ items, onNavigate }: { items: NavItem[]; onNavigate: () => void }) {
  const { pathname, hash } = useLocation()
  const { t } = useI18n()
  return (
    <div className="space-y-0.5">
      {items.map((item) => {
        const active = isNavActive(item, pathname, hash)
        const Icon = item.icon
        return (
          <Link
            key={item.labelKey}
            to={item.hash ? `${item.to}${item.hash}` : item.to}
            aria-current={active ? 'page' : undefined}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm',
              active
                ? 'bg-indigo-50 font-medium text-indigo-700'
                : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900',
            )}
          >
            <Icon className="h-4 w-4" />
            {t(item.labelKey)}
          </Link>
        )
      })}
    </div>
  )
}

export function Sidebar() {
  const desktop = useMediaQuery('(min-width: 1024px)')
  const sidebarOpen = useAppStore((state) => state.sidebarOpen)
  const setSidebarOpen = useAppStore((state) => state.setSidebarOpen)
  const { workspace, currentUser } = useWorkspaceData()
  const hidden = !desktop && !sidebarOpen
  const close = () => setSidebarOpen(false)

  return (
    <aside
      aria-hidden={hidden}
      inert={hidden}
      className={cn(
        'fixed inset-y-0 left-0 z-40 flex h-full w-[250px] shrink-0 flex-col border-r border-zinc-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0',
        desktop || sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      )}
    >
      <div className="border-b border-zinc-200 px-3 py-4">
        <Link to="/dashboard" className="flex items-center gap-2.5 rounded-lg px-1">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold text-zinc-900">AivibeBoard</span>
        </Link>
        <WorkspaceMenu workspace={workspace} />
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-3">
        <NavLinks items={mainNav} onNavigate={close} />
        <div>
          <p className="px-2.5 pb-1 text-[11px] font-medium tracking-wide text-zinc-400 uppercase">AI</p>
          <NavLinks items={aiNav} onNavigate={close} />
        </div>
        <div className="border-t border-zinc-200 pt-3">
          <NavLinks items={systemNav} onNavigate={close} />
        </div>
      </nav>

      <SidebarAccount currentUser={currentUser} onNavigate={close} />
    </aside>
  )
}
