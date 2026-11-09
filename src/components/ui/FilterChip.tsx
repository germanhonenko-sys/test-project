import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../utils/cn.ts'

type Tone = 'dark' | 'indigo'

export function FilterChip({
  active,
  tone,
  hover = false,
  className,
  children,
  type = 'button',
  ...props
}: {
  active: boolean
  tone: Tone
  hover?: boolean
  children: ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={cn(
        'rounded-full px-3 py-1 text-xs font-medium',
        active
          ? tone === 'dark'
            ? 'bg-zinc-900 text-white'
            : 'bg-indigo-600 text-white'
          : cn('bg-white text-zinc-600 ring-1 ring-zinc-200', hover && 'hover:bg-zinc-50'),
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
