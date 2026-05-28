import { NextRequest, NextResponse } from 'next/server'
import { auth, isAdmin } from '@/lib/auth'
import connectToMongoDB from '@/lib/mongodb'
import User from '@/lib/models/user.model'
import prisma from '@/lib/prisma'
import { GroupPrivacy, MemberRole } from '@prisma/client'

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
  }

  await connectToMongoDB()

  const body = await request.json()
  const {
    name,
    description,
    privacy = 'PUBLIC',
    memberCount = 5,
  } = body

  if (!name) {
    return NextResponse.json({ error: 'Group name is required' }, { status: 400 })
  }

  const testUsers = await User.find({ email: /@test\.com$/ })
    .select('_id')
    .limit(memberCount + 1)
    .lean()

  if (testUsers.length < 1) {
    return NextResponse.json({ error: 'No test users available. Generate users first.' }, { status: 400 })
  }

  const creatorId = String(testUsers[0]._id)

  const group = await prisma.runningGroup.create({
    data: {
      name,
      description: description || `Test running group: ${name}`,
      creatorId,
      privacy: privacy as GroupPrivacy,
      maxMembers: 50,
      isActive: true,
      members: {
        create: testUsers.map((u, idx) => ({
          userId: String(u._id),
          role: idx === 0 ? ('OWNER' as MemberRole) : ('MEMBER' as MemberRole),
          isActive: true,
        })),
      },
    },
    include: { members: true },
  })

  return NextResponse.json({ group, membersAdded: group.members.length })
}
