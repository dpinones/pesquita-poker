'use client'

import { AlertTriangle } from 'lucide-react'

export default function Error({
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
      <AlertTriangle size={40} className="mb-4 text-gold" />
      <h2 className="mb-2 text-lg font-semibold">Algo salio mal</h2>
      <p className="mb-6 text-sm text-muted">
        Hubo un error cargando la pagina.
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-felt transition-opacity hover:opacity-90"
      >
        Reintentar
      </button>
    </div>
  )
}
