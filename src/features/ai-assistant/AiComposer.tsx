import { Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Button } from '../../components/ui/Button.tsx'
import { Input } from '../../components/ui/Input.tsx'
import { useI18n } from '../../i18n/useI18n.ts'
import { useAppStore } from '../../store/useAppStore.ts'
import type { AiHistoryItem } from '../../types/index.ts'
import { SubtaskList } from './SubtaskList.tsx'

interface AiComposerProps {
  id?: string
  title: string
  description: string
  placeholder: string
  actionLabel: string
}

export function AiComposer({ id, title, description, placeholder, actionLabel }: AiComposerProps) {
  const submitPrompt = useAppStore((state) => state.submitPrompt)
  const [draft, setDraft] = useState('')
  const [result, setResult] = useState<AiHistoryItem | null>(null)
  const { t } = useI18n()

  function generate() {
    setResult(submitPrompt(draft))
    setDraft('')
  }

  return (
    <section id={id} className="scroll-mt-6 rounded-xl border border-violet-200 bg-violet-50 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white">
          <Sparkles className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>
          <p className="mt-1 text-sm text-violet-950/70">{description}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') generate()
          }}
          placeholder={placeholder}
          aria-label={placeholder}
        />
        <Button variant="ai" onClick={generate} className="shrink-0">
          <Sparkles className="h-4 w-4" />
          {actionLabel}
        </Button>
      </div>
      {result ? (
        <motion.div
          key={result.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <p className="mb-2 text-xs font-medium tracking-wide text-violet-700 uppercase">{t('ai.suggested')}</p>
          <SubtaskList items={result.subtasks} />
        </motion.div>
      ) : null}
    </section>
  )
}
