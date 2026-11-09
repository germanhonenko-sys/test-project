import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useMediaQuery } from '../../hooks/useMediaQuery.ts'
import { useI18n } from '../../i18n/useI18n.ts'
import { useAppStore } from '../../store/useAppStore.ts'
import { CreateTaskModal } from '../../features/tasks/CreateTaskModal.tsx'
import { Header } from './Header.tsx'
import { sectionMeta } from './navigation.ts'
import { Sidebar } from './Sidebar.tsx'

export function AppLayout() {
  const location = useLocation()
  const desktop = useMediaQuery('(min-width: 1024px)')
  const sidebarOpen = useAppStore((state) => state.sidebarOpen)
  const setSidebarOpen = useAppStore((state) => state.setSidebarOpen)
  const meta = sectionMeta(location.pathname, location.hash)
  const { t } = useI18n()
  const title = t(meta.titleKey)

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname, location.hash, setSidebarOpen])

  useEffect(() => {
    document.title = `${title} · AivibeBoard`
  }, [title])

  return (
    <div className="flex h-svh overflow-hidden bg-zinc-100 text-zinc-900">
      {!desktop && sidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-zinc-900/30"
          aria-label={t('header.closeMenu')}
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main id="app-main" className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
      <CreateTaskModal />
    </div>
  )
}
