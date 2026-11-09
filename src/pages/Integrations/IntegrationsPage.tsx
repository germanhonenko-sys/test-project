import { PageHeader, PageShell } from '../../components/layout/PageHeader.tsx'
import { TelegramCard } from '../../features/telegram/TelegramCard.tsx'
import { useWorkspaceData } from '../../hooks/useWorkspaceData.ts'
import { useI18n } from '../../i18n/useI18n.ts'

export function IntegrationsPage() {
  const { workspace } = useWorkspaceData()
  const { t, text } = useI18n()

  return (
    <PageShell>
      <PageHeader
        eyebrow={text(workspace.name)}
        title={t('nav.telegram')}
        description={t('page.integrationsDescription')}
      />
      <TelegramCard />
    </PageShell>
  )
}
