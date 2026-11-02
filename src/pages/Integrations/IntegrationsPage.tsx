import { PageHeader, PageShell } from '../../components/layout/PageHeader.tsx'
import { TelegramCard } from '../../features/telegram/TelegramCard.tsx'
import { useWorkspaceData } from '../../hooks/useWorkspaceData.ts'

export function IntegrationsPage() {
  const { workspace } = useWorkspaceData()

  return (
    <PageShell>
      <PageHeader
        eyebrow={workspace.name}
        title="Интеграция с Telegram"
        description="Подключите чат, чтобы создавать работу там, где команда уже общается."
      />
      <TelegramCard />
    </PageShell>
  )
}
