import { Bell } from 'lucide-react'
import { useState } from 'react'
import { useOnOutside } from '../../hooks/useOnOutside.ts'
import { useI18n } from '../../i18n/useI18n.ts'
import { useAppStore } from '../../store/useAppStore.ts'
import { formatRelative } from '../../utils/format.ts'

export function NotificationMenu() {
  const notifications = useAppStore((state) => state.notifications)
  const markNotificationsRead = useAppStore((state) => state.markNotificationsRead)
  const [notesOpen, setNotesOpen] = useState(false)
  const notesRef = useOnOutside<HTMLDivElement>(notesOpen, () => setNotesOpen(false))
  const unread = notifications.filter((item) => !item.read).length
  const { locale, t, text } = useI18n()

  return (
    <div ref={notesRef} className="relative">
      <button
        type="button"
        aria-label={t('header.notifications')}
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
            {t('header.notifications')}
          </p>
          <ul>
            {notifications.map((item) => (
              <li key={item.id} className="rounded-lg px-2 py-2 hover:bg-zinc-50">
                <p className="text-sm font-medium text-zinc-900">{text(item.title)}</p>
                <p className="mt-0.5 text-xs text-zinc-500">{text(item.body)}</p>
                <p className="mt-1 text-[11px] text-zinc-400">{formatRelative(item.timestamp, locale)}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
