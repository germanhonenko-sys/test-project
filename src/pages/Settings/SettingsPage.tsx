import { useState } from 'react'
import { Avatar } from '../../components/ui/Avatar.tsx'
import { Card } from '../../components/ui/Card.tsx'
import { Switch } from '../../components/ui/Switch.tsx'
import { PageHeader, PageShell } from '../../components/layout/PageHeader.tsx'
import { useWorkspaceData } from '../../hooks/useWorkspaceData.ts'
import { useI18n } from '../../i18n/useI18n.ts'
import type { MessageKey } from '../../i18n/translate.ts'
import { useAppStore } from '../../store/useAppStore.ts'
import type { Preferences } from '../../types/index.ts'

const preferenceRows: Array<{ key: keyof Preferences; label: MessageKey; description: MessageKey }> = [
  {
    key: 'compactLists',
    label: 'settings.compact',
    description: 'settings.compactHint',
  },
  {
    key: 'emailDigest',
    label: 'settings.digest',
    description: 'settings.digestHint',
  },
  {
    key: 'desktopAlerts',
    label: 'settings.desktop',
    description: 'settings.desktopHint',
  },
]

export function SettingsPage() {
  const { currentUser, workspace } = useWorkspaceData()
  const preferences = useAppStore((state) => state.preferences)
  const setPreference = useAppStore((state) => state.setPreference)
  const [themeNoted, setThemeNoted] = useState(false)
  const { t, text } = useI18n()

  return (
    <PageShell>
      <PageHeader
        eyebrow={text(workspace.name)}
        title={t('nav.settings')}
        description={t('page.settingsDescription')}
      />
      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center gap-3">
            <Avatar user={currentUser} />
            <div>
              <p className="text-sm font-semibold text-zinc-900">{text(currentUser.name)}</p>
              <p className="text-xs text-zinc-500">{text(currentUser.role)}</p>
            </div>
          </div>
          <dl className="mt-5 space-y-3 text-sm">
            <div>
              <dt className="text-xs text-zinc-400">{t('settings.email')}</dt>
              <dd className="text-zinc-800">{currentUser.email}</dd>
            </div>
            <div>
              <dt className="text-xs text-zinc-400">{t('settings.workspace')}</dt>
              <dd className="text-zinc-800">
                {text(workspace.name)} · {text(workspace.plan)}
              </dd>
            </div>
          </dl>
        </Card>
        <Card className="divide-y divide-zinc-100 lg:col-span-3">
          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <div>
              <p className="text-sm font-medium text-zinc-900">{t('settings.appearance')}</p>
              <p className="text-xs text-zinc-500">{t('settings.appearanceNow')}</p>
              {themeNoted ? <p className="mt-1 text-xs text-indigo-700">{t('settings.themeNote')}</p> : null}
            </div>
            <button
              type="button"
              onClick={() => setThemeNoted(true)}
              className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
            >
              {t('settings.light')}
            </button>
          </div>
          {preferenceRows.map((row) => {
            const enabled = preferences[row.key]
            return (
              <div key={row.key} className="flex items-center justify-between gap-4 px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-zinc-900">{t(row.label)}</p>
                  <p className="text-xs text-zinc-500">
                    {t(row.description)} {t(enabled ? 'settings.on' : 'settings.off')}
                  </p>
                </div>
                <Switch
                  checked={enabled}
                  label={t(row.label)}
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
