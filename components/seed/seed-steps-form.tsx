'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Footprints } from 'lucide-react'
import { format, subDays } from 'date-fns'

export function SeedStepsForm() {
  const [userId, setUserId] = useState('all')
  const [count, setCount] = useState('50')
  const [minSteps, setMinSteps] = useState('1000')
  const [maxSteps, setMaxSteps] = useState('15000')
  const [dateFrom, setDateFrom] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'))
  const [dateTo, setDateTo] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [includeSuspicious, setIncludeSuspicious] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ created: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/seed/steps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId.trim() || 'all',
          count: parseInt(count, 10),
          minSteps: parseInt(minSteps, 10),
          maxSteps: parseInt(maxSteps, 10),
          dateFrom,
          dateTo,
          includeSuspicious,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error generando sesiones')
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Footprints className="h-5 w-5 text-green-600" />
          Generar sesiones de pasos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User ID (o &quot;all&quot; para todos los usuarios de prueba)
            </label>
            <Input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="all"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad (max 500)
              </label>
              <Input
                type="number"
                min="1"
                max="500"
                value={count}
                onChange={(e) => setCount(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pasos minimos
              </label>
              <Input
                type="number"
                min="100"
                value={minSteps}
                onChange={(e) => setMinSteps(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pasos maximos
              </label>
              <Input
                type="number"
                max="100000"
                value={maxSteps}
                onChange={(e) => setMaxSteps(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={includeSuspicious}
              onChange={(e) => setIncludeSuspicious(e.target.checked)}
              className="rounded border-gray-300 text-green-600"
            />
            Incluir sesiones sospechosas (~20% con score bajo)
          </label>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Generando...' : `Generar ${count} sesiones`}
          </Button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}
        {result && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
            {result.created} sesiones creadas exitosamente
          </div>
        )}
      </CardContent>
    </Card>
  )
}
