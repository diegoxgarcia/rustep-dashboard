'use client'

import { useState, useEffect, useCallback } from 'react'
import { Header } from '@/components/layout/header'
import { FraudTable } from '@/components/fraud/fraud-table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { IFraudFlag, IUser } from '@/types'

type FraudFlagWithUser = Omit<IFraudFlag, 'userId'> & { userId: IUser }

interface FraudData {
  data: FraudFlagWithUser[]
  total: number
  totalPages: number
}

export default function FraudPage() {
  const [data, setData] = useState<FraudData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [reviewStatus, setReviewStatus] = useState('')

  const fetchFraud = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' })
      if (reviewStatus) params.set('reviewStatus', reviewStatus)
      const res = await fetch(`/api/fraud?${params}`)
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
      const json = await res.json()
      setData(json)
    } catch (err) {
      console.error('Error fetching fraud flags:', err)
      setError('No se pudieron cargar los casos de fraude. Verificá la conexión a la base de datos.')
    } finally {
      setLoading(false)
    }
  }, [page, reviewStatus])

  useEffect(() => { fetchFraud() }, [fetchFraud])

  return (
    <div>
      <Header title="Fraude" description="Usuarios con actividad sospechosa detectada" />
      <div className="p-6 space-y-4">
        <div className="flex gap-3">
          <Select
            value={reviewStatus || 'all'}
            onValueChange={(v) => { setReviewStatus(v === 'all' ? '' : v); setPage(1) }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Estado de revision" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="pending">Pendiente</SelectItem>
              <SelectItem value="under_review">En revision</SelectItem>
              <SelectItem value="cleared">Limpio</SelectItem>
              <SelectItem value="confirmed_fraud">Fraude confirmado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
        )}
        {loading ? (
          <div className="flex items-center justify-center h-48 text-gray-400">Cargando...</div>
        ) : (
          <>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <FraudTable flags={data?.data || []} onRefresh={fetchFraud} />
            </div>
            {data && (
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{data.total} casos encontrados</span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page <= 1}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span>Pagina {page} de {data.totalPages}</span>
                  <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page >= data.totalPages}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
