import { useI18n } from '../../i18n/useI18n.ts'
import type { Localized } from '../../types/index.ts'
import { cn } from '../../utils/cn.ts'

export function SubtaskList({ items, plain = false }: { items: Localized[]; plain?: boolean }) {
  const { text } = useI18n()
  return (
    <ol className="space-y-2">
      {items.map((item, index) => (
        <li
          key={`${index}-${text(item)}`}
          className={cn('flex gap-2.5 text-sm text-zinc-700', !plain && 'rounded-lg bg-white px-3 py-2')}
        >
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[11px] font-semibold text-violet-700">
            {index + 1}
          </span>
          <span>{text(item)}</span>
        </li>
      ))}
    </ol>
  )
}
