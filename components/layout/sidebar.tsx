'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Footprints,
  Zap,
  ShieldAlert,
  Trophy,
  Database,
  Activity,
  LucideIcon,
} from 'lucide-react'

interface NavLinkProps {
  href: string
  icon: LucideIcon
  label: string
  adminOnly?: boolean
}

function NavLink({ href, icon: Icon, label, adminOnly }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-green-600 text-white'
          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span>{label}</span>
      {adminOnly && (
        <span className="ml-auto text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">
          Admin
        </span>
      )}
    </Link>
  )
}

export function Sidebar() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.isAdmin

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-gray-900 flex flex-col">
      <div className="flex h-16 items-center gap-3 px-6 border-b border-gray-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
          <Activity className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg leading-none">Rustep</h1>
          <p className="text-gray-400 text-xs">Dashboard Admin</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <NavLink href="/" icon={LayoutDashboard} label="Overview" />
        <NavLink href="/users" icon={Users} label="Usuarios" />
        <NavLink href="/steps" icon={Footprints} label="Sesiones de pasos" />
        <NavLink href="/stamina" icon={Zap} label="Stamina" />
        <NavLink href="/fraud" icon={ShieldAlert} label="Fraude" />
        <NavLink href="/rankings" icon={Trophy} label="Rankings" />
        {isAdmin && (
          <>
            <div className="pt-4 pb-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3">
                Admin
              </p>
            </div>
            <NavLink href="/seed" icon={Database} label="Datos de prueba" adminOnly />
          </>
        )}
      </nav>

      <div className="px-4 py-4 border-t border-gray-800">
        {session?.user && (
          <div className="flex items-center gap-3">
            {session.user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.user.image}
                alt={session.user.name || ''}
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-medium">
                {(session.user.name || 'A')[0]}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{session.user.name}</p>
              {isAdmin && (
                <p className="text-xs text-green-400">Admin</p>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
