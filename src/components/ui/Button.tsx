import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn.ts'

type Variant = 'primary' | 'secondary' | 'ghost' | 'ai' | 'danger'
type Size = 'sm' | 'md'

const variants: Record<Variant, string> = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
  secondary: 'border border-zinc-200 bg-white text-zinc-800 shadow-sm hover:bg-zinc-50',
  ghost: 'text-zinc-600 hover:bg-zinc-100',
  ai: 'bg-violet-600 text-white hover:bg-violet-700',
  danger: 'bg-rose-600 text-white hover:bg-rose-700',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-2.5 text-xs',
  md: 'h-9 px-3 text-sm',
}

function buttonClass(variant: Variant = 'primary', size: Size = 'md', className?: string) {
  return cn(
    'inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 disabled:pointer-events-none disabled:opacity-50',
    variants[variant],
    sizes[size],
    className,
  )
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

export function Button({ variant = 'primary', size = 'md', className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={buttonClass(variant, size, className)} {...props} />
}

interface ButtonLinkProps {
  to: string
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

export function ButtonLink({ to, variant = 'primary', size = 'md', className, children }: ButtonLinkProps) {
  return (
    <Link to={to} className={buttonClass(variant, size, className)}>
      {children}
    </Link>
  )
}
