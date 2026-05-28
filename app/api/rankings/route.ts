import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import connectToMongoDB from '@/lib/mongodb'
import User from '@/lib/models/user.model'
import { RankingCategory } from '@prisma/client'
import { getWeekNumber } from '@/lib/utils'

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const now = new Date()
  const week = parseInt(searchParams.get('week') || String(getWeekNumber(now)), 10)
  const year = parseInt(searchParams.get('year') || String(now.getFullYear()), 10)
  const category = (searchParams.get('category') || 'WEEKLY_STEPS') as RankingCategory

  const rankings = await prisma.ranking.findMany({
    where: { weekNumber: week, year, category },
    orderBy: { score: 'desc' },
    take: 50,
  })

  await connectToMongoDB()

  const userIds = rankings.map((r) => r.userId)
  const users = await User.find({ _id: { $in: userIds } })
    .select('displayName email photoUrl')
    .lean()

  const usersMap = new Map(users.map((u) => [String(u._id), u]))

  const enriched = rankings.map((r, idx) => ({
    ...r,
    rank: idx + 1,
    user: usersMap.get(r.userId) || null,
  }))

  return NextResponse.json({ data: enriched, week, year, category })
}
