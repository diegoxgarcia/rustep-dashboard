import { NextRequest, NextResponse } from 'next/server'
import { auth, isAdmin } from '@/lib/auth'
import connectToMongoDB from '@/lib/mongodb'
import User from '@/lib/models/user.model'
import StepsLog from '@/lib/models/steps-log.model'
import FraudFlag from '@/lib/models/fraud-flag.model'
import mongoose from 'mongoose'

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomFloat(min: number, max: number): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(4))
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
  }

  await connectToMongoDB()

  const body = await request.json()
  const {
    userId,
    count = 10,
    minSteps = 1000,
    maxSteps = 15000,
    dateFrom,
    dateTo,
    includeSuspicious = false,
  } = body

  let userIds: string[] = []

  if (userId === 'all' || !userId) {
    const users = await User.find({ email: /@test\.com$/ }).select('_id').lean()
    userIds = users.map((u) => String(u._id))
  } else {
    userIds = [userId]
  }

  if (userIds.length === 0) {
    return NextResponse.json({ error: 'No test users found' }, { status: 400 })
  }

  const fromDate = dateFrom ? new Date(dateFrom) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const toDate = dateTo ? new Date(dateTo) : new Date()

  const created: unknown[] = []
  const sessionCount = Math.min(parseInt(String(count), 10), 500)

  for (let i = 0; i < sessionCount; i++) {
    const uid = userIds[Math.floor(Math.random() * userIds.length)]
    const isSuspicious = includeSuspicious && Math.random() < 0.2

    const startTime = new Date(
      fromDate.getTime() + Math.random() * (toDate.getTime() - fromDate.getTime())
    )
    const durationMinutes = randomBetween(10, 90)
    const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000)
    const stepsCount = randomBetween(parseInt(String(minSteps), 10), parseInt(String(maxSteps), 10))
    const confidenceScore = isSuspicious ? randomFloat(0.1, 0.5) : randomFloat(0.7, 1.0)
    const confidenceStatus = confidenceScore < 0.4 ? 'blocked' : confidenceScore < 0.7 ? 'suspicious' : 'valid'
    const avgSpeedKmh = parseFloat(((stepsCount * 0.0008) / (durationMinutes / 60)).toFixed(2))
    const staminaCredited = confidenceStatus === 'valid' ? Math.floor(stepsCount / 100) : 0

    const log = await StepsLog.create({
      userId: new mongoose.Types.ObjectId(uid),
      stepsCount,
      startTime,
      endTime,
      sessionDurationMinutes: durationMinutes,
      confidenceScore,
      confidenceStatus,
      gpsVarianceMeters: randomBetween(2, 50),
      avgSpeedKmh,
      staminaCredited,
      staminaCreditedAt: staminaCredited > 0 ? endTime : undefined,
    })

    created.push(log)

    if (confidenceStatus !== 'valid') {
      await FraudFlag.findOneAndUpdate(
        { userId: uid },
        {
          $inc: {
            totalSessions: 1,
            suspiciousSessions: confidenceStatus === 'suspicious' ? 1 : 0,
            blockedSessions: confidenceStatus === 'blocked' ? 1 : 0,
          },
          $set: { lastSuspiciousAt: new Date() },
        },
        { upsert: true, new: true }
      )
    }
  }

  return NextResponse.json({ created: created.length })
}
