'use client'

import { useState } from 'react'
import { Info, X } from 'lucide-react'
import { POINTS_MAP } from '@/lib/scoring'

const positionLabels: Record<number, string> = {
  1: '1ro',
  2: '2do',
  3: '3ro',
  4: '4to',
  5: '5to',
  6: '6to',
  7: '7mo',
  8: '8vo',
  9: '9no',
  10: '10mo',
}

export function PointsInfo() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs text-muted transition-colors hover:border-gold/30 hover:text-foreground"
      >
        <Info size={14} />
        Puntos
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="mx-4 w-full max-w-sm animate-fade-in-up rounded-2xl border border-border bg-felt-light p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-[family-name:var(--font-display)] text-lg font-bold">
                Sistema de Puntos
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition-colors hover:bg-felt-lighter hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>
            <p className="mb-3 text-xs text-muted">
              Estilo F1: puntos por posicion en cada partida
            </p>
            <div className="divide-y divide-border rounded-xl border border-border bg-card">
              {Object.entries(POINTS_MAP).map(([pos, pts]) => {
                const p = Number(pos)
                return (
                  <div key={pos} className="flex items-center justify-between px-4 py-2">
                    <span className="text-sm text-muted">{positionLabels[p]}</span>
                    <span className="text-sm font-semibold tabular-nums text-gold">
                      {pts} pts
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
