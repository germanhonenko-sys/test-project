import { Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Button } from '../../components/ui/Button.tsx'
import { Card } from '../../components/ui/Card.tsx'
import { Textarea } from '../../components/ui/Input.tsx'
import { useWorkspaceData } from '../../hooks/useWorkspaceData.ts'
import { useAppStore } from '../../store/useAppStore.ts'
import { formatRelative, plural } from '../../utils/format.ts'
import { SubtaskList } from './SubtaskList.tsx'

export function AiAssistantPanel() {
  const submitPrompt = useAppStore((state) => state.submitPrompt)
  const { aiHistory } = useWorkspaceData()
  const [draft, setDraft] = useState('')
  const latest = aiHistory[0]

  function ask() {
    submitPrompt(draft)
    setDraft('')
  }

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
          <Sparkles className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-zinc-900">Спросить ассистента</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Опишите работу. Демо вернёт структурированный план — запрос никуда не отправляется.
          </p>
        </div>
      </div>
      <Textarea
        className="mt-4"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="Попросите AivibeBoard спланировать работу..."
        aria-label="Запрос к AI"
      />
      <div className="mt-3 flex justify-end">
        <Button variant="ai" onClick={ask}>
          <Sparkles className="h-4 w-4" />
          Спросить AI
        </Button>
      </div>
      <div className="mt-4 rounded-lg border border-dashed border-zinc-200 bg-zinc-50 p-3">
        <p className="mb-2 text-xs font-medium tracking-wide text-zinc-400 uppercase">Результат</p>
        {latest ? (
          <motion.div key={latest.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            <p className="mb-2 text-sm font-medium text-zinc-900">{latest.prompt}</p>
            <SubtaskList items={latest.subtasks} plain />
          </motion.div>
        ) : (
          <p className="text-sm text-zinc-500">Здесь появится разбивка на задачи.</p>
        )}
      </div>
    </Card>
  )
}

export function AiHistory() {
  const { aiHistory } = useWorkspaceData()
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <Card className="p-4">
      <h2 className="text-sm font-semibold text-zinc-900">История запросов</h2>
      <p className="mt-1 text-sm text-zinc-500">Планы этой сессии остаются здесь до обновления страницы.</p>
      {aiHistory.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-500">Сгенерированные планы появятся здесь.</p>
      ) : (
        <ul className="mt-3 space-y-1">
          {aiHistory.map((item) => {
            const open = openId === item.id
            return (
              <li key={item.id}>
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenId(open ? null : item.id)}
                  className="w-full rounded-lg px-2 py-2 text-left hover:bg-zinc-50"
                >
                  <span className="block text-sm font-medium text-zinc-900">{item.prompt}</span>
                  <span className="mt-0.5 block text-xs text-zinc-500">
                    {formatRelative(item.createdAt)} · {item.subtasks.length}{' '}
                    {plural(item.subtasks.length, 'задача', 'задачи', 'задач')}
                  </span>
                  {open ? (
                    <div className="mt-2">
                      <SubtaskList items={item.subtasks} plain />
                    </div>
                  ) : null}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}
