import { Menu, Plus } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useWorkspaceData } from '../../hooks/useWorkspaceData.ts'
import { useI18n } from '../../i18n/useI18n.ts'
import { useAppStore } from '../../store/useAppStore.ts'
import { Avatar } from '../ui/Avatar.tsx'
import { Button } from '../ui/Button.tsx'
import { LanguageToggle } from './LanguageToggle.tsx'
import { NotificationMenu } from './NotificationMenu.tsx'
import { SearchField } from './SearchField.tsx'
import { sectionMeta } from './navigation.ts'

export function Header() {
  const location = useLocation()
  const meta = sectionMeta(location.pathname, location.hash)
  const { workspace, currentUser } = useWorkspaceData()
  const openCreateTask = useAppStore((state) => state.openCreateTask)
  const setSidebarOpen = useAppStore((state) => state.setSidebarOpen)
  const { t, text } = useI18n()

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 lg:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 lg:hidden"
            aria-label={t('header.openMenu')}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </button>
          <div className="min-w-0">
            <p className="truncate text-xs text-zinc-500">
              {text(workspace.name)}
              <span className="px-1.5 text-zinc-300">/</span>
              {t(meta.crumbKey)}
            </p>
            <h1 className="truncate text-sm font-semibold text-zinc-900 sm:text-base">{t(meta.titleKey)}</h1>
          </div>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <SearchField className="min-w-0 flex-1 sm:w-64 sm:flex-none" />
          <Button onClick={openCreateTask} className="shrink-0">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{t('header.newTask')}</span>
            <span className="sm:hidden">{t('header.newShort')}</span>
          </Button>
          <LanguageToggle />
          <NotificationMenu />
          <Link to="/settings" aria-label={t('header.openProfile')} className="shrink-0 rounded-full">
            <Avatar user={currentUser} />
          </Link>
        </div>
      </div>
    </header>
  )
}
