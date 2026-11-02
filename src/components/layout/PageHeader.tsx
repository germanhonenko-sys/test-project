import type { ReactNode } from 'react'

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        {eyebrow ? (
          <p className="text-xs font-medium tracking-wide text-zinc-400 uppercase">{eyebrow}</p>
        ) : null}
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-zinc-500">{description}</p>
      </div>
      {action}
    </div>
  )
}

export function PageShell({ children }: { children: ReactNode }) {
  return <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">{children}</div>
}
