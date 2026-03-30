'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Calendar, Trophy, Crown, CalendarDays, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { href: '/?tab=monthly', match: { path: '/', param: 'monthly' }, label: 'Mensual', icon: Calendar },
  { href: '/?tab=historic', match: { path: '/', param: 'historic' }, label: 'Historico', icon: Trophy },
  { href: '/?tab=champions', match: { path: '/', param: 'champions' }, label: 'Campeones', icon: Crown },
  { href: '/fechas', match: { path: '/fechas' }, label: 'Fechas', icon: CalendarDays },
  { href: '/admin', match: { path: '/admin' }, label: 'Admin', icon: Shield },
]

export function Navbar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-felt/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg">
        {tabs.map(({ href, match, label, icon: Icon }) => {
          let isActive = false
          if ('param' in match) {
            const tab = searchParams.get('tab') || 'monthly'
            isActive = pathname === match.path && tab === match.param
          } else {
            isActive = match.path === '/' ? pathname === '/' : pathname.startsWith(match.path)
          }

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors',
                isActive ? 'text-gold' : 'text-muted hover:text-foreground'
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className={cn(isActive && 'font-semibold')}>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
