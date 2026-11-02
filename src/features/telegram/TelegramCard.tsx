import { Send } from 'lucide-react'
import { Badge } from '../../components/ui/Badge.tsx'
import { Button } from '../../components/ui/Button.tsx'
import { Card } from '../../components/ui/Card.tsx'
import { useWorkspaceData } from '../../hooks/useWorkspaceData.ts'
import { useAppStore } from '../../store/useAppStore.ts'

const capabilities = [
  {
    title: 'Задачи из чата',
    body: 'Сообщение превращается в задачу, не выходя из Telegram.',
  },
  {
    title: 'Назначение исполнителей',
    body: 'Упомяните коллегу — задача появится в его списке.',
  },
  {
    title: 'Напоминания о сроках',
    body: 'Бот напомнит исполнителю, пока дата не сорвалась.',
  },
  {
    title: 'Синхронизация статусов',
    body: 'Обновления с доски можно отправить обратно в тот же чат.',
  },
]

export function TelegramCard() {
  const { workspace } = useWorkspaceData()
  const connected = useAppStore((state) => state.telegramByWorkspace[workspace.id] ?? false)
  const toggleTelegram = useAppStore((state) => state.toggleTelegram)

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <Card className="p-5 lg:col-span-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
              <Send className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-zinc-900">Бот AivibeBoard</h2>
              <p className="text-xs text-zinc-500">{workspace.name}</p>
            </div>
          </div>
          <Badge className={connected ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-600'}>
            {connected ? 'Подключено' : 'Не подключено'}
          </Badge>
        </div>
        <p className="mt-4 text-sm text-zinc-600">
          Создавайте задачи, назначайте работу и получайте напоминания о сроках из Telegram. Подключение
          остаётся в демо и не обращается к Telegram.
        </p>
        <Button className="mt-5" variant={connected ? 'secondary' : 'primary'} onClick={() => toggleTelegram(workspace.id)}>
          {connected ? 'Отключить' : 'Подключить Telegram'}
        </Button>
      </Card>
      <div className="grid gap-3 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-1">
        {capabilities.map((item) => (
          <Card key={item.title} className="p-4">
            <h3 className="text-sm font-medium text-zinc-900">{item.title}</h3>
            <p className="mt-1 text-sm text-zinc-500">{item.body}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
