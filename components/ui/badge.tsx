import { cn } from '@/lib/utils'

const variants: Record<string, string> = {
  gold: 'bg-gold/15 text-gold-light border-gold/30',
  silver: 'bg-gray-400/15 text-gray-300 border-gray-500/30',
  bronze: 'bg-amber-700/15 text-amber-500 border-amber-700/30',
  default: 'bg-felt-lighter/50 text-muted border-border',
}

export function Badge({
  children,
  variant = 'default',
  className,
}: {
  children: React.ReactNode
  variant?: keyof typeof variants
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
