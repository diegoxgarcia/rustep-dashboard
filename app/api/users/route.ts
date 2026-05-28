import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import connectToMongoDB from '@/lib/mongodb'
import User from '@/lib/models/user.model'

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectToMongoDB()

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '20', 10)
  const search = searchParams.get('search') || ''
  const accountStatus = searchParams.get('accountStatus') || ''
  const activityCategory = searchParams.get('activityCategory') || ''

  const filter: Record<string, unknown> = {}

  if (search) {
    filter.$or = [
      { displayName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ]
  }

  if (accountStatus) {
    filter.accountStatus = accountStatus
  }

  if (activityCategory) {
    filter.activityCategory = activityCategory
  }

  const skip = (page - 1) * limit
  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments(filter),
  ])

  return NextResponse.json({
    data: users,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  })
}
