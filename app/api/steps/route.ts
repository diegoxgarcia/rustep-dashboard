import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import connectToMongoDB from '@/lib/mongodb'
import StepsLog from '@/lib/models/steps-log.model'

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectToMongoDB()

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '20', 10)
  const confidenceStatus = searchParams.get('confidenceStatus') || ''
  const userId = searchParams.get('userId') || ''

  const filter: Record<string, unknown> = {}
  if (confidenceStatus) filter.confidenceStatus = confidenceStatus
  if (userId) filter.userId = userId

  const skip = (page - 1) * limit
  const [logs, total] = await Promise.all([
    StepsLog.find(filter)
      .populate('userId', 'displayName email photoUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    StepsLog.countDocuments(filter),
  ])

  return NextResponse.json({
    data: logs,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  })
}
