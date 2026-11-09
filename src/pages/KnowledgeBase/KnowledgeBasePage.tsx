import { PageHeader, PageShell } from '../../components/layout/PageHeader.tsx'
import { KnowledgeBrowser } from '../../features/knowledge-base/KnowledgeBrowser.tsx'
import { useWorkspaceData } from '../../hooks/useWorkspaceData.ts'
import { useI18n } from '../../i18n/useI18n.ts'

export function KnowledgeBasePage() {
  const { workspace } = useWorkspaceData()
  const { t, text } = useI18n()

  return (
    <PageShell>
      <PageHeader
        eyebrow={text(workspace.name)}
        title={t('nav.knowledge')}
        description={t('page.knowledgeDescription')}
      />
      <KnowledgeBrowser />
    </PageShell>
  )
}
