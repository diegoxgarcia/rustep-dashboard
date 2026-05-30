'use client'

import { useState } from 'react'
import { IFraudFlag, IUser } from '@/types'
import { getRiskLevel, getStatusColor, formatRelative, formatDateTime } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

interface FraudFlagWithUser extends Omit<IFraudFlag, 'userId'> {
  userId: IUser
}

interface FraudTableProps {
  flags: FraudFlagWithUser[]
  onRefresh: () => void
}

export function FraudTable({ flags, onRefresh }: FraudTableProps) {
  const [selectedFlag, setSelectedFlag] = useState<FraudFlagWithUser | null>(null)
  const [reviewStatus, setReviewStatus] = useState('')
  const [reviewNotes, setReviewNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleReview() {
    if (!selectedFlag || !reviewStatus) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/fraud', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flagId: selectedFlag._id,
          reviewStatus,
          reviewNotes,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error actualizando revision')
      setSelectedFlag(null)
      onRefresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1E1E30] bg-[#12121E]">
              <th className="text-left py-3 px-4 text-xs font-rajdhani font-semibold text-[#8BA4BE] uppercase tracking-widest">Usuario</th>
              <th className="text-left py-3 px-4 text-xs font-rajdhani font-semibold text-[#8BA4BE] uppercase tracking-widest">Riesgo</th>
              <th className="text-left py-3 px-4 text-xs font-rajdhani font-semibold text-[#8BA4BE] uppercase tracking-widest">Sesiones</th>
              <th className="text-left py-3 px-4 text-xs font-rajdhani font-semibold text-[#8BA4BE] uppercase tracking-widest">Score promedio</th>
              <th className="text-left py-3 px-4 text-xs font-rajdhani font-semibold text-[#8BA4BE] uppercase tracking-widest">Estado revision</th>
              <th className="text-left py-3 px-4 text-xs font-rajdhani font-semibold text-[#8BA4BE] uppercase tracking-widest">Ultima actividad sospechosa</th>
              <th className="text-left py-3 px-4 text-xs font-rajdhani font-semibold text-[#8BA4BE] uppercase tracking-widest">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E1E30]">
            {flags.map((flag) => {
              const risk = getRiskLevel(flag)
              return (
                <tr key={flag._id} className="bg-[#0A0A12] hover:bg-[#12121E] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {flag.userId?.photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={flag.userId.photoUrl} alt="" className="h-8 w-8 rounded-full border border-[#1E1E30]" />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-red-900/40 border border-red-800/50 flex items-center justify-center text-red-400 text-xs font-bold font-bebas">
                          {(flag.userId?.displayName || 'U')[0]}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-white font-exo">{flag.userId?.displayName}</p>
                        <p className="text-xs text-[#8BA4BE] font-exo">{flag.userId?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-rajdhani font-semibold tracking-wide ${risk.color}`}>
                      {risk.label}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-xs space-y-0.5 font-exo">
                      <p className="text-white">Total: <span className="font-medium">{flag.totalSessions}</span></p>
                      <p className="text-[#FF5A1F]">Sospechosas: {flag.suspiciousSessions}</p>
                      <p className="text-red-400">Bloqueadas: {flag.blockedSessions}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-mono text-sm font-exo ${flag.avgConfidenceScore < 0.5 ? 'text-red-400' : 'text-[#FF5A1F]'}`}>
                      {(flag.avgConfidenceScore * 100).toFixed(0)}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-rajdhani font-semibold tracking-wide ${getStatusColor(flag.reviewStatus)}`}>
                      {flag.reviewStatus.replace('_', ' ')}
                    </span>
                    {flag.staminaFrozen && (
                      <span className="ml-1 text-xs text-red-400 font-exo">(stamina congelada)</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-xs text-[#8BA4BE] font-exo">
                    {flag.lastSuspiciousAt ? formatRelative(flag.lastSuspiciousAt) : '-'}
                  </td>
                  <td className="py-3 px-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedFlag(flag)
                        setReviewStatus(flag.reviewStatus)
                        setReviewNotes(flag.reviewNotes || '')
                        setError(null)
                      }}
                    >
                      Revisar
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Dialog open={!!selectedFlag} onOpenChange={() => setSelectedFlag(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revisar caso de fraude</DialogTitle>
          </DialogHeader>
          {selectedFlag && (
            <div className="space-y-4">
              <div className="p-3 bg-[#0A0A12] border border-[#1E1E30] rounded-md text-sm">
                <p className="font-medium text-white font-exo">{selectedFlag.userId?.displayName}</p>
                <p className="text-[#8BA4BE] font-exo text-xs mt-0.5">{selectedFlag.userId?.email}</p>
                {selectedFlag.reviewedBy && (
                  <p className="text-xs text-[#8BA4BE] font-exo mt-2">
                    Revisado por {selectedFlag.reviewedBy} el{' '}
                    {selectedFlag.reviewedAt ? formatDateTime(selectedFlag.reviewedAt) : ''}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#8BA4BE] font-exo mb-1">
                  Estado de revision
                </label>
                <Select value={reviewStatus} onValueChange={setReviewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="under_review">En revision</SelectItem>
                    <SelectItem value="cleared">Limpio</SelectItem>
                    <SelectItem value="confirmed_fraud">Fraude confirmado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#8BA4BE] font-exo mb-1">
                  Notas de revision
                </label>
                <Textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Agregar notas sobre este caso..."
                  rows={3}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-900/30 border border-red-800/50 rounded-md text-red-400 text-sm font-exo">
                  {error}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedFlag(null)}>
              Cancelar
            </Button>
            <Button onClick={handleReview} disabled={loading || !reviewStatus}>
              {loading ? 'Guardando...' : 'Guardar revision'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
