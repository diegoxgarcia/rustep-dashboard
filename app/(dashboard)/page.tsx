import { auth } from '@/lib/auth'
import { Header } from '@/components/layout/header'
import { StatsCard } from '@/components/dashboard/stats-card'
import { StepsChart } from '@/components/dashboard/steps-chart'
import { RecentUsersTable } from '@/components/dashboard/recent-users-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Footprints, Zap, Activity, ShieldAlert } from 'lucide-react'
import { OverviewMetrics } from '@/types'

export default async function OverviewPage() {
  const session = await auth()

  let data: OverviewMetrics | null = null
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3001'
    const res = await fetch(`${baseUrl}/api/overview`, {
      next: { revalidate: 60 },
    })
    if (res.ok) data = await res.json()
  } catch {
    // data remains null
  }

  return (
    <div>
      <Header
        title="Overview"
        description={`Bienvenido, ${session?.user?.name || 'Admin'}`}
      />
      <div className="p-6 space-y-6">
        {!data ? (
          <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
            <p className="font-medium">Configurar variables de entorno</p>
            <p className="text-sm mt-1">
              Conecta MONGODB_URI y DATABASE_URL en tu .env.local para ver los datos reales.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <StatsCard
                title="Total usuarios"
                value={data.totalUsers}
                icon={Users}
                color="text-blue-600"
              />
              <StatsCard
                title="Activos (7 dias)"
                value={data.activeUsersLast7Days}
                icon={Activity}
                color="text-green-600"
              />
              <StatsCard
                title="Pasos hoy"
                value={data.totalStepsToday}
                icon={Footprints}
                color="text-purple-600"
              />
              <StatsCard
                title="Stamina en circulacion"
                value={data.totalStaminaCirculation}
                icon={Zap}
                color="text-yellow-500"
              />
              <StatsCard
                title="Sesiones sospechosas"
                value={data.pendingSuspiciousSessions}
                icon={ShieldAlert}
                color="text-red-600"
                description="Pendientes de revision"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Pasos totales - ultimos 30 dias</CardTitle>
              </CardHeader>
              <CardContent>
                <StepsChart data={data.stepsLast30Days} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ultimos usuarios registrados</CardTitle>
              </CardHeader>
              <CardContent>
                <RecentUsersTable users={data.recentUsers} />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
