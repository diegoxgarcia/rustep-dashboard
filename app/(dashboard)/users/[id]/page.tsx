import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { UserDetail } from '@/components/users/user-detail'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import connectToMongoDB from '@/lib/mongodb'
import prisma from '@/lib/prisma'
import User from '@/lib/models/user.model'
import StepsLog from '@/lib/models/steps-log.model'
import FraudFlag from '@/lib/models/fraud-flag.model'
import mongoose from 'mongoose'

interface UserPageProps {
  params: { id: string }
}

async function getUserDetail(id: string) {
  try {
    if (!mongoose.isValidObjectId(id)) return null

    await connectToMongoDB()

    const [user, stepsLogs, fraudFlag, staminaTransactions, stepsAgg] = await Promise.all([
      User.findById(id).lean(),
      StepsLog.find({ userId: id }).sort({ createdAt: -1 }).limit(20).lean(),
      FraudFlag.findOne({ userId: id }).lean(),
      prisma.staminaLedger.findMany({
        where: { userId: id },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      StepsLog.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(id),
            confidenceStatus: { $ne: 'blocked' },
          },
        },
        { $group: { _id: null, totalSteps: { $sum: '$stepsCount' }, totalSessions: { $sum: 1 } } },
      ]),
    ])

    if (!user) return null

    const staminaAgg = await prisma.staminaLedger.aggregate({
      where: { userId: id },
      _sum: { amount: true },
    })

    return {
      user,
      stepsLogs,
      fraudFlag,
      staminaTransactions,
      stats: {
        totalSteps: stepsAgg[0]?.totalSteps ?? 0,
        totalSessions: stepsAgg[0]?.totalSessions ?? 0,
        totalStamina: staminaAgg._sum.amount ?? 0,
      },
    }
  } catch {
    return null
  }
}

export default async function UserDetailPage({ params }: UserPageProps) {
  const data = await getUserDetail(params.id)

  if (!data) notFound()

  return (
    <div>
      <Header title={data.user.displayName} description="Detalle del usuario" />
      <div className="p-6 space-y-4">
        <Link
          href="/users"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
        >
          <ChevronLeft className="h-4 w-4" />
          Volver a usuarios
        </Link>
        <UserDetail
          userId={params.id}
          user={data.user}
          stepsLogs={data.stepsLogs}
          fraudFlag={data.fraudFlag}
          staminaTransactions={data.staminaTransactions}
          stats={data.stats}
        />
      </div>
    </div>
  )
}
