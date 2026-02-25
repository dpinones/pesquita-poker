'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Player } from '@/lib/types'
import { Plus, Trash2 } from 'lucide-react'

const EMOJIS = ['🃏', '♠️', '♥️', '♦️', '♣️', '🎰', '🎲', '👑', '🔥', '⭐']

export function PlayerManager({ players }: { players: Player[] }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('🃏')
  const [loading, setLoading] = useState(false)

  async function addPlayer(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)

    const supabase = createClient()
    await supabase.from('players').insert({ name: name.trim(), emoji })

    setName('')
    setEmoji('🃏')
    setLoading(false)
    router.refresh()
  }

  async function deletePlayer(id: string) {
    if (!confirm('Eliminar jugador?')) return
    const supabase = createClient()
    await supabase.from('players').delete().eq('id', id)
    router.refresh()
  }

  return (
    <div className="space-y-3">
      <form onSubmit={addPlayer} className="flex items-end gap-2">
        <select
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
          className="h-10 w-14 rounded-lg border border-border bg-felt-light text-center text-lg outline-none focus:border-gold/40"
        >
          {EMOJIS.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del jugador"
          className="h-10 flex-1 rounded-lg border border-border bg-felt-light px-3 text-sm text-foreground outline-none placeholder:text-muted/50 focus:border-gold/40"
        />
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold text-felt transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <Plus size={18} />
        </button>
      </form>

      <div className="space-y-1">
        {players.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2"
          >
            <span className="text-base">{p.emoji}</span>
            <span className="flex-1 text-sm">{p.name}</span>
            <button
              onClick={() => deletePlayer(p.id)}
              className="text-muted transition-colors hover:text-danger"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
