import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'
import { useOnOutside } from '../../hooks/useOnOutside.ts'
import { useI18n } from '../../i18n/useI18n.ts'
import { useAppStore } from '../../store/useAppStore.ts'
import type { Workspace } from '../../types/index.ts'
import { cn } from '../../utils/cn.ts'

export function WorkspaceMenu({ workspace }: { workspace: Workspace }) {
  const workspaces = useAppStore((state) => state.workspaces)
  const setActiveWorkspace = useAppStore((state) => state.setActiveWorkspace)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useOnOutside<HTMLDivElement>(menuOpen, () => setMenuOpen(false))
  const { t, text } = useI18n()
  const workspaceName = text(workspace.name)
  const workspacePlan = text(workspace.plan)

  return (
    <div ref={menuRef} className="relative mt-3">
      <button
        type="button"
        aria-expanded={menuOpen}
        aria-haspopup="listbox"
        onClick={() => setMenuOpen((open) => !open)}
        className="flex w-full items-center gap-2 rounded-lg border border-zinc-200 px-2.5 py-2 text-left hover:bg-zinc-50"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-100 text-xs font-semibold text-zinc-700">
          {workspaceName.slice(0, 1)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-zinc-900">{workspaceName}</span>
          <span className="block text-xs text-zinc-500">{workspacePlan}</span>
        </span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-zinc-400" />
      </button>
      {menuOpen ? (
        <div
          role="listbox"
          aria-label={t('sidebar.workspace')}
          className="absolute right-0 left-0 z-20 mt-1 rounded-lg border border-zinc-200 bg-white p-1 shadow-lg"
        >
          {workspaces.map((item) => {
            const selected = item.id === workspace.id
            return (
              <button
                key={item.id}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  setActiveWorkspace(item.id)
                  setMenuOpen(false)
                }}
                className={cn(
                  'flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm',
                  selected ? 'bg-indigo-50 text-indigo-700' : 'text-zinc-700 hover:bg-zinc-50',
                )}
              >
                <span>
                  <span className="block font-medium">{text(item.name)}</span>
                  <span className="block text-xs text-zinc-500">{text(item.plan)}</span>
                </span>
                {selected ? <Check className="h-4 w-4" /> : null}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
