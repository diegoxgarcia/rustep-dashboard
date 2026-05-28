'use client'

import { useState, useEffect, useCallback } from 'react'
import { Header } from '@/components/layout/header'
import { StaminaChart } from '@/components/dashboard/stamina-chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { formatDateTime, formatNumber } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { IStaminaLedger } from '@/types'

interface StaminaData {
  data: IStaminaLedger[]
  total: number
  totalPages: number
  page: number
  byType: { type: string; _sum: { amount: number }; _count: number }[]
  weeklyData: { week: string; credited: number; debited: number }[]
}

const typeLabels: Record<string, string> = {
  STEPS_CREDIT: 'Pasos',
  DAILY_BONUS: 'Bonus diario',
  WEEKLY_BONUS: 'Bonus semanal',
  FRIEND_BONUS: 'Bonus amigos',
  REWARD_DEBIT: 'Canjes',
  ADMIN_ADJUSTMENT: 'Ajuste admin',
  REFUND: 'Reembolso',
}

export default function StaminaPage() {
  const [data, setData] = useState<StaminaData | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [type, setType] = useState('')

  const fetchStamina = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '20' })
    if (type) params.set('type', type)
    const res = await fetch(`/api/stamina?${params}`)
    const json = await res.json()
    setData(json)
    setLoading(false)
  }, [page, type])

  useEffect(() => { fetchStamina() }, [fetchStamina])

  return (
    <div>
      <Header title="Stamina" description="Ledger de todas las transacciones de stamina" />
      <div className="p-6 space-y-6">
        {data?.byType && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {data.byType.map((entry) => (
              <Card key={entry.type}>
                <CardContent className="p-4">
                  <p className="text-xs text-gray-500 mb-1">{typeLabels[entry.type] || entry.type}</p>
                  <p className={`text-xl font-bold ${(entry._sum.amount || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {(entry._sum.amount || 0) >= 0 ? '+' : ''}{formatNumber(entry._sum.amount || 0)}
                  </p>
                  <p className="text-xs text-gray-400">{entry._count} transacciones</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {data?.weeklyData && data.weeklyData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Stamina emitida vs gastada por semana</CardTitle>
            </CardHeader>
            <CardContent>
              <StaminaChart data={data.weeklyData.map(d => ({
                week: d.week,
                credited: Number(d.credited),
                debited: Number(d.debited),
              }))} />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Transacciones</CardTitle>
              <Select
                value={type || 'all'}
                onValueChange={(v) => { setType(v === 'all' ? '' : v); setPage(1) }}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {Object.entries(typeLabels).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32 text-gray-400">Cargando...</div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                        <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                        <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario ID</th>
                        <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Descripcion</th>
                        <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {data?.data.map((entry) => (
                        <tr key={entry.id} className="hover:bg-gray-50">
                          <td className="py-2 px-3">
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-mono">
                              {entry.type}
                            </span>
                          </td>
                          <td className={`py-2 px-3 font-medium ${entry.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {entry.amount >= 0 ? '+' : ''}{formatNumber(entry.amount)}
                          </td>
                          <td className="py-2 px-3 text-xs text-gray-500 font-mono truncate max-w-[120px]">
                            {entry.userId}
                          </td>
                          <td className="py-2 px-3 text-xs text-gray-500">{entry.description || '-'}</td>
                          <td className="py-2 px-3 text-xs text-gray-500">{formatDateTime(entry.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {data && (
                  <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
                    <span>{data.total} transacciones</span>
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
