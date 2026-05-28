'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users } from 'lucide-react'

export function SeedUsersForm() {
  const [count, setCount] = useState('10')
  const [activityCategory, setActivityCategory] = useState('random')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ created: number; users: { displayName: string; email: string }[] } | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/seed/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          count: parseInt(count, 10),
          activityCategory: activityCategory === 'random' ? null : activityCategory,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error generando usuarios')
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
          <Users className="h-5 w-5 text-green-600" />
          Generar usuarios de prueba
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad (1-100)
              </label>
              <Input
                type="number"
                min="1"
                max="100"
                value={count}
                onChange={(e) => setCount(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria de actividad
              </label>
              <Select value={activityCategory} onValueChange={setActivityCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="random">Aleatoria</SelectItem>
                  <SelectItem value="sedentary">Sedentario</SelectItem>
                  <SelectItem value="lightly_active">Levemente activo</SelectItem>
                  <SelectItem value="moderately_active">Moderadamente activo</SelectItem>
                  <SelectItem value="very_active">Muy activo</SelectItem>
                  <SelectItem value="extremely_active">Extremadamente activo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Generando...' : `Generar ${count} usuario${parseInt(count) !== 1 ? 's' : ''}`}
          </Button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-4">
            <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm mb-3">
              {result.created} usuarios creados exitosamente
            </div>
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md">
              <table className="w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-2 font-medium text-gray-600">Nombre</th>
                    <th className="text-left p-2 font-medium text-gray-600">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {result.users.map((u, i) => (
                    <tr key={i}>
                      <td className="p-2">{u.displayName}</td>
                      <td className="p-2 text-gray-500">{u.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
