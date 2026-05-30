'use client'

import { useState } from 'react'
import { IUser, IStepsLog, IFraudFlag, IStaminaLedger } from '@/types'
import { formatDateTime, formatNumber, getActivityLabel, getStatusColor, getRiskLevel } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Footprints, Zap, TrendingUp, Calendar, AlertTriangle } from 'lucide-react'

interface UserDetailProps {
  userId: string
  user: IUser
  stepsLogs: IStepsLog[]
  fraudFlag: IFraudFlag | null
  staminaTransactions: IStaminaLedger[]
  stats: { totalSteps: number; totalSessions: number; totalStamina: number }
}

export function UserDetail({ user, stepsLogs, fraudFlag, staminaTransactions, stats }: UserDetailProps) {
  const [accountStatus, setAccountStatus] = useState(user.accountStatus)
  const [loading, setLoading] = useState(false)

  async function handleStatusChange(newStatus: string) {
    setLoading(true)
    await fetch(`/api/users/${user._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountStatus: newStatus }),
    })
    setAccountStatus(newStatus as typeof user.accountStatus)
    setLoading(false)
  }

  const bestWeek = user.weeklyStepsHistory?.reduce(
    (best, w) => (w.totalSteps > (best?.totalSteps || 0) ? w : best),
    null as typeof user.weeklyStepsHistory[0] | null
  )

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {user.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.photoUrl} alt="" className="h-16 w-16 rounded-full border-2 border-[#1E1E30]" />
          ) : (
            <div className="h-16 w-16 rounded-full bg-[#FF5A1F]/20 border-2 border-[#FF5A1F]/40 flex items-center justify-center text-[#FF5A1F] text-2xl font-bold font-bebas">
              {user.displayName[0]}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bebas tracking-wider text-white">{user.displayName}</h1>
            <p className="text-[#8BA4BE] font-exo text-sm">{user.email}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-rajdhani font-semibold tracking-wide ${getStatusColor(accountStatus)}`}>
                {accountStatus}
              </span>
              <span className="text-xs text-[#8BA4BE] font-exo">{getActivityLabel(user.activityCategory)}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {accountStatus !== 'active' && (
            <Button
              variant="outline"
              size="sm"
              disabled={loading}
              onClick={() => handleStatusChange('active')}
              className="text-emerald-400 border-emerald-800/50 hover:bg-emerald-900/40"
            >
              Activar
            </Button>
          )}
          {accountStatus !== 'suspended' && (
            <Button
              variant="outline"
              size="sm"
              className="text-[#FF5A1F] border-[#FF5A1F]/30 hover:bg-[#FF5A1F]/20"
              disabled={loading}
              onClick={() => handleStatusChange('suspended')}
            >
              Suspender
            </Button>
          )}
          {accountStatus !== 'banned' && (
            <Button
              variant="destructive"
              size="sm"
              disabled={loading}
              onClick={() => handleStatusChange('banned')}
            >
              Banear
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#FF5A1F]/15 border border-[#FF5A1F]/30 flex items-center justify-center">
              <Footprints className="h-5 w-5 text-[#FF5A1F]" />
            </div>
            <div>
              <p className="text-xs text-[#8BA4BE] font-rajdhani uppercase tracking-wide">Total pasos</p>
              <p className="text-xl font-bebas text-white tracking-wide">{formatNumber(stats.totalSteps)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#00C2FF]/15 border border-[#00C2FF]/30 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-[#00C2FF]" />
            </div>
            <div>
              <p className="text-xs text-[#8BA4BE] font-rajdhani uppercase tracking-wide">Sesiones</p>
              <p className="text-xl font-bebas text-[#00C2FF] tracking-wide">{formatNumber(stats.totalSessions)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#FF5A1F]/15 border border-[#FF5A1F]/30 flex items-center justify-center">
              <Zap className="h-5 w-5 text-[#FF5A1F]" />
            </div>
            <div>
              <p className="text-xs text-[#8BA4BE] font-rajdhani uppercase tracking-wide">Stamina total</p>
              <p className="text-xl font-bebas text-white tracking-wide">{formatNumber(stats.totalStamina)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#00C2FF]/15 border border-[#00C2FF]/30 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-[#00C2FF]" />
            </div>
            <div>
              <p className="text-xs text-[#8BA4BE] font-rajdhani uppercase tracking-wide">Mejor semana</p>
              <p className="text-xl font-bebas text-[#00C2FF] tracking-wide">{bestWeek ? formatNumber(bestWeek.totalSteps) : '0'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {fraudFlag && (
        <Card className="border-red-800/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="h-5 w-5" />
              Alerta de fraude detectada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-[#8BA4BE] font-exo text-xs mb-1">Nivel de riesgo</p>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-rajdhani font-semibold tracking-wide ${getRiskLevel(fraudFlag).color}`}>
                  {getRiskLevel(fraudFlag).label}
                </span>
              </div>
              <div>
                <p className="text-[#8BA4BE] font-exo text-xs mb-1">Estado revision</p>
                <p className="font-medium text-white font-exo">{fraudFlag.reviewStatus}</p>
              </div>
              <div>
                <p className="text-[#8BA4BE] font-exo text-xs mb-1">Stamina congelada</p>
                <p className="font-medium text-white font-exo">{fraudFlag.staminaFrozen ? 'Si' : 'No'}</p>
              </div>
            </div>
            {fraudFlag.reviewNotes && (
              <div className="mt-3 p-3 bg-[#0A0A12] border border-[#1E1E30] rounded text-sm text-[#8BA4BE] font-exo">
                <p className="font-medium text-white mb-1">Notas:</p>
                <p>{fraudFlag.reviewNotes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Historial de sesiones de pasos</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1E1E30] bg-[#12121E]">
                  <th className="text-left py-2 px-4 text-xs font-rajdhani font-semibold text-[#8BA4BE] uppercase tracking-widest">Pasos</th>
                  <th className="text-left py-2 px-4 text-xs font-rajdhani font-semibold text-[#8BA4BE] uppercase tracking-widest">Duracion</th>
                  <th className="text-left py-2 px-4 text-xs font-rajdhani font-semibold text-[#8BA4BE] uppercase tracking-widest">Velocidad</th>
                  <th className="text-left py-2 px-4 text-xs font-rajdhani font-semibold text-[#8BA4BE] uppercase tracking-widest">Confianza</th>
                  <th className="text-left py-2 px-4 text-xs font-rajdhani font-semibold text-[#8BA4BE] uppercase tracking-widest">Estado</th>
                  <th className="text-left py-2 px-4 text-xs font-rajdhani font-semibold text-[#8BA4BE] uppercase tracking-widest">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E1E30]">
                {stepsLogs.map((log) => (
                  <tr key={log._id} className="bg-[#0A0A12] hover:bg-[#12121E] transition-colors">
                    <td className="py-2 px-4 font-medium text-white font-exo">{formatNumber(log.stepsCount)}</td>
                    <td className="py-2 px-4 text-[#8BA4BE] font-exo">{log.sessionDurationMinutes} min</td>
                    <td className="py-2 px-4 text-[#8BA4BE] font-exo">{log.avgSpeedKmh?.toFixed(1) || '-'} km/h</td>
                    <td className="py-2 px-4 text-[#8BA4BE] font-exo">{(log.confidenceScore * 100).toFixed(0)}%</td>
                    <td className="py-2 px-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-rajdhani font-semibold tracking-wide ${getStatusColor(log.confidenceStatus)}`}>
                        {log.confidenceStatus}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-xs text-[#8BA4BE] font-exo">{formatDateTime(log.startTime)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transacciones de stamina recientes</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1E1E30] bg-[#12121E]">
                  <th className="text-left py-2 px-4 text-xs font-rajdhani font-semibold text-[#8BA4BE] uppercase tracking-widest">Tipo</th>
                  <th className="text-left py-2 px-4 text-xs font-rajdhani font-semibold text-[#8BA4BE] uppercase tracking-widest">Cantidad</th>
                  <th className="text-left py-2 px-4 text-xs font-rajdhani font-semibold text-[#8BA4BE] uppercase tracking-widest">Descripcion</th>
                  <th className="text-left py-2 px-4 text-xs font-rajdhani font-semibold text-[#8BA4BE] uppercase tracking-widest">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E1E30]">
                {staminaTransactions.map((tx) => (
                  <tr key={tx.id} className="bg-[#0A0A12] hover:bg-[#12121E] transition-colors">
                    <td className="py-2 px-4">
                      <span className="text-xs bg-[#12121E] border border-[#1E1E30] text-[#00C2FF] px-2 py-0.5 rounded font-mono font-rajdhani">
                        {tx.type}
                      </span>
                    </td>
                    <td className={`py-2 px-4 font-medium font-exo ${tx.amount >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {tx.amount >= 0 ? '+' : ''}{formatNumber(tx.amount)}
                    </td>
                    <td className="py-2 px-4 text-[#8BA4BE] font-exo text-xs">{tx.description || '-'}</td>
                    <td className="py-2 px-4 text-xs text-[#8BA4BE] font-exo">{formatDateTime(tx.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
