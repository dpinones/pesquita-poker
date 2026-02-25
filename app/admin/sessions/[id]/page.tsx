import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/page-header'
import { GameForm } from '@/components/admin/game-form'
import { GameResults } from '@/components/fechas/game-results'
import { formatDate } from '@/lib/utils'
import { notFound } from 'next/navigation'
import type { Session, Player, Game } from '@/lib/types'

type ResultWithPlayer = {
  id: string
  game_id: string
  player_id: string
  position: number
  points: number
  player: { name: string; emoji: string }
}

export default async function AdminSessionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: rawSession } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', id)
    .single()
  const session = rawSession as Session | null

  if (!session) notFound()

  const { data: rawPlayers } = await supabase
    .from('players')
    .select('*')
    .order('name')
  const players = (rawPlayers ?? []) as Player[]

  const { data: rawGames } = await supabase
    .from('games')
    .select('*')
    .eq('session_id', id)
    .order('game_number')
  const games = (rawGames ?? []) as Game[]

  const gameIds = games.map((g) => g.id)
  const { data: rawResults } = await supabase
    .from('results')
    .select('*, player:players(*)')
    .in('game_id', gameIds.length > 0 ? gameIds : ['none'])
    .order('position')
  const results = (rawResults ?? []) as unknown as ResultWithPlayer[]

  return (
    <div>
      <PageHeader
        title="Editar Fecha"
        subtitle={formatDate(session.date)}
        back
      />
      <div className="space-y-6 px-4 pb-8">
        {games.map((game) => {
          const gameResults = results
            .filter((r) => r.game_id === game.id)
            .map((r) => ({
              position: r.position,
              points: r.points,
              player: r.player,
            }))
          return (
            <GameResults
              key={game.id}
              gameNumber={game.game_number}
              results={gameResults}
            />
          )
        })}

        <div className="rounded-xl border border-dashed border-gold/30 bg-felt-light/50 p-4">
          <GameForm
            sessionId={id}
            players={players}
            existingGames={games}
          />
        </div>
      </div>
    </div>
  )
}
