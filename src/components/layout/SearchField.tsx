import { Search } from 'lucide-react'
import { useMemo, useState, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnOutside } from '../../hooks/useOnOutside.ts'
import { useWorkspaceData } from '../../hooks/useWorkspaceData.ts'
import { useI18n } from '../../i18n/useI18n.ts'
import { cn } from '../../utils/cn.ts'
import { searchWorkspace } from '../../utils/search.ts'

export function SearchField({ className }: { className?: string }) {
  const navigate = useNavigate()
  const { projects, tasks, users } = useWorkspaceData()
  const { locale, t, text } = useI18n()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useOnOutside<HTMLDivElement>(open, () => setOpen(false))
  const trimmed = query.trim().toLowerCase()
  const projectLabel = t('header.project')
  const noAssigneeLabel = t('header.noAssignee')

  const results = useMemo(
    () =>
      searchWorkspace({
        query: trimmed,
        projects,
        tasks,
        users,
        locale,
        text,
        projectLabel,
        noAssigneeLabel,
      }),
    [trimmed, projects, tasks, users, locale, text, projectLabel, noAssigneeLabel],
  )

  function choose(to: string) {
    setQuery('')
    setOpen(false)
    void navigate(to)
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const first = results[0]
    if (event.key === 'Enter' && first) {
      event.preventDefault()
      choose(first.to)
    }
  }

  const visible = open && trimmed.length > 0

  return (
    <div ref={ref} className={cn('relative', className)}>
      <Search className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-zinc-400" />
      <input
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        role="searchbox"
        aria-label={t('header.searchLabel')}
        placeholder={t('header.searchPlaceholder')}
        className="h-9 w-full rounded-lg border border-zinc-200 bg-zinc-50 pr-3 pl-8 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
      />
      {visible ? (
        <div className="absolute right-0 left-0 z-30 mt-1 max-h-80 overflow-y-auto rounded-lg border border-zinc-200 bg-white p-1 shadow-lg">
          {results.length === 0 ? (
            <p className="px-3 py-2 text-sm text-zinc-500">{t('header.noResults')}</p>
          ) : (
            results.map((result) => (
              <button
                key={`${result.kind}-${result.id}`}
                type="button"
                onClick={() => choose(result.to)}
                className="flex w-full flex-col rounded-md px-2.5 py-2 text-left hover:bg-zinc-50"
              >
                <span className="text-sm font-medium text-zinc-900">{result.title}</span>
                <span className="text-xs text-zinc-500">
                  {result.kind === 'project' ? t('header.project') : t('header.task')} · {result.detail}
                </span>
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  )
}
