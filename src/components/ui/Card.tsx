import type { ReactNode } from 'react'
import { cn } from '../../utils/cn.ts'

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <section className={cn('rounded-xl border border-zinc-200 bg-white shadow-sm', className)}>
      {children}
    </section>
  )
}
