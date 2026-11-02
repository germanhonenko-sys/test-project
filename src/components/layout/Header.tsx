import { Bell, Menu, Plus } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useOnOutside } from '../../hooks/useOnOutside.ts'
import { useWorkspaceData } from '../../hooks/useWorkspaceData.ts'
import { useAppStore } from '../../store/useAppStore.ts'
import { formatRelative } from '../../utils/format.ts'
import { Avatar } from '../ui/Avatar.tsx'
import { Button } from '../ui/Button.tsx'
import { sectionMeta } from './navigation.ts'
import { SearchField } from './SearchField.tsx'

export function Header() {
  const location = useLocation()
  const meta = sectionMeta(location.pathname, location.hash)
  const { workspace, currentUser } = useWorkspaceData()
  const openCreateTask = useAppStore((state) => state.openCreateTask)
  const setSidebarOpen = useAppStore((state) => state.setSidebarOpen)
  const notifications = useAppStore((state) => state.notifications)
  const markNotificationsRead = useAppStore((state) => state.markNotificationsRead)
  const [notesOpen, setNotesOpen] = useState(false)
  const notesRef = useOnOutside<HTMLDivElement>(notesOpen, () => setNotesOpen(false))
  const unread = notifications.filter((item) => !item.read).length

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 lg:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 lg:hidden"
            aria-label="Открыть меню"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </button>
          <div className="min-w-0">
            <p className="truncate text-xs text-zinc-500">
              {workspace.name}
              <span className="px-1.5 text-zinc-300">/</span>
              {meta.crumb}
            </p>
            <h1 className="truncate text-sm font-semibold text-zinc-900 sm:text-base">{meta.title}</h1>
          </div>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <SearchField className="min-w-0 flex-1 sm:w-64 sm:flex-none" />
          <Button onClick={openCreateTask} className="shrink-0">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Новая задача</span>
            <span className="sm:hidden">Новая</span>
          </Button>
          <div ref={notesRef} className="relative">
            <button
              type="button"
              aria-label="Уведомления"
              aria-expanded={notesOpen}
              onClick={() => {
                setNotesOpen((open) => !open)
                markNotificationsRead()
              }}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
            >
              <Bell className="h-4 w-4" />
              {unread > 0 ? (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-600" />
              ) : null}
            </button>
            {notesOpen ? (
              <div className="absolute right-0 z-30 mt-2 w-80 rounded-xl border border-zinc-200 bg-white p-2 shadow-lg">
                <p className="px-2 py-1.5 text-xs font-medium tracking-wide text-zinc-400 uppercase">
                  Уведомления
                </p>
                <ul>
                  {notifications.map((item) => (
                    <li key={item.id} className="rounded-lg px-2 py-2 hover:bg-zinc-50">
                      <p className="text-sm font-medium text-zinc-900">{item.title}</p>
                      <p className="mt-0.5 text-xs text-zinc-500">{item.body}</p>
                      <p className="mt-1 text-[11px] text-zinc-400">{formatRelative(item.timestamp)}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
          <Link to="/settings" aria-label="Открыть профиль" className="shrink-0 rounded-full">
            <Avatar user={currentUser} />
          </Link>
        </div>
      </div>
    </header>
  )
}
