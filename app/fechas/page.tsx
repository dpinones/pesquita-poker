import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/page-header'
import { SessionCard } from '@/components/fechas/session-card'
import type { Session, Game, Result } from '@/lib/types'

export default async function FechasPage() {
  const supabase = await createClient()

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

  const gameIds = games.map((g) => g.id)
  const { data: rawResults } = await supabase
    .from('results')
    .select('*')
    .in('game_id', gameIds.length > 0 ? gameIds : ['none'])
  const results = (rawResults ?? []) as Result[]

  const gameCountMap: Record<string, number> = {}
  const playerSetMap: Record<string, Set<string>> = {}

  for (const g of games) {
    gameCountMap[g.session_id] = (gameCountMap[g.session_id] ?? 0) + 1
    if (!playerSetMap[g.session_id]) playerSetMap[g.session_id] = new Set()
  }

  for (const r of results) {
    const game = games.find((g) => g.id === r.game_id)
    if (game) playerSetMap[game.session_id]?.add(r.player_id)
  }

  return (
    <div>
      <PageHeader title="Fechas" subtitle="Todas las sesiones" />
      <div className="animate-stagger space-y-2 px-4">
        {sessions.length === 0 && (
          <p className="py-16 text-center text-muted">No hay fechas todavia.</p>
        )}
        {sessions.map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            gameCount={gameCountMap[session.id] ?? 0}
            playerCount={playerSetMap[session.id]?.size ?? 0}
          />
        ))}
      </div>
    </div>
  )
}
