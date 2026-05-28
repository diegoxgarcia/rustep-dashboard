import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { UserDetail } from '@/components/users/user-detail'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

interface UserPageProps {
  params: { id: string }
}

async function getUserDetail(id: string) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3001'
    const res = await fetch(`${baseUrl}/api/users/${id}`, { cache: 'no-store' })
    if (res.status === 404) return null
    if (!res.ok) throw new Error('Failed to fetch user')
    return res.json()
  } catch {
    return null
  }
}

export default async function UserDetailPage({ params }: UserPageProps) {
  const data = await getUserDetail(params.id)

  if (!data) notFound()

  return (
    <div>
      <Header title={data.user.displayName} description="Detalle del usuario" />
      <div className="p-6 space-y-4">
        <Link
          href="/users"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
        >
          <ChevronLeft className="h-4 w-4" />
          Volver a usuarios
        </Link>
        <UserDetail
          userId={params.id}
          user={data.user}
          stepsLogs={data.stepsLogs}
          fraudFlag={data.fraudFlag}
          staminaTransactions={data.staminaTransactions}
          stats={data.stats}
        />
      </div>
    </div>
  )
}
