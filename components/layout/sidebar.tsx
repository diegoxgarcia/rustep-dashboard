import { auth } from '@/lib/auth'
import { NavItem } from './nav-item'
import {
  LayoutDashboard,
  Users,
  Footprints,
  Zap,
  ShieldAlert,
  Trophy,
  Database,
  Activity,
} from 'lucide-react'

export async function Sidebar() {
  const session = await auth()
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
        <NavItem href="/" icon={LayoutDashboard} label="Overview" />
        <NavItem href="/users" icon={Users} label="Usuarios" />
        <NavItem href="/steps" icon={Footprints} label="Sesiones de pasos" />
        <NavItem href="/stamina" icon={Zap} label="Stamina" />
        <NavItem href="/fraud" icon={ShieldAlert} label="Fraude" />
        <NavItem href="/rankings" icon={Trophy} label="Rankings" />
        {isAdmin && (
          <>
            <div className="pt-4 pb-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3">
                Admin
              </p>
            </div>
            <NavItem href="/seed" icon={Database} label="Datos de prueba" adminOnly />
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
