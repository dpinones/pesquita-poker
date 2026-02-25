import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Trophy } from 'lucide-react'

type ResultRow = {
  position: number
  points: number
  player: { name: string; emoji: string }
}

const positionBadge: Record<number, 'gold' | 'silver' | 'bronze'> = {
  1: 'gold',
  2: 'silver',
  3: 'bronze',
}

export function GameResults({
  gameNumber,
  results,
}: {
  gameNumber: number
  results: ResultRow[]
}) {
  const sorted = [...results].sort((a, b) => a.position - b.position)

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Trophy size={14} className="text-gold" />
        <h3 className="text-sm font-semibold">Partida {gameNumber}</h3>
      </div>
      <div className="divide-y divide-border">
        {sorted.map((r) => (
          <div
            key={r.position}
            className="flex items-center gap-3 px-4 py-2"
          >
            <div className="w-8 text-center">
              {positionBadge[r.position] ? (
                <Badge variant={positionBadge[r.position]} className="text-xs font-bold">
                  {r.position}
                </Badge>
              ) : (
                <span className="text-xs text-muted">{r.position}</span>
              )}
            </div>
            <span className="text-base">{r.player.emoji}</span>
            <span className={cn('flex-1 text-sm', r.position <= 3 && 'font-medium')}>
              {r.player.name}
            </span>
            <span className="text-sm font-medium tabular-nums text-muted">
              +{r.points}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
