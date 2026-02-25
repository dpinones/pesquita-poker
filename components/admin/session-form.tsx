'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CalendarPlus } from 'lucide-react'

export function SessionForm() {
  const router = useRouter()
  const [date, setDate] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!date) return
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: err } = await supabase
      .from('sessions')
      .insert({ date, notes: notes.trim() || null })

    if (err) {
      setError(err.message.includes('duplicate') ? 'Ya existe una fecha para ese dia' : err.message)
      setLoading(false)
      return
    }

    setDate('')
    setNotes('')
    setLoading(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="h-10 flex-1 rounded-lg border border-border bg-felt-light px-3 text-sm text-foreground outline-none focus:border-gold/40"
        />
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notas (opcional)"
          className="h-10 flex-1 rounded-lg border border-border bg-felt-light px-3 text-sm text-foreground outline-none placeholder:text-muted/50 focus:border-gold/40"
        />
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
      <button
        type="submit"
        disabled={loading || !date}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-felt transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        <CalendarPlus size={16} />
        {loading ? 'Creando...' : 'Crear Fecha'}
      </button>
    </form>
  )
}
