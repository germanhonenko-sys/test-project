import { Send } from 'lucide-react'
import { Badge } from '../../components/ui/Badge.tsx'
import { Button } from '../../components/ui/Button.tsx'
import { Card } from '../../components/ui/Card.tsx'
import { useWorkspaceData } from '../../hooks/useWorkspaceData.ts'
import { useI18n } from '../../i18n/useI18n.ts'
import type { MessageKey } from '../../i18n/translate.ts'
import { useAppStore } from '../../store/useAppStore.ts'

const capabilities: Array<{ title: MessageKey; body: MessageKey }> = [
  { title: 'telegram.cap1Title', body: 'telegram.cap1Body' },
  { title: 'telegram.cap2Title', body: 'telegram.cap2Body' },
  { title: 'telegram.cap3Title', body: 'telegram.cap3Body' },
  { title: 'telegram.cap4Title', body: 'telegram.cap4Body' },
]

export function TelegramCard() {
  const { workspace } = useWorkspaceData()
  const connected = useAppStore((state) => state.telegramByWorkspace[workspace.id] ?? false)
  const toggleTelegram = useAppStore((state) => state.toggleTelegram)
  const { t, text } = useI18n()

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <Card className="p-5 lg:col-span-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
              <Send className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-zinc-900">{t('telegram.bot')}</h2>
              <p className="text-xs text-zinc-500">{text(workspace.name)}</p>
            </div>
          </div>
          <Badge className={connected ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-600'}>
            {connected ? t('telegram.connected') : t('telegram.disconnected')}
          </Badge>
        </div>
        <p className="mt-4 text-sm text-zinc-600">{t('telegram.body')}</p>
        <Button className="mt-5" variant={connected ? 'secondary' : 'primary'} onClick={() => toggleTelegram(workspace.id)}>
          {connected ? t('telegram.disconnect') : t('telegram.connect')}
        </Button>
      </Card>
      <div className="grid gap-3 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-1">
        {capabilities.map((item) => (
          <Card key={item.title} className="p-4">
            <h3 className="text-sm font-medium text-zinc-900">{t(item.title)}</h3>
            <p className="mt-1 text-sm text-zinc-500">{t(item.body)}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
