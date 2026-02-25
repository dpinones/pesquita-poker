import Link from 'next/link'
import { CalendarDays, Gamepad2, ChevronRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export function SessionCard({
  session,
  gameCount,
  playerCount,
}: {
  session: { id: string; date: string; notes: string | null }
  gameCount: number
  playerCount: number
}) {
  return (
    <Link
      href={`/fechas/${session.id}`}
      className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-gold/20 hover:bg-card-hover"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-felt-lighter text-gold">
        <CalendarDays size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold capitalize">{formatDate(session.date)}</p>
        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="flex items-center gap-1">
            <Gamepad2 size={12} />
            {gameCount} {gameCount === 1 ? 'partida' : 'partidas'}
          </span>
          <span>{playerCount} jugadores</span>
        </div>
        {session.notes && (
          <p className="mt-1 truncate text-xs text-muted italic">{session.notes}</p>
        )}
      </div>
      <ChevronRight size={16} className="text-muted" />
    </Link>
  )
}
