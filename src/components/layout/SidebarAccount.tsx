import { LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useI18n } from '../../i18n/useI18n.ts'
import { useAuthStore } from '../../store/useAuthStore.ts'
import type { User } from '../../types/index.ts'
import { Avatar } from '../ui/Avatar.tsx'

export function SidebarAccount({
  currentUser,
  onNavigate,
}: {
  currentUser: User
  onNavigate: () => void
}) {
  const logout = useAuthStore((state) => state.logout)
  const { t, text } = useI18n()

  return (
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
        onClick={onNavigate}
        className="mt-3 flex h-8 items-center justify-center rounded-lg border border-zinc-200 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
      >
        {t('sidebar.profile')}
      </Link>
      <button
        type="button"
        onClick={() => {
          onNavigate()
          logout()
        }}
        className="mt-2 flex h-8 w-full items-center justify-center gap-1.5 rounded-lg text-xs font-medium text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"
      >
        <LogOut className="h-3.5 w-3.5" />
        {t('sidebar.logout')}
      </button>
    </div>
  )
}
