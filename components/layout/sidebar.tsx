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
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium font-exo transition-all duration-200',
        isActive
          ? 'bg-[#FF5A1F] text-white shadow-orange'
          : 'text-[#8BA4BE] hover:bg-[#0D2540] hover:text-white border-l-2 border-transparent hover:border-[#FF5A1F]'
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span>{label}</span>
      {adminOnly && (
        <span className="ml-auto text-xs bg-[#00C2FF]/20 text-[#00C2FF] px-1.5 py-0.5 rounded font-rajdhani font-semibold tracking-wide">
          ADMIN
        </span>
      )}
    </Link>
  )
}

export function Sidebar() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.isAdmin

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-[#071A2F] border-r border-[#1A3A5C] flex flex-col">
      {/* Logo */}
      <div className="relative flex h-24 items-center justify-center border-b border-[#1A3A5C] overflow-hidden bg-[#071A2F]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/logo.svg"
          alt="Rustep"
          className="absolute inset-0 w-full h-full object-contain opacity-90"
          style={{ padding: '6px' }}
        />
        {/* Subtle bottom label */}
        <p className="absolute bottom-1.5 left-0 right-0 text-center text-[#00C2FF] font-rajdhani text-[10px] tracking-[0.25em] uppercase opacity-80">
          Dashboard
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <NavLink href="/" icon={LayoutDashboard} label="Overview" />
        <NavLink href="/users" icon={Users} label="Usuarios" />
        <NavLink href="/steps" icon={Footprints} label="Sesiones de pasos" />
        <NavLink href="/stamina" icon={Zap} label="Stamina" />
        <NavLink href="/fraud" icon={ShieldAlert} label="Fraude" />
        <NavLink href="/rankings" icon={Trophy} label="Rankings" />
        {isAdmin && (
          <>
            <div className="pt-5 pb-2">
              <div className="flex items-center gap-2 px-3 mb-2">
                <div className="flex-1 h-px bg-[#1A3A5C]" />
                <span className="text-xs font-rajdhani font-semibold text-[#00C2FF] tracking-widest uppercase px-1">
                  Admin
                </span>
                <div className="flex-1 h-px bg-[#1A3A5C]" />
              </div>
            </div>
            <NavLink href="/seed" icon={Database} label="Datos de prueba" adminOnly />
          </>
        )}
      </nav>

      {/* Footer usuario */}
      <div className="px-4 py-4 border-t border-[#1A3A5C]">
        {session?.user && (
          <div className="flex items-center gap-3">
            {session.user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.user.image}
                alt={session.user.name || ''}
                className="h-9 w-9 rounded-full border-2 border-[#1A3A5C]"
              />
            ) : (
              <div className="h-9 w-9 rounded-full bg-[#FF5A1F] flex items-center justify-center text-white text-sm font-bold font-bebas">
                {(session.user.name || 'A')[0]}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white font-exo truncate">{session.user.name}</p>
              <p className="text-xs text-[#8BA4BE] font-exo truncate">{session.user.email}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
