import type { LeaderboardEntry } from '@/lib/types'
import { PlayerRow } from './player-row'

export function LeaderboardTable({ entries }: { entries: LeaderboardEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="px-4 py-16 text-center text-muted">
        No hay resultados todavia.
      </div>
    )
  }

  return (
    <div className="animate-stagger px-4">
      {entries.map((entry, i) => (
        <PlayerRow key={entry.player_id} entry={entry} rank={i + 1} />
      ))}
    </div>
  )
}
