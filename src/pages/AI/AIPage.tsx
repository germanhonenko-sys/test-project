import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { PageHeader, PageShell } from '../../components/layout/PageHeader.tsx'
import { AiComposer } from '../../features/ai-assistant/AiComposer.tsx'
import { AiAssistantPanel, AiHistory } from '../../features/ai-assistant/AiPanels.tsx'
import { useWorkspaceData } from '../../hooks/useWorkspaceData.ts'
import { useI18n } from '../../i18n/useI18n.ts'

export function AIPage() {
  const { hash, pathname } = useLocation()
  const { workspace } = useWorkspaceData()
  const { t, text } = useI18n()

  useEffect(() => {
    const main = document.getElementById('app-main')
    if (hash === '#generator') {
      document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    main?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [hash, pathname])

  return (
    <PageShell>
      <PageHeader
        eyebrow={text(workspace.name)}
        title={t('nav.assistant')}
        description={t('page.aiDescription')}
      />
      <div className="grid items-start gap-6 lg:grid-cols-5">
        <div className="flex flex-col gap-6 lg:col-span-3">
          <AiAssistantPanel />
          <AiComposer
            id="generator"
            title={t('ai.composerTitle')}
            description={t('ai.composerDescription')}
            placeholder={t('ai.composerPlaceholder')}
            actionLabel={t('ai.composerAction')}
          />
        </div>
        <div className="lg:col-span-2">
          <AiHistory />
        </div>
      </div>
    </PageShell>
  )
}
