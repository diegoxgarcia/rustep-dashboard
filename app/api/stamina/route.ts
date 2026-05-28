import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { TransactionType } from '@prisma/client'

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '20', 10)
  const type = searchParams.get('type') as TransactionType | null

  const where = type ? { type } : {}
  const skip = (page - 1) * limit

  const [entries, total, byType, weeklyData] = await Promise.all([
    prisma.staminaLedger.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.staminaLedger.count({ where }),
    prisma.staminaLedger.groupBy({
      by: ['type'],
      _sum: { amount: true },
      _count: true,
    }),
    prisma.$queryRaw<{ week: string; credited: number; debited: number }[]>`
      SELECT
        TO_CHAR(DATE_TRUNC('week', created_at), 'YYYY-WW') AS week,
        COALESCE(SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END), 0) AS credited,
        COALESCE(ABS(SUM(CASE WHEN amount < 0 THEN amount ELSE 0 END)), 0) AS debited
      FROM stamina_ledger
      WHERE created_at >= NOW() - INTERVAL '8 weeks'
      GROUP BY DATE_TRUNC('week', created_at)
      ORDER BY DATE_TRUNC('week', created_at) ASC
    `,
  ])

  return NextResponse.json({
    data: entries,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    byType,
    weeklyData,
  })
}
