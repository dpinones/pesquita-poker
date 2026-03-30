'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Crown } from 'lucide-react'
import { cn } from '@/lib/utils'

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

type Champion = {
  month: number
  year: number
  label: string
  name: string
  emoji: string
  total_points: number
}

export function MonthlyChampions() {
  const [champions, setChampions] = useState<Champion[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    async function fetchChampions() {
      // 1. Get all sessions
      const { data: sessions } = await supabase
        .from('sessions')
        .select('id, date')
        .order('date', { ascending: false })

      if (!sessions?.length) {
        setLoading(false)
        return
      }

      // 2. Build month groups (session IDs per month)
      // Feb 2026 merges into March 2026
      const monthGroups = new Map<string, { year: number; month: number; sessionIds: string[] }>()

      for (const s of sessions) {
        const [y, m] = s.date.split('-')
        let year = parseInt(y)
        let month = parseInt(m)

        // Feb 2026 -> March 2026
        if (year === 2026 && month === 2) {
          year = 2026
          month = 3
        }

        const key = `${year}-${String(month).padStart(2, '0')}`
        let group = monthGroups.get(key)
        if (!group) {
          group = { year, month, sessionIds: [] }
          monthGroups.set(key, group)
        }
        group.sessionIds.push(s.id)
      }

      // 3. Get all games and results
      const allSessionIds = sessions.map((s) => s.id)
      const { data: games } = await supabase
        .from('games')
        .select('id, session_id')
        .in('session_id', allSessionIds)

      if (!games?.length) {
        setLoading(false)
        return
      }

      const gameIds = games.map((g) => g.id)
      const { data: results } = await supabase
        .from('results')
        .select('player_id, points, game_id')
        .in('game_id', gameIds)

      const { data: players } = await supabase.from('players').select('id, name, emoji')

      if (!results?.length || !players?.length) {
        setLoading(false)
        return
      }

      const playerMap = new Map(players.map((p) => [p.id, p]))
      const gameSessionMap = new Map(games.map((g) => [g.id, g.session_id]))

      // 4. For each month, find the player with most points
      const champs: Champion[] = []

      for (const [, group] of monthGroups) {
        const sessionSet = new Set(group.sessionIds)
        const pointsByPlayer = new Map<string, number>()

        for (const r of results) {
          const sid = gameSessionMap.get(r.game_id)
          if (!sid || !sessionSet.has(sid)) continue
          pointsByPlayer.set(r.player_id, (pointsByPlayer.get(r.player_id) ?? 0) + r.points)
        }

        let topId = ''
        let topPoints = 0
        for (const [pid, pts] of pointsByPlayer) {
          if (pts > topPoints) {
            topId = pid
            topPoints = pts
          }
        }

        const player = playerMap.get(topId)
        if (player && topPoints > 0) {
          champs.push({
            month: group.month,
            year: group.year,
            label: `${MONTH_NAMES[group.month - 1]} ${group.year}`,
            name: player.name,
            emoji: player.emoji,
            total_points: topPoints,
          })
        }
      }

      // Sort by date descending
      champs.sort((a, b) => b.year - a.year || b.month - a.month)
      setChampions(champs)
      setLoading(false)
    }

    fetchChampions()
  }, [supabase])

  return (
    <div>
      <div className="mb-3 px-4">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gold-light">
          Campeones del Mes
        </h2>
      </div>

      {loading ? (
        <div className="space-y-2 px-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton h-16 w-full" />
          ))}
        </div>
      ) : champions.length === 0 ? (
        <div className="px-4 py-16 text-center text-muted">
          No hay campeones todavia.
        </div>
      ) : (
        <div className="animate-stagger px-4">
          {champions.map((c) => (
            <div
              key={`${c.year}-${c.month}`}
              className={cn(
                'mb-2 flex items-center gap-3 rounded-xl border border-gold/40 bg-card px-4 py-3 transition-colors'
              )}
            >
              <div className="flex w-8 shrink-0 items-center justify-center text-gold">
                <Crown size={20} strokeWidth={2} />
              </div>

              <div className="flex min-w-0 flex-1 items-center gap-2">
                <span className="text-lg">{c.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gold-light">
                    {c.name}
                  </p>
                  <p className="text-xs text-muted">{c.label}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold tabular-nums text-gold">
                  {c.total_points}
                </p>
                <p className="text-xs text-muted">pts</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
