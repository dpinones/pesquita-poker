import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/page-header'
import { PlayerManager } from '@/components/admin/player-manager'
import { SessionForm } from '@/components/admin/session-form'
import { LogoutButton } from '@/components/admin/logout-button'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { ChevronRight, Gamepad2 } from 'lucide-react'
import type { Player, Session, Game } from '@/lib/types'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const { data: rawPlayers } = await supabase
    .from('players')
    .select('*')
    .order('name')
  const players = (rawPlayers ?? []) as Player[]

  const { data: rawSessions } = await supabase
    .from('sessions')
    .select('*')
    .order('date', { ascending: false })
  const sessions = (rawSessions ?? []) as Session[]

  const sessionIds = sessions.map((s) => s.id)
  const { data: rawGames } = await supabase
    .from('games')
    .select('*')
    .in('session_id', sessionIds.length > 0 ? sessionIds : ['none'])
  const games = (rawGames ?? []) as Game[]

  const gameCountMap: Record<string, number> = {}
  for (const g of games) {
    gameCountMap[g.session_id] = (gameCountMap[g.session_id] ?? 0) + 1
  }

  return (
    <div>
      <div className="flex items-center justify-between px-4 pt-6 pb-2">
        <PageHeader title="Admin" subtitle="Panel de administracion" />
        <LogoutButton />
      </div>

      <section className="px-4 py-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">
          Jugadores
        </h2>
        <PlayerManager players={players} />
      </section>

      <section className="px-4 py-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">
          Nueva Fecha
        </h2>
        <SessionForm />
      </section>

      <section className="px-4 py-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">
          Fechas
        </h2>
        <div className="space-y-2">
          {sessions.map((session) => (
            <Link
              key={session.id}
              href={`/admin/sessions/${session.id}`}
              className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-gold/20"
            >
              <div className="flex-1">
                <p className="text-sm font-semibold capitalize">
                  {formatDate(session.date)}
                </p>
                <p className="flex items-center gap-1 text-xs text-muted">
                  <Gamepad2 size={12} />
                  {gameCountMap[session.id] ?? 0} partidas
                </p>
              </div>
              <ChevronRight size={16} className="text-muted" />
            </Link>
          ))}
          {sessions.length === 0 && (
            <p className="py-8 text-center text-sm text-muted">
              No hay fechas creadas.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
