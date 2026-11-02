import type { User } from '../../types/index.ts'
import { cn } from '../../utils/cn.ts'

const sizes = {
  sm: 'h-6 w-6 text-[10px]',
  md: 'h-8 w-8 text-xs',
}

export function Avatar({ user, size = 'md' }: { user: User; size?: 'sm' | 'md' }) {
  return (
    <span
      title={user.name}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-medium text-white ring-2 ring-white',
        user.color,
        sizes[size],
      )}
    >
      {user.initials}
    </span>
  )
}

export function AvatarGroup({ users, max = 4 }: { users: User[]; max?: number }) {
  const shown = users.slice(0, max)
  const extra = users.length - shown.length
  if (shown.length === 0) return null

  return (
    <div className="flex -space-x-2">
      {shown.map((user) => (
        <Avatar key={user.id} user={user} size="sm" />
      ))}
      {extra > 0 ? (
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 text-[10px] font-medium text-zinc-600 ring-2 ring-white">
          +{extra}
        </span>
      ) : null}
    </div>
  )
}
