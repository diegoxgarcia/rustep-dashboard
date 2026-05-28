import { NextRequest, NextResponse } from 'next/server'
import { auth, isAdmin } from '@/lib/auth'
import connectToMongoDB from '@/lib/mongodb'
import User from '@/lib/models/user.model'
import StepsLog from '@/lib/models/steps-log.model'
import FraudFlag from '@/lib/models/fraud-flag.model'
import prisma from '@/lib/prisma'
import mongoose from 'mongoose'

export async function DELETE(request: NextRequest) {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
  }

  await connectToMongoDB()

  const { searchParams } = new URL(request.url)
  const target = searchParams.get('target')

  if (target === 'users') {
    const testUsers = await User.find({ email: /@test\.com$/ }).select('_id').lean()
    const testUserIds = testUsers.map((u) => u._id)
    const testUserStringIds = testUserIds.map((id) => String(id))

    const [deletedSteps, deletedFraud, deletedUsers, deletedStamina] = await Promise.all([
      StepsLog.deleteMany({ userId: { $in: testUserIds } }),
      FraudFlag.deleteMany({ userId: { $in: testUserIds } }),
      User.deleteMany({ email: /@test\.com$/ }),
      prisma.staminaLedger.deleteMany({ where: { userId: { in: testUserStringIds } } }),
    ])

    return NextResponse.json({
      deletedUsers: deletedUsers.deletedCount,
      deletedSteps: deletedSteps.deletedCount,
      deletedFraudFlags: deletedFraud.deletedCount,
      deletedStaminaEntries: deletedStamina.count,
    })
  }

  if (target === 'steps') {
    const testUsers = await User.find({ email: /@test\.com$/ }).select('_id').lean()
    const testUserIds = testUsers.map((u) => u._id)
    const testUserObjectIds = testUserIds.map((id) => new mongoose.Types.ObjectId(String(id)))

    const [deletedSteps, deletedFraud] = await Promise.all([
      StepsLog.deleteMany({ userId: { $in: testUserObjectIds } }),
      FraudFlag.deleteMany({ userId: { $in: testUserObjectIds } }),
    ])

    return NextResponse.json({
      deletedSteps: deletedSteps.deletedCount,
      deletedFraudFlags: deletedFraud.deletedCount,
    })
  }

  return NextResponse.json({ error: 'Invalid target. Use ?target=users or ?target=steps' }, { status: 400 })
}
