'use client'

import { useSearchParams } from 'next/navigation'
import { LeaderboardTable } from './leaderboard-table'
import { MonthlyLeaderboard } from './monthly-leaderboard'
import { MonthlyChampions } from './monthly-champions'
import type { LeaderboardEntry } from '@/lib/types'

type TabId = 'monthly' | 'historic' | 'champions'

export function RankingTabs({ historicEntries }: { historicEntries: LeaderboardEntry[] }) {
  const searchParams = useSearchParams()
  const active = (searchParams.get('tab') as TabId) || 'monthly'

  return (
    <div>
      {active === 'monthly' && <MonthlyLeaderboard />}

      {active === 'historic' && (
        <>
          <div className="mb-3 px-4">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gold-light">
              Ranking Historico
            </h2>
          </div>
          <LeaderboardTable entries={historicEntries} />
        </>
      )}

      {active === 'champions' && <MonthlyChampions />}
    </div>
  )
}
