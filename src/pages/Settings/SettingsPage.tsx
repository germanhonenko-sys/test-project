import { useState } from 'react'
import { Avatar } from '../../components/ui/Avatar.tsx'
import { Card } from '../../components/ui/Card.tsx'
import { Switch } from '../../components/ui/Switch.tsx'
import { PageHeader, PageShell } from '../../components/layout/PageHeader.tsx'
import { useWorkspaceData } from '../../hooks/useWorkspaceData.ts'
import { useAppStore } from '../../store/useAppStore.ts'
import type { Preferences } from '../../types/index.ts'

const preferenceRows: Array<{ key: keyof Preferences; label: string; description: string }> = [
  {
    key: 'compactLists',
    label: 'Компактные списки',
    description: 'Плотнее строки в разделе «Мои задачи».',
  },
  {
    key: 'emailDigest',
    label: 'Дайджест на почту',
    description: 'Утренняя сводка задач, которые ждут вас. Только демо.',
  },
  {
    key: 'desktopAlerts',
    label: 'Уведомления на рабочем столе',
    description: 'Браузерные уведомления об упоминаниях. Только демо.',
  },
]

export function SettingsPage() {
  const { currentUser, workspace } = useWorkspaceData()
  const preferences = useAppStore((state) => state.preferences)
  const setPreference = useAppStore((state) => state.setPreference)
  const [themeNote, setThemeNote] = useState<string | null>(null)

  return (
    <PageShell>
      <PageHeader
        eyebrow={workspace.name}
        title="Настройки"
        description="Профиль и демо-настройки этой сессии браузера."
      />
      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center gap-3">
            <Avatar user={currentUser} />
            <div>
              <p className="text-sm font-semibold text-zinc-900">{currentUser.name}</p>
              <p className="text-xs text-zinc-500">{currentUser.role}</p>
            </div>
          </div>
          <dl className="mt-5 space-y-3 text-sm">
            <div>
              <dt className="text-xs text-zinc-400">Почта</dt>
              <dd className="text-zinc-800">{currentUser.email}</dd>
            </div>
            <div>
              <dt className="text-xs text-zinc-400">Пространство</dt>
              <dd className="text-zinc-800">
                {workspace.name} · {workspace.plan}
              </dd>
            </div>
          </dl>
        </Card>
        <Card className="divide-y divide-zinc-100 lg:col-span-3">
          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <div>
              <p className="text-sm font-medium text-zinc-900">Оформление</p>
              <p className="text-xs text-zinc-500">Сейчас: светлая тема</p>
              {themeNote ? <p className="mt-1 text-xs text-indigo-700">{themeNote}</p> : null}
            </div>
            <button
              type="button"
              onClick={() => setThemeNote('В этом прототипе включена светлая тема.')}
              className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Светлая
            </button>
          </div>
          {preferenceRows.map((row) => {
            const enabled = preferences[row.key]
            return (
              <div key={row.key} className="flex items-center justify-between gap-4 px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-zinc-900">{row.label}</p>
                  <p className="text-xs text-zinc-500">
                    {row.description} Сейчас {enabled ? 'включено' : 'выключено'}.
                  </p>
                </div>
                <Switch
                  checked={enabled}
                  label={row.label}
                  onChange={(next) => setPreference(row.key, next)}
                />
              </div>
            )
          })}
        </Card>
      </div>
    </PageShell>
  )
}
