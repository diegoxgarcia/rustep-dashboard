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
            <img src={user.photoUrl} alt="" className="h-16 w-16 rounded-full" />
          ) : (
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-2xl font-bold">
              {user.displayName[0]}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.displayName}</h1>
            <p className="text-gray-500">{user.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(accountStatus)}`}>
                {accountStatus}
              </span>
              <span className="text-xs text-gray-500">{getActivityLabel(user.activityCategory)}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {accountStatus !== 'active' && (
            <Button variant="outline" size="sm" disabled={loading} onClick={() => handleStatusChange('active')}>
              Activar
            </Button>
          )}
          {accountStatus !== 'suspended' && (
            <Button variant="outline" size="sm" className="text-yellow-600 border-yellow-200" disabled={loading} onClick={() => handleStatusChange('suspended')}>
              Suspender
            </Button>
          )}
          {accountStatus !== 'banned' && (
            <Button variant="destructive" size="sm" disabled={loading} onClick={() => handleStatusChange('banned')}>
              Banear
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Footprints className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-xs text-gray-500">Total pasos</p>
              <p className="text-xl font-bold">{formatNumber(stats.totalSteps)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Calendar className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-xs text-gray-500">Sesiones</p>
              <p className="text-xl font-bold">{formatNumber(stats.totalSessions)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Zap className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-xs text-gray-500">Stamina total</p>
              <p className="text-xl font-bold">{formatNumber(stats.totalStamina)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-xs text-gray-500">Mejor semana</p>
              <p className="text-xl font-bold">{bestWeek ? formatNumber(bestWeek.totalSteps) : '0'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {fraudFlag && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Alerta de fraude detectada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Nivel de riesgo</p>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getRiskLevel(fraudFlag).color}`}>
                  {getRiskLevel(fraudFlag).label}
                </span>
              </div>
              <div>
                <p className="text-gray-500">Estado revision</p>
                <p className="font-medium">{fraudFlag.reviewStatus}</p>
              </div>
              <div>
                <p className="text-gray-500">Stamina congelada</p>
                <p className="font-medium">{fraudFlag.staminaFrozen ? 'Si' : 'No'}</p>
              </div>
            </div>
            {fraudFlag.reviewNotes && (
              <div className="mt-3 p-3 bg-gray-50 rounded text-sm text-gray-700">
                <p className="font-medium mb-1">Notas:</p>
                <p>{fraudFlag.reviewNotes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Historial de sesiones de pasos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">Pasos</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">Duracion</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">Velocidad</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">Confianza</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stepsLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50">
                    <td className="py-2 px-3 font-medium">{formatNumber(log.stepsCount)}</td>
                    <td className="py-2 px-3">{log.sessionDurationMinutes} min</td>
                    <td className="py-2 px-3">{log.avgSpeedKmh?.toFixed(1) || '-'} km/h</td>
                    <td className="py-2 px-3">{(log.confidenceScore * 100).toFixed(0)}%</td>
                    <td className="py-2 px-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(log.confidenceStatus)}`}>
                        {log.confidenceStatus}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-xs text-gray-500">{formatDateTime(log.startTime)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Transacciones de stamina recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">Tipo</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">Descripcion</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {staminaTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="py-2 px-3">
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-mono">
                        {tx.type}
                      </span>
                    </td>
                    <td className={`py-2 px-3 font-medium ${tx.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.amount >= 0 ? '+' : ''}{formatNumber(tx.amount)}
                    </td>
                    <td className="py-2 px-3 text-gray-500 text-xs">{tx.description || '-'}</td>
                    <td className="py-2 px-3 text-xs text-gray-500">{formatDateTime(tx.createdAt)}</td>
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
