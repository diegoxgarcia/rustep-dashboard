'use client'

import { useState, useEffect, useCallback } from 'react'
import { Header } from '@/components/layout/header'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { formatNumber } from '@/lib/utils'
import { getWeekNumber } from '@/lib/utils'
import { Trophy } from 'lucide-react'

interface RankingEntry {
  id: string
  userId: string
  score: number
  rank: number
  category: string
  weekNumber: number
  year: number
  user: {
    _id: string
    displayName: string
    email: string
    photoUrl?: string
  } | null
}

const categoryLabels: Record<string, string> = {
  WEEKLY_STEPS: 'Pasos semanales',
  WEEKLY_STAMINA: 'Stamina semanal',
  WEEKLY_SESSIONS: 'Sesiones semanales',
  ALL_TIME_STEPS: 'Pasos totales',
}

const medalColors = [
  'text-yellow-400',
  'text-[#8BA4BE]',
  'text-amber-600',
]

const medalBg = [
  'bg-yellow-400/10 border-yellow-400/30',
  'bg-[#8BA4BE]/10 border-[#8BA4BE]/30',
  'bg-amber-600/10 border-amber-600/30',
]

export default function RankingsPage() {
  const now = new Date()
  const [data, setData] = useState<RankingEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [category, setCategory] = useState('WEEKLY_STEPS')
  const [week, setWeek] = useState(String(getWeekNumber(now)))
  const [year, setYear] = useState(String(now.getFullYear()))

  const fetchRankings = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ category, week, year })
      const res = await fetch(`/api/rankings?${params}`)
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
      const json = await res.json()
      setData(json.data || [])
    } catch (err) {
      console.error('Error fetching rankings:', err)
      setError('No se pudieron cargar los rankings. Verificá la conexión a la base de datos.')
    } finally {
      setLoading(false)
    }
  }, [category, week, year])

  useEffect(() => { fetchRankings() }, [fetchRankings])

  return (
    <div>
      <Header title="Rankings" description="Clasificaciones semanales y totales" />
      <div className="p-6 space-y-4">
        <div className="flex flex-wrap gap-3 items-center">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(categoryLabels).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2 items-center">
            <label className="text-sm text-[#8BA4BE] font-exo">Semana:</label>
            <Input
              type="number"
              min="1"
              max="53"
              value={week}
              onChange={(e) => setWeek(e.target.value)}
              className="w-20"
            />
          </div>
          <div className="flex gap-2 items-center">
            <label className="text-sm text-[#8BA4BE] font-exo">Ano:</label>
            <Input
              type="number"
              min="2024"
              max="2030"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-24"
            />
          </div>
        </div>

        {error && (
          <div className="p-4 bg-[#FF5A1F]/10 border border-[#FF5A1F]/40 rounded-lg text-[#FF5A1F] text-sm font-exo">{error}</div>
        )}
        {loading ? (
          <div className="flex items-center justify-center h-48 text-[#8BA4BE] font-exo">Cargando...</div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-[#8BA4BE]">
            <Trophy className="h-12 w-12 mb-3 opacity-20" />
            <p className="font-exo text-sm">No hay datos de ranking para este periodo</p>
          </div>
        ) : (
          <div className="rounded-lg border border-[#1A3A5C] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1A3A5C] bg-[#0D2540]">
                  <th className="text-left py-3 px-4 text-xs font-rajdhani font-semibold text-[#8BA4BE] uppercase tracking-widest w-16">Pos.</th>
                  <th className="text-left py-3 px-4 text-xs font-rajdhani font-semibold text-[#8BA4BE] uppercase tracking-widest">Usuario</th>
                  <th className="text-right py-3 px-4 text-xs font-rajdhani font-semibold text-[#8BA4BE] uppercase tracking-widest">Puntuacion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A3A5C]">
                {data.map((entry, idx) => (
                  <tr key={entry.id} className={`transition-colors ${idx < 3 ? 'bg-[#0D2540]/50 hover:bg-[#0D2540]' : 'bg-[#071A2F] hover:bg-[#0D2540]'}`}>
                    <td className="py-3 px-4">
                      {idx < 3 ? (
                        <div className={`inline-flex items-center justify-center h-8 w-8 rounded-full border ${medalBg[idx]}`}>
                          <span className={`font-bebas text-base ${medalColors[idx]}`}>
                            {entry.rank || idx + 1}
                          </span>
                        </div>
                      ) : (
                        <span className="font-bebas text-lg text-[#8BA4BE]">#{entry.rank || idx + 1}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {entry.user ? (
                        <div className="flex items-center gap-3">
                          {entry.user.photoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={entry.user.photoUrl} alt="" className="h-8 w-8 rounded-full border border-[#1A3A5C]" />
                          ) : (
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold font-bebas ${
                              idx < 3
                                ? `border ${medalBg[idx]} ${medalColors[idx]}`
                                : 'bg-[#FF5A1F]/20 border border-[#FF5A1F]/40 text-[#FF5A1F]'
                            }`}>
                              {entry.user.displayName[0]}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-white font-exo">{entry.user.displayName}</p>
                            <p className="text-xs text-[#8BA4BE] font-exo">{entry.user.email}</p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-[#8BA4BE] text-xs font-mono">{entry.userId}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`font-bebas text-xl tracking-wider ${idx < 3 ? medalColors[idx] : 'text-white'}`}>
                        {formatNumber(entry.score)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
