'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap } from 'lucide-react'

export function SeedStaminaForm() {
  const [userId, setUserId] = useState('')
  const [amount, setAmount] = useState('500')
  const [type, setType] = useState('ADMIN_ADJUSTMENT')
  const [description, setDescription] = useState('')
  const [calculateFromSteps, setCalculateFromSteps] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ ledger?: { id: string; amount: number; type: string }; totalStamina?: number; sessionsProcessed?: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/seed/stamina', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId.trim(),
          amount: parseInt(amount, 10),
          type,
          description: description || undefined,
          calculateFromSteps,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error aplicando transaccion')
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
          <Zap className="h-5 w-5 text-green-600" />
          Gestionar Stamina
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User ID (MongoDB ObjectId)
            </label>
            <Input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="60d5ecb74f421b2f4c4e4d3a"
              required
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={calculateFromSteps}
              onChange={(e) => setCalculateFromSteps(e.target.checked)}
              className="rounded border-gray-300 text-green-600"
            />
            Calcular y acreditar stamina desde pasos existentes
          </label>

          {!calculateFromSteps && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cantidad
                  </label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo
                  </label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN_ADJUSTMENT">Admin Adjustment</SelectItem>
                      <SelectItem value="STEPS_CREDIT">Steps Credit</SelectItem>
                      <SelectItem value="DAILY_BONUS">Daily Bonus</SelectItem>
                      <SelectItem value="WEEKLY_BONUS">Weekly Bonus</SelectItem>
                      <SelectItem value="FRIEND_BONUS">Friend Bonus</SelectItem>
                      <SelectItem value="REWARD_DEBIT">Reward Debit (negativo)</SelectItem>
                      <SelectItem value="REFUND">Refund</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripcion (opcional)
                </label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descripcion de la transaccion"
                />
              </div>
            </>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading
              ? 'Procesando...'
              : calculateFromSteps
              ? 'Calcular y acreditar stamina'
              : 'Aplicar transaccion'}
          </Button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}
        {result && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
            {result.totalStamina !== undefined ? (
              <>Acreditados {result.totalStamina} stamina de {result.sessionsProcessed} sesiones</>
            ) : (
              <>Transaccion creada: {result.ledger?.amount} stamina ({result.ledger?.type})</>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
