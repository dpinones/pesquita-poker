import Link from 'next/link'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
      <p className="mb-2 text-5xl">🃏</p>
      <h2 className="mb-2 text-lg font-semibold">Pagina no encontrada</h2>
      <p className="mb-6 text-sm text-muted">
        La pagina que buscas no existe.
      </p>
      <Link
        href="/"
        className="flex items-center gap-2 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-felt transition-opacity hover:opacity-90"
      >
        <Home size={16} />
        Ir al inicio
      </Link>
    </div>
  )
}
