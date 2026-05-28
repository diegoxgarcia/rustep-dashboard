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

export default function RankingsPage() {
  const now = new Date()
  const [data, setData] = useState<RankingEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('WEEKLY_STEPS')
  const [week, setWeek] = useState(String(getWeekNumber(now)))
  const [year, setYear] = useState(String(now.getFullYear()))

  const fetchRankings = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ category, week, year })
    const res = await fetch(`/api/rankings?${params}`)
    const json = await res.json()
    setData(json.data || [])
    setLoading(false)
  }, [category, week, year])

  useEffect(() => { fetchRankings() }, [fetchRankings])

  const medalColors = ['text-yellow-500', 'text-gray-400', 'text-amber-600']

  return (
    <div>
      <Header title="Rankings" description="Clasificaciones semanales y totales" />
      <div className="p-6 space-y-4">
        <div className="flex flex-wrap gap-3">
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
            <label className="text-sm text-gray-600">Semana:</label>
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
            <label className="text-sm text-gray-600">Ano:</label>
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

        {loading ? (
          <div className="flex items-center justify-center h-48 text-gray-400">Cargando...</div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <Trophy className="h-12 w-12 mb-3 opacity-30" />
            <p>No hay datos de ranking para este periodo</p>
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Pos.</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Puntuacion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map((entry, idx) => (
                  <tr key={entry.id} className={`hover:bg-gray-50 ${idx < 3 ? 'bg-amber-50/30' : ''}`}>
                    <td className="py-3 px-4">
                      <span className={`font-bold text-lg ${idx < 3 ? medalColors[idx] : 'text-gray-400'}`}>
                        #{entry.rank || idx + 1}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {entry.user ? (
                        <div className="flex items-center gap-3">
                          {entry.user.photoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={entry.user.photoUrl} alt="" className="h-8 w-8 rounded-full" />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xs font-medium">
                              {entry.user.displayName[0]}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{entry.user.displayName}</p>
                            <p className="text-xs text-gray-500">{entry.user.email}</p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs font-mono">{entry.userId}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-bold text-gray-900">{formatNumber(entry.score)}</span>
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
