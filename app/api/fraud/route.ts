import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import connectToMongoDB from '@/lib/mongodb'
import FraudFlag from '@/lib/models/fraud-flag.model'

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectToMongoDB()

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '20', 10)
  const reviewStatus = searchParams.get('reviewStatus') || ''

  const filter: Record<string, unknown> = {}
  if (reviewStatus) filter.reviewStatus = reviewStatus

  const skip = (page - 1) * limit
  const [flags, total] = await Promise.all([
    FraudFlag.find(filter)
      .populate('userId', 'displayName email photoUrl accountStatus')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    FraudFlag.countDocuments(filter),
  ])

  return NextResponse.json({
    data: flags,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  })
}

export async function PATCH(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectToMongoDB()

  const body = await request.json()
  const { flagId, reviewStatus, reviewNotes } = body

  if (!flagId || !reviewStatus) {
    return NextResponse.json({ error: 'flagId and reviewStatus required' }, { status: 400 })
  }

  const validStatuses = ['pending', 'under_review', 'cleared', 'confirmed_fraud']
  if (!validStatuses.includes(reviewStatus)) {
    return NextResponse.json({ error: 'Invalid reviewStatus' }, { status: 400 })
  }

  const flag = await FraudFlag.findByIdAndUpdate(
    flagId,
    {
      reviewStatus,
      reviewNotes: reviewNotes || undefined,
      reviewedBy: session.user?.email,
      reviewedAt: new Date(),
    },
    { new: true }
  ).populate('userId', 'displayName email photoUrl').lean()

  if (!flag) {
    return NextResponse.json({ error: 'Fraud flag not found' }, { status: 404 })
  }

  return NextResponse.json({ flag })
}
