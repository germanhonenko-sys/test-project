import { Check, ChevronsUpDown, LogOut, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Avatar } from '../ui/Avatar.tsx'
import { useMediaQuery } from '../../hooks/useMediaQuery.ts'
import { useOnOutside } from '../../hooks/useOnOutside.ts'
import { useWorkspaceData } from '../../hooks/useWorkspaceData.ts'
import { useAuthStore } from '../../store/useAuthStore.ts'
import { useAppStore } from '../../store/useAppStore.ts'
import { cn } from '../../utils/cn.ts'
import { useI18n } from '../../i18n/useI18n.ts'
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
  const workspaces = useAppStore((state) => state.workspaces)
  const setActiveWorkspace = useAppStore((state) => state.setActiveWorkspace)
  const logout = useAuthStore((state) => state.logout)
  const { workspace, currentUser } = useWorkspaceData()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useOnOutside<HTMLDivElement>(menuOpen, () => setMenuOpen(false))
  const hidden = !desktop && !sidebarOpen
  const { t, text } = useI18n()
  const workspaceName = text(workspace.name)
  const workspacePlan = text(workspace.plan)

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
        <div ref={menuRef} className="relative mt-3">
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-haspopup="listbox"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex w-full items-center gap-2 rounded-lg border border-zinc-200 px-2.5 py-2 text-left hover:bg-zinc-50"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-100 text-xs font-semibold text-zinc-700">
              {workspaceName.slice(0, 1)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-zinc-900">{workspaceName}</span>
              <span className="block text-xs text-zinc-500">{workspacePlan}</span>
            </span>
            <ChevronsUpDown className="h-4 w-4 shrink-0 text-zinc-400" />
          </button>
          {menuOpen ? (
            <div
              role="listbox"
              aria-label={t('sidebar.workspace')}
              className="absolute right-0 left-0 z-20 mt-1 rounded-lg border border-zinc-200 bg-white p-1 shadow-lg"
            >
              {workspaces.map((item) => {
                const selected = item.id === workspace.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      setActiveWorkspace(item.id)
                      setMenuOpen(false)
                    }}
                    className={cn(
                      'flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm',
                      selected ? 'bg-indigo-50 text-indigo-700' : 'text-zinc-700 hover:bg-zinc-50',
                    )}
                  >
                    <span>
                      <span className="block font-medium">{text(item.name)}</span>
                      <span className="block text-xs text-zinc-500">{text(item.plan)}</span>
                    </span>
                    {selected ? <Check className="h-4 w-4" /> : null}
                  </button>
                )
              })}
            </div>
          ) : null}
        </div>
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-3">
        <NavLinks items={mainNav} onNavigate={() => setSidebarOpen(false)} />
        <div>
          <p className="px-2.5 pb-1 text-[11px] font-medium tracking-wide text-zinc-400 uppercase">AI</p>
          <NavLinks items={aiNav} onNavigate={() => setSidebarOpen(false)} />
        </div>
        <div className="border-t border-zinc-200 pt-3">
          <NavLinks items={systemNav} onNavigate={() => setSidebarOpen(false)} />
        </div>
      </nav>

      <div className="border-t border-zinc-200 p-3">
        <div className="flex items-center gap-2.5 px-1">
          <Avatar user={currentUser} />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-zinc-900">{text(currentUser.name)}</p>
            <p className="truncate text-xs text-zinc-500">{text(currentUser.role)}</p>
          </div>
        </div>
        <Link
          to="/settings"
          onClick={() => setSidebarOpen(false)}
          className="mt-3 flex h-8 items-center justify-center rounded-lg border border-zinc-200 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
        >
          {t('sidebar.profile')}
        </Link>
        <button
          type="button"
          onClick={() => {
            setSidebarOpen(false)
            logout()
          }}
          className="mt-2 flex h-8 w-full items-center justify-center gap-1.5 rounded-lg text-xs font-medium text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"
        >
          <LogOut className="h-3.5 w-3.5" />
          {t('sidebar.logout')}
        </button>
      </div>
    </aside>
  )
}
