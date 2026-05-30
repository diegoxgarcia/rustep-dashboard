'use client'

import { useState, useEffect, useCallback } from 'react'
import { Header } from '@/components/layout/header'
import { IStepsLog, IUser } from '@/types'
import { formatDateTime, formatNumber, getStatusColor } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type StepsLogWithUser = Omit<IStepsLog, 'userId'> & { userId: IUser }

export default function StepsPage() {
  const [data, setData] = useState<{ data: StepsLogWithUser[]; total: number; totalPages: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [confidenceStatus, setConfidenceStatus] = useState('')

  const fetchSteps = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' })
      if (confidenceStatus) params.set('confidenceStatus', confidenceStatus)
      const res = await fetch(`/api/steps?${params}`)
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
      const json = await res.json()
      setData(json)
    } catch (err) {
      console.error('Error fetching steps:', err)
      setError('No se pudieron cargar las sesiones. Verificá la conexión a la base de datos.')
    } finally {
      setLoading(false)
    }
  }, [page, confidenceStatus])

  useEffect(() => { fetchSteps() }, [fetchSteps])

  return (
    <div>
      <Header title="Sesiones de Pasos" description="Todas las sesiones registradas" bannerSrc="/assets/banner-steps.svg" bannerPosition="center center" />
      <div className="p-6 space-y-4">
        <div className="flex gap-3">
          <Select
            value={confidenceStatus || 'all'}
            onValueChange={(v) => { setConfidenceStatus(v === 'all' ? '' : v); setPage(1) }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="valid">Valido</SelectItem>
              <SelectItem value="suspicious">Sospechoso</SelectItem>
              <SelectItem value="blocked">Bloqueado</SelectItem>
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
                    <th className="text-left py-3 px-4 text-xs font-rajdhani font-semibold text-[#8BA4BE] uppercase tracking-widest">Pasos</th>
                    <th className="text-left py-3 px-4 text-xs font-rajdhani font-semibold text-[#8BA4BE] uppercase tracking-widest">Duracion</th>
                    <th className="text-left py-3 px-4 text-xs font-rajdhani font-semibold text-[#8BA4BE] uppercase tracking-widest">Velocidad</th>
                    <th className="text-left py-3 px-4 text-xs font-rajdhani font-semibold text-[#8BA4BE] uppercase tracking-widest">Confianza</th>
                    <th className="text-left py-3 px-4 text-xs font-rajdhani font-semibold text-[#8BA4BE] uppercase tracking-widest">Estado</th>
                    <th className="text-left py-3 px-4 text-xs font-rajdhani font-semibold text-[#8BA4BE] uppercase tracking-widest">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A3A5C]">
                  {data?.data.map((log) => (
                    <tr key={log._id} className="bg-[#071A2F] hover:bg-[#0D2540] transition-colors">
                      <td className="py-3 px-4">
                        {log.userId ? (
                          <div>
                            <p className="font-medium text-white font-exo">{(log.userId as IUser).displayName}</p>
                            <p className="text-xs text-[#8BA4BE] font-exo">{(log.userId as IUser).email}</p>
                          </div>
                        ) : (
                          <span className="text-[#8BA4BE] text-xs font-exo">Usuario eliminado</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium text-white font-exo">{formatNumber(log.stepsCount)}</td>
                      <td className="py-3 px-4 text-[#8BA4BE] font-exo">{log.sessionDurationMinutes} min</td>
                      <td className="py-3 px-4 text-[#8BA4BE] font-exo">{log.avgSpeedKmh?.toFixed(1) || '-'} km/h</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-12 bg-[#1A3A5C] rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${log.confidenceScore >= 0.7 ? 'bg-emerald-400' : log.confidenceScore >= 0.4 ? 'bg-[#FF5A1F]' : 'bg-red-500'}`}
                              style={{ width: `${log.confidenceScore * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-[#8BA4BE] font-exo">{(log.confidenceScore * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-rajdhani font-semibold tracking-wide ${getStatusColor(log.confidenceStatus)}`}>
                          {log.confidenceStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-[#8BA4BE] font-exo">{formatDateTime(log.startTime)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {data && (
              <div className="flex items-center justify-between text-sm text-[#8BA4BE] font-exo">
                <span>{data.total} sesiones encontradas</span>
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
