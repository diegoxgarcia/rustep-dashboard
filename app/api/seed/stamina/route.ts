import { NextRequest, NextResponse } from 'next/server'
import { auth, isAdmin } from '@/lib/auth'
import prisma from '@/lib/prisma'
import connectToMongoDB from '@/lib/mongodb'
import StepsLog from '@/lib/models/steps-log.model'
import { TransactionType } from '@prisma/client'
import mongoose from 'mongoose'

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
  }

  const body = await request.json()
  const { userId, amount, type, description, calculateFromSteps } = body

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  }

  if (calculateFromSteps) {
    await connectToMongoDB()
    const logs = await StepsLog.find({
      userId: new mongoose.Types.ObjectId(userId),
      confidenceStatus: 'valid',
      staminaCredited: { $exists: true, $gt: 0 },
    }).lean()

    const totalStamina = logs.reduce((acc, l) => acc + (l.staminaCredited || 0), 0)

    if (totalStamina === 0) {
      return NextResponse.json({ error: 'No stamina to credit from steps' }, { status: 400 })
    }

    const ledger = await prisma.staminaLedger.create({
      data: {
        userId,
        amount: totalStamina,
        type: 'STEPS_CREDIT',
        description: `Stamina calculated from ${logs.length} valid sessions`,
      },
    })

    return NextResponse.json({ ledger, totalStamina, sessionsProcessed: logs.length })
  }

  const validTypes: TransactionType[] = [
    'STEPS_CREDIT', 'DAILY_BONUS', 'WEEKLY_BONUS', 'FRIEND_BONUS',
    'REWARD_DEBIT', 'ADMIN_ADJUSTMENT', 'REFUND',
  ]

  if (!validTypes.includes(type)) {
    return NextResponse.json({ error: 'Invalid transaction type' }, { status: 400 })
  }

  if (!amount || isNaN(parseInt(String(amount), 10))) {
    return NextResponse.json({ error: 'amount must be a number' }, { status: 400 })
  }

  const ledger = await prisma.staminaLedger.create({
    data: {
      userId,
      amount: parseInt(String(amount), 10),
      type,
      description: description || `Manual ${type} by admin`,
    },
  })

  return NextResponse.json({ ledger })
}
