import type { LeaderboardEntry } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

const positionStyles: Record<number, { badge: 'gold' | 'silver' | 'bronze'; border: string }> = {
  1: { badge: 'gold', border: 'border-gold/40' },
  2: { badge: 'silver', border: 'border-gray-500/40' },
  3: { badge: 'bronze', border: 'border-amber-700/40' },
}

export function PlayerRow({
  entry,
  rank,
}: {
  entry: LeaderboardEntry
  rank: number
}) {
  const style = positionStyles[rank]
  const isTop3 = rank <= 3

  return (
    <div
      className={cn(
        'mb-2 flex items-center gap-3 rounded-xl border bg-card px-4 py-3 transition-colors',
        style?.border || 'border-border'
      )}
    >
      {/* Rank */}
      <div className="flex w-8 shrink-0 items-center justify-center">
        {isTop3 ? (
          <Badge variant={style.badge} className="text-sm font-bold">
            {rank}
          </Badge>
        ) : (
          <span className="text-sm font-medium text-muted">{rank}</span>
        )}
      </div>

      {/* Player info */}
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="text-lg">{entry.emoji}</span>
        <div className="min-w-0 flex-1">
          <p className={cn('truncate text-sm font-semibold', isTop3 && 'text-gold-light')}>
            {entry.name}
          </p>
          <p className="text-xs text-muted">
            {entry.games_played}p &middot; {entry.wins}W &middot; avg {entry.avg_position}
          </p>
        </div>
      </div>

      {/* Points */}
      <div className="text-right">
        <p className={cn('text-lg font-bold tabular-nums', isTop3 ? 'text-gold' : 'text-foreground')}>
          {entry.total_points}
        </p>
        <p className="text-xs text-muted">pts</p>
      </div>
    </div>
  )
}
