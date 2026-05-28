import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import connectToMongoDB from '@/lib/mongodb'
import User from '@/lib/models/user.model'
import StepsLog from '@/lib/models/steps-log.model'
import FraudFlag from '@/lib/models/fraud-flag.model'
import prisma from '@/lib/prisma'
import mongoose from 'mongoose'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectToMongoDB()

  const { id } = params

  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
  }

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
      { $match: { userId: new mongoose.Types.ObjectId(id), confidenceStatus: { $ne: 'blocked' } } },
      { $group: { _id: null, totalSteps: { $sum: '$stepsCount' }, totalSessions: { $sum: 1 } } },
    ]),
  ])

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const staminaAgg = await prisma.staminaLedger.aggregate({
    where: { userId: id },
    _sum: { amount: true },
  })

  return NextResponse.json({
    user,
    stepsLogs,
    fraudFlag,
    staminaTransactions,
    stats: {
      totalSteps: stepsAgg[0]?.totalSteps ?? 0,
      totalSessions: stepsAgg[0]?.totalSessions ?? 0,
      totalStamina: staminaAgg._sum.amount ?? 0,
    },
  })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectToMongoDB()

  const { id } = params
  const body = await request.json()
  const { accountStatus } = body

  if (!['active', 'suspended', 'banned'].includes(accountStatus)) {
    return NextResponse.json({ error: 'Invalid account status' }, { status: 400 })
  }

  const user = await User.findByIdAndUpdate(
    id,
    { accountStatus },
    { new: true }
  ).lean()

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({ user })
}
