import { createClient } from '@/lib/supabase/server'
import { LeaderboardTable } from '@/components/leaderboard/leaderboard-table'
import type { LeaderboardEntry } from '@/lib/types'

export default async function HomePage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('leaderboard')
    .select('*')
    .order('total_points', { ascending: false })

  const entries = (data ?? []) as LeaderboardEntry[]

  return (
    <div>
      <div className="px-4 pt-8 pb-4 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
          <span className="text-gold-gradient">Pesquita Poker</span>
        </h1>
        <p className="mt-1 text-sm text-muted">Liga semanal de poker</p>
      </div>
      <LeaderboardTable entries={entries} />
    </div>
  )
}
