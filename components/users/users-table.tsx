'use client'

import { useState, useEffect, useCallback } from 'react'
import { IUser, PaginatedResponse } from '@/types'
import { formatRelative, getActivityLabel, getStatusColor } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'

export function UsersTable() {
  const [data, setData] = useState<PaginatedResponse<IUser> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [accountStatus, setAccountStatus] = useState('')
  const [activityCategory, setActivityCategory] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' })
      if (search) params.set('search', search)
      if (accountStatus) params.set('accountStatus', accountStatus)
      if (activityCategory) params.set('activityCategory', activityCategory)
      const res = await fetch(`/api/users?${params}`)
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
      const json = await res.json()
      setData(json)
    } catch (err) {
      console.error('Error fetching users:', err)
      setError('No se pudieron cargar los usuarios. Verificá la conexión a la base de datos.')
    } finally {
      setLoading(false)
    }
  }, [page, search, accountStatus, activityCategory])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  async function handleStatusChange(userId: string, newStatus: string) {
    setActionLoading(userId)
    await fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountStatus: newStatus }),
    })
    setActionLoading(null)
    fetchUsers()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2 flex-1">
          <Input
            placeholder="Buscar por nombre o email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setSearch(searchInput)
                setPage(1)
              }
            }}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => { setSearch(searchInput); setPage(1) }}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <Select
          value={accountStatus || 'all_status'}
          onValueChange={(v) => { setAccountStatus(v === 'all_status' ? '' : v); setPage(1) }}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all_status">Todos los estados</SelectItem>
            <SelectItem value="active">Activo</SelectItem>
            <SelectItem value="suspended">Suspendido</SelectItem>
            <SelectItem value="banned">Baneado</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={activityCategory || 'all_cat'}
          onValueChange={(v) => { setActivityCategory(v === 'all_cat' ? '' : v); setPage(1) }}
        >
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all_cat">Todas las categorias</SelectItem>
            <SelectItem value="sedentary">Sedentario</SelectItem>
            <SelectItem value="lightly_active">Levemente activo</SelectItem>
            <SelectItem value="moderately_active">Moderadamente activo</SelectItem>
            <SelectItem value="very_active">Muy activo</SelectItem>
            <SelectItem value="extremely_active">Extremadamente activo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && (
        <div className="p-4 bg-[#FF5A1F]/10 border border-[#FF5A1F]/40 rounded-lg text-[#FF5A1F] text-sm font-exo">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48 text-[#8BA4BE] font-exo">Cargando...</div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-[#1A3A5C]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1A3A5C] bg-[#0D2540]">
                  <th className="text-left py-3 px-4 text-xs font-rajdhani font-semibold text-[#8BA4BE] uppercase tracking-widest">Usuario</th>
                  <th className="text-left py-3 px-4 text-xs font-rajdhani font-semibold text-[#8BA4BE] uppercase tracking-widest">Actividad</th>
                  <th className="text-left py-3 px-4 text-xs font-rajdhani font-semibold text-[#8BA4BE] uppercase tracking-widest">Estado</th>
                  <th className="text-left py-3 px-4 text-xs font-rajdhani font-semibold text-[#8BA4BE] uppercase tracking-widest">Ultimo acceso</th>
                  <th className="text-left py-3 px-4 text-xs font-rajdhani font-semibold text-[#8BA4BE] uppercase tracking-widest">Registro</th>
                  <th className="text-left py-3 px-4 text-xs font-rajdhani font-semibold text-[#8BA4BE] uppercase tracking-widest">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A3A5C]">
                {data?.data.map((user) => (
                  <tr key={user._id} className="bg-[#071A2F] hover:bg-[#0D2540] transition-colors">
                    <td className="py-3 px-4">
                      <Link href={`/users/${user._id}`} className="flex items-center gap-3 hover:text-[#FF5A1F] transition-colors">
                        {user.photoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={user.photoUrl} alt="" className="h-9 w-9 rounded-full border border-[#1A3A5C]" />
                        ) : (
                          <div className="h-9 w-9 rounded-full bg-[#FF5A1F]/20 border border-[#FF5A1F]/40 flex items-center justify-center text-[#FF5A1F] text-sm font-bold font-bebas">
                            {user.displayName[0]}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-white font-exo">{user.displayName}</p>
                          <p className="text-xs text-[#8BA4BE] font-exo">{user.email}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-[#8BA4BE] font-exo text-xs">
                      {getActivityLabel(user.activityCategory)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-rajdhani font-semibold tracking-wide ${getStatusColor(user.accountStatus)}`}>
                        {user.accountStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-[#8BA4BE] font-exo">
                      {formatRelative(user.lastActive)}
                    </td>
                    <td className="py-3 px-4 text-xs text-[#8BA4BE] font-exo">
                      {formatRelative(user.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        {user.accountStatus !== 'active' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-7 px-2 text-emerald-400 border-emerald-800/50 hover:bg-emerald-900/40"
                            disabled={actionLoading === user._id}
                            onClick={() => handleStatusChange(user._id, 'active')}
                          >
                            Activar
                          </Button>
                        )}
                        {user.accountStatus !== 'suspended' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-7 px-2 text-[#FF5A1F] border-[#FF5A1F]/30 hover:bg-[#FF5A1F]/20"
                            disabled={actionLoading === user._id}
                            onClick={() => handleStatusChange(user._id, 'suspended')}
                          >
                            Suspender
                          </Button>
                        )}
                        {user.accountStatus !== 'banned' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-7 px-2 text-red-400 border-red-800/50 hover:bg-red-900/40"
                            disabled={actionLoading === user._id}
                            onClick={() => handleStatusChange(user._id, 'banned')}
                          >
                            Banear
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data && (
            <div className="flex items-center justify-between text-sm text-[#8BA4BE] font-exo">
              <span>
                {data.total} usuario{data.total !== 1 ? 's' : ''} encontrado{data.total !== 1 ? 's' : ''}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span>
                  Pagina {page} de {data.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= data.totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
