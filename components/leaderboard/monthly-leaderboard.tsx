'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { LeaderboardTable } from './leaderboard-table'
import type { LeaderboardEntry } from '@/lib/types'

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

type MonthOption = { year: number; month: number; label: string }

export function MonthlyLeaderboard() {
  const [months, setMonths] = useState<MonthOption[]>([])
  const [selected, setSelected] = useState<string>('') // "2026-03"
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = useMemo(() => createClient(), [])

  // Fetch available months from sessions
  useEffect(() => {
    async function fetchMonths() {
      const { data: sessions } = await supabase
        .from('sessions')
        .select('date')
        .order('date', { ascending: false })

      if (!sessions?.length) {
        setLoading(false)
        return
      }

      const seen = new Set<string>()
      const opts: MonthOption[] = []

      for (const s of sessions) {
        const [y, m] = s.date.split('-')
        const year = parseInt(y)
        const month = parseInt(m)
        // Feb 2026 se junta con Marzo 2026, no mostrar Feb como opcion
        if (year === 2026 && month === 2) continue
        const key = `${y}-${m}`
        if (!seen.has(key)) {
          seen.add(key)
          opts.push({
            year,
            month,
            label: `${MONTH_NAMES[month - 1]} ${y}`,
          })
        }
      }

      setMonths(opts)
      if (opts.length > 0) {
        const key = `${opts[0].year}-${String(opts[0].month).padStart(2, '0')}`
        setSelected(key)
      } else {
        setLoading(false)
      }
    }
    fetchMonths()
  }, [supabase])

  const fetchLeaderboard = useCallback(
    async (yearMonth: string) => {
      setLoading(true)
      const [yearStr, monthStr] = yearMonth.split('-')
      const year = parseInt(yearStr)
      const month = parseInt(monthStr)

      // Marzo 2026 incluye febrero 2026 (se juntaron por unica vez)
      const startDate =
        year === 2026 && month === 3
          ? '2026-02-01'
          : `${year}-${String(month).padStart(2, '0')}-01`
      const nextMonth = month === 12 ? 1 : month + 1
      const nextYear = month === 12 ? year + 1 : year
      const endDate = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`

      // 1. Get session IDs for this month
      const { data: sessions } = await supabase
        .from('sessions')
        .select('id')
        .gte('date', startDate)
        .lt('date', endDate)

      if (!sessions?.length) {
        setEntries([])
        setLoading(false)
        return
      }

      const sessionIds = sessions.map((s) => s.id)

      // 2. Get game IDs for those sessions
      const { data: games } = await supabase
        .from('games')
        .select('id, session_id')
        .in('session_id', sessionIds)

      if (!games?.length) {
        setEntries([])
        setLoading(false)
        return
      }

      const gameIds = games.map((g) => g.id)

      // 3. Get results with player info
      const { data: results } = await supabase
        .from('results')
        .select('player_id, position, points, game_id')
        .in('game_id', gameIds)

      // 4. Get players
      const { data: players } = await supabase.from('players').select('id, name, emoji')

      if (!results?.length || !players?.length) {
        setEntries([])
        setLoading(false)
        return
      }

      const playerMap = new Map(players.map((p) => [p.id, p]))

      // Build a map of game_id -> session_id for counting sessions
      const gameSessionMap = new Map(games.map((g) => [g.id, g.session_id]))

      // 5. Aggregate
      const stats = new Map<
        string,
        {
          total_points: number
          games_played: number
          wins: number
          positions: number[]
          sessions: Set<string>
        }
      >()

      for (const r of results) {
        let s = stats.get(r.player_id)
        if (!s) {
          s = { total_points: 0, games_played: 0, wins: 0, positions: [], sessions: new Set() }
          stats.set(r.player_id, s)
        }
        s.total_points += r.points
        s.games_played += 1
        if (r.position === 1) s.wins += 1
        s.positions.push(r.position)
        const sid = gameSessionMap.get(r.game_id)
        if (sid) s.sessions.add(sid)
      }

      const leaderboard: LeaderboardEntry[] = []

      for (const [playerId, s] of stats) {
        const player = playerMap.get(playerId)
        if (!player) continue
        leaderboard.push({
          player_id: playerId,
          name: player.name,
          emoji: player.emoji,
          total_points: s.total_points,
          games_played: s.games_played,
          sessions_attended: s.sessions.size,
          wins: s.wins,
          avg_position:
            Math.round((s.positions.reduce((a, b) => a + b, 0) / s.positions.length) * 100) / 100,
        })
      }

      leaderboard.sort((a, b) => b.total_points - a.total_points)
      setEntries(leaderboard)
      setLoading(false)
    },
    [supabase]
  )

  // Fetch leaderboard when selected month changes
  useEffect(() => {
    if (selected) fetchLeaderboard(selected)
  }, [selected, fetchLeaderboard])

  return (
    <div>
      <div className="mb-3 flex items-center justify-between px-4">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gold-light">
          Ranking del Mes
        </h2>
        {months.length > 0 && (
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-foreground outline-none focus:border-gold/50"
          >
            {months.map((m) => {
              const key = `${m.year}-${String(m.month).padStart(2, '0')}`
              return (
                <option key={key} value={key}>
                  {m.label}
                </option>
              )
            })}
          </select>
        )}
      </div>

      {loading ? (
        <div className="space-y-2 px-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton h-16 w-full" />
          ))}
        </div>
      ) : (
        <LeaderboardTable entries={entries} />
      )}
    </div>
  )
}
