import { auth } from '@/lib/auth'
import { Header } from '@/components/layout/header'
import { StatsCard } from '@/components/dashboard/stats-card'
import { StepsChart } from '@/components/dashboard/steps-chart'
import { RecentUsersTable } from '@/components/dashboard/recent-users-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Footprints, Zap, Activity, ShieldAlert } from 'lucide-react'
import { IUser, OverviewMetrics } from '@/types'
import { serialize } from '@/lib/utils'
import connectToMongoDB from '@/lib/mongodb'
import prisma from '@/lib/prisma'
import User from '@/lib/models/user.model'
import StepsLog from '@/lib/models/steps-log.model'
import FraudFlag from '@/lib/models/fraud-flag.model'
import { subDays, startOfDay, endOfDay, format } from 'date-fns'

async function getOverviewData(): Promise<OverviewMetrics | null> {
  try {
    await connectToMongoDB()

    const now = new Date()
    const sevenDaysAgo = subDays(now, 7)
    const todayStart = startOfDay(now)
    const todayEnd = endOfDay(now)

    const [
      totalUsers,
      activeUsersLast7Days,
      todayStepsAgg,
      pendingSuspicious,
      recentUsers,
      stepsLast30DaysRaw,
      staminaCirculation,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ lastActive: { $gte: sevenDaysAgo } }),
      StepsLog.aggregate([
        { $match: { startTime: { $gte: todayStart, $lte: todayEnd }, confidenceStatus: { $ne: 'blocked' } } },
        { $group: { _id: null, total: { $sum: '$stepsCount' } } },
      ]),
      FraudFlag.countDocuments({ reviewStatus: 'pending' }),
      User.find().sort({ createdAt: -1 }).limit(10).lean(),
      StepsLog.aggregate([
        {
          $match: {
            startTime: { $gte: subDays(now, 30) },
            confidenceStatus: { $ne: 'blocked' },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$startTime' } },
            steps: { $sum: '$stepsCount' },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      prisma.staminaLedger.aggregate({ _sum: { amount: true } }),
    ])

    const stepsLast30Days: { date: string; steps: number }[] = []
    for (let i = 29; i >= 0; i--) {
      const date = format(subDays(now, i), 'yyyy-MM-dd')
      const found = stepsLast30DaysRaw.find((r: { _id: string; steps: number }) => r._id === date)
      stepsLast30Days.push({ date, steps: found ? found.steps : 0 })
    }

    return {
      totalUsers,
      activeUsersLast7Days,
      totalStepsToday: todayStepsAgg[0]?.total ?? 0,
      totalStaminaCirculation: staminaCirculation._sum.amount ?? 0,
      pendingSuspiciousSessions: pendingSuspicious,
      stepsLast30Days,
      recentUsers: serialize<IUser[]>(recentUsers),
    }
  } catch (err) {
    console.error('[Overview] Error conectando a la base de datos:', err)
    return null
  }
}

export default async function OverviewPage() {
  const session = await auth()
  const data = await getOverviewData()

  return (
    <div>
      <Header
        title="Overview"
        description={`Bienvenido, ${session?.user?.name || 'Admin'}`}
      />
      <div className="p-6 space-y-6">
        {!data ? (
          <div className="p-6 bg-[#0D2540] border border-[#FF5A1F]/40 rounded-lg space-y-2">
            <p className="font-rajdhani font-semibold text-[#FF5A1F] tracking-wide">Sin conexion a la base de datos</p>
            <p className="text-sm text-[#8BA4BE] font-exo">
              No se pudo conectar a MongoDB o PostgreSQL. Verifica que estas variables esten cargadas en Vercel &rarr; Settings &rarr; Environment Variables:
            </p>
            <ul className="text-sm list-disc list-inside space-y-1 font-mono text-[#00C2FF]">
              <li>MONGODB_URI</li>
              <li>DATABASE_URL</li>
            </ul>
            <p className="text-xs mt-2 text-[#8BA4BE] font-exo">
              Revisa los logs en Vercel &rarr; pestana &quot;Logs&quot; para ver el error exacto.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <StatsCard
                title="Total usuarios"
                value={data.totalUsers}
                icon={Users}
                color="text-[#00C2FF]"
              />
              <StatsCard
                title="Activos (7 dias)"
                value={data.activeUsersLast7Days}
                icon={Activity}
                color="text-[#FF5A1F]"
              />
              <StatsCard
                title="Pasos hoy"
                value={data.totalStepsToday}
                icon={Footprints}
                color="text-[#FF5A1F]"
              />
              <StatsCard
                title="Stamina en circulacion"
                value={data.totalStaminaCirculation}
                icon={Zap}
                color="text-[#00C2FF]"
              />
              <StatsCard
                title="Sesiones sospechosas"
                value={data.pendingSuspiciousSessions}
                icon={ShieldAlert}
                color="text-[#FF5A1F]"
                description="Pendientes de revision"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Pasos totales - ultimos 30 dias</CardTitle>
              </CardHeader>
              <CardContent>
                <StepsChart data={data.stepsLast30Days} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ultimos usuarios registrados</CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <RecentUsersTable users={data.recentUsers} />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
