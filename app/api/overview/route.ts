import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import connectToMongoDB from '@/lib/mongodb'
import prisma from '@/lib/prisma'
import User from '@/lib/models/user.model'
import StepsLog from '@/lib/models/steps-log.model'
import FraudFlag from '@/lib/models/fraud-flag.model'
import { subDays, startOfDay, endOfDay, format } from 'date-fns'

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

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
    prisma.staminaLedger.aggregate({
      _sum: { amount: true },
    }),
  ])

  const stepsLast30Days: { date: string; steps: number }[] = []
  for (let i = 29; i >= 0; i--) {
    const date = format(subDays(now, i), 'yyyy-MM-dd')
    const found = stepsLast30DaysRaw.find((r: { _id: string; steps: number }) => r._id === date)
    stepsLast30Days.push({ date, steps: found ? found.steps : 0 })
  }

  return NextResponse.json({
    totalUsers,
    activeUsersLast7Days,
    totalStepsToday: todayStepsAgg[0]?.total ?? 0,
    totalStaminaCirculation: staminaCirculation._sum.amount ?? 0,
    pendingSuspiciousSessions: pendingSuspicious,
    stepsLast30Days,
    recentUsers,
  })
}
