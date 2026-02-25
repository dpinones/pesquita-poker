'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getPoints } from '@/lib/scoring'
import type { Player, Game } from '@/lib/types'
import { Plus, Save, Trash2, Trophy } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type ResultEntry = { player_id: string; position: number }

const positionBadge: Record<number, 'gold' | 'silver' | 'bronze'> = {
  1: 'gold',
  2: 'silver',
  3: 'bronze',
}

export function GameForm({
  sessionId,
  players,
  existingGames,
}: {
  sessionId: string
  players: Player[]
  existingGames: Game[]
}) {
  const router = useRouter()
  const [entries, setEntries] = useState<ResultEntry[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function addEntry() {
    const usedPlayers = entries.map((e) => e.player_id)
    const available = players.filter((p) => !usedPlayers.includes(p.id))
    if (available.length === 0) return

    setEntries([
      ...entries,
      { player_id: available[0].id, position: entries.length + 1 },
    ])
  }

  function removeEntry(idx: number) {
    const next = entries.filter((_, i) => i !== idx)
    // Re-number positions
    setEntries(next.map((e, i) => ({ ...e, position: i + 1 })))
  }

  function updatePlayer(idx: number, playerId: string) {
    setEntries(entries.map((e, i) => (i === idx ? { ...e, player_id: playerId } : e)))
  }

  function moveEntry(idx: number, dir: -1 | 1) {
    const next = [...entries]
    const target = idx + dir
    if (target < 0 || target >= next.length) return
    ;[next[idx], next[target]] = [next[target], next[idx]]
    setEntries(next.map((e, i) => ({ ...e, position: i + 1 })))
  }

  async function saveGame() {
    if (entries.length < 2) {
      setError('Minimo 2 jugadores')
      return
    }

    // Check for duplicate players
    const playerIds = entries.map((e) => e.player_id)
    if (new Set(playerIds).size !== playerIds.length) {
      setError('Hay jugadores duplicados')
      return
    }

    setError('')
    setSaving(true)

    const supabase = createClient()
    const gameNumber = existingGames.length + 1

    const { data: rawGame, error: gameErr } = await supabase
      .from('games')
      .insert({ session_id: sessionId, game_number: gameNumber })
      .select()
      .single()
    const game = rawGame as { id: string } | null

    if (gameErr || !game) {
      setError(gameErr?.message ?? 'Error creando partida')
      setSaving(false)
      return
    }

    const results = entries.map((e) => ({
      game_id: game.id,
      player_id: e.player_id,
      position: e.position,
      points: getPoints(e.position),
    }))

    const { error: resErr } = await supabase.from('results').insert(results)

    if (resErr) {
      setError(resErr.message)
      setSaving(false)
      return
    }

    setEntries([])
    setSaving(false)
    router.refresh()
  }

  const usedPlayers = entries.map((e) => e.player_id)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <Trophy size={14} className="text-gold" />
          Partida {existingGames.length + 1}
        </h3>
        <button
          onClick={addEntry}
          disabled={usedPlayers.length >= players.length}
          className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted transition-colors hover:border-gold/30 hover:text-foreground disabled:opacity-40"
        >
          <Plus size={14} />
          Jugador
        </button>
      </div>

      {entries.length === 0 && (
        <p className="py-6 text-center text-xs text-muted">
          Agrega jugadores en orden de posicion (1ro arriba)
        </p>
      )}

      <div className="space-y-1.5">
        {entries.map((entry, idx) => {
          const pos = idx + 1
          const pts = getPoints(pos)
          return (
            <div
              key={idx}
              className={cn(
                'flex items-center gap-2 rounded-lg border bg-card px-3 py-2',
                pos <= 3 ? 'border-gold/20' : 'border-border'
              )}
            >
              <div className="w-7 text-center">
                {positionBadge[pos] ? (
                  <Badge variant={positionBadge[pos]} className="text-xs font-bold">{pos}</Badge>
                ) : (
                  <span className="text-xs text-muted">{pos}</span>
                )}
              </div>
              <select
                value={entry.player_id}
                onChange={(e) => updatePlayer(idx, e.target.value)}
                className="h-8 flex-1 rounded border border-border bg-felt-light px-2 text-sm text-foreground outline-none focus:border-gold/40"
              >
                {players.map((p) => (
                  <option
                    key={p.id}
                    value={p.id}
                    disabled={usedPlayers.includes(p.id) && entry.player_id !== p.id}
                  >
                    {p.emoji} {p.name}
                  </option>
                ))}
              </select>
              <span className="w-10 text-right text-xs tabular-nums text-muted">
                +{pts}
              </span>
              <div className="flex gap-0.5">
                <button
                  onClick={() => moveEntry(idx, -1)}
                  disabled={idx === 0}
                  className="px-1 text-muted transition-colors hover:text-foreground disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveEntry(idx, 1)}
                  disabled={idx === entries.length - 1}
                  className="px-1 text-muted transition-colors hover:text-foreground disabled:opacity-30"
                >
                  ↓
                </button>
              </div>
              <button
                onClick={() => removeEntry(idx)}
                className="text-muted transition-colors hover:text-danger"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )
        })}
      </div>

      {error && <p className="text-xs text-danger">{error}</p>}

      {entries.length >= 2 && (
        <button
          onClick={saveGame}
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-felt transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? 'Guardando...' : 'Guardar Partida'}
        </button>
      )}
    </div>
  )
}
