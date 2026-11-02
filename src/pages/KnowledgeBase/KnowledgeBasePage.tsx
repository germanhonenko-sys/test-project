import { PageHeader, PageShell } from '../../components/layout/PageHeader.tsx'
import { KnowledgeBrowser } from '../../features/knowledge-base/KnowledgeBrowser.tsx'
import { useWorkspaceData } from '../../hooks/useWorkspaceData.ts'

export function KnowledgeBasePage() {
  const { workspace } = useWorkspaceData()

  return (
    <PageShell>
      <PageHeader
        eyebrow={workspace.name}
        title="База знаний"
        description="Документы, которые команда ищет при планировании. Загрузки остаются в этой сессии."
      />
      <KnowledgeBrowser />
    </PageShell>
  )
}
