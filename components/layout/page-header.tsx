'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export function PageHeader({
  title,
  subtitle,
  back,
}: {
  title: string
  subtitle?: string
  back?: boolean
}) {
  const router = useRouter()

  return (
    <div className="flex items-center gap-3 px-4 pt-6 pb-4">
      {back && (
        <button
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-gold/30 hover:text-foreground"
        >
          <ArrowLeft size={18} />
        </button>
      )}
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted">{subtitle}</p>
        )}
      </div>
    </div>
  )
}
