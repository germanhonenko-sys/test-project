import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { PageHeader, PageShell } from '../../components/layout/PageHeader.tsx'
import { AiComposer } from '../../features/ai-assistant/AiComposer.tsx'
import { AiAssistantPanel, AiHistory } from '../../features/ai-assistant/AiPanels.tsx'
import { useWorkspaceData } from '../../hooks/useWorkspaceData.ts'

export function AIPage() {
  const { hash, pathname } = useLocation()
  const { workspace } = useWorkspaceData()

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
        eyebrow={workspace.name}
        title="AI-ассистент"
        description="Черновая идея превращается в набор задач. Результат остаётся в этой демо-сессии."
      />
      <div className="grid items-start gap-6 lg:grid-cols-5">
        <div className="flex flex-col gap-6 lg:col-span-3">
          <AiAssistantPanel />
          <AiComposer
            id="generator"
            title="Пусть AI разложит работу"
            description="Сложные идеи превращаются в структурированные задачи, с ответственными и следующим шагом."
            placeholder="Опишите, что нужно сделать..."
            actionLabel="Сгенерировать задачи"
          />
        </div>
        <div className="lg:col-span-2">
          <AiHistory />
        </div>
      </div>
    </PageShell>
  )
}
