'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Trash2, AlertTriangle } from 'lucide-react'

interface CleanupResult {
  deletedUsers?: number
  deletedSteps?: number
  deletedFraudFlags?: number
  deletedStaminaEntries?: number
}

export function CleanupSection() {
  const [loading, setLoading] = useState<'users' | 'steps' | null>(null)
  const [result, setResult] = useState<CleanupResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [openDialog, setOpenDialog] = useState<'users' | 'steps' | null>(null)

  async function handleCleanup(target: 'users' | 'steps') {
    setLoading(target)
    setError(null)
    setResult(null)
    setOpenDialog(null)

    try {
      const res = await fetch(`/api/seed/cleanup?target=${target}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error en limpieza')
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(null)
    }
  }

  return (
    <Card className="border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base text-red-700">
          <Trash2 className="h-5 w-5" />
          Limpiar datos de prueba
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-md">
          <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">
            Estas acciones son irreversibles. Solo afectan a los datos con emails @test.com
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Dialog open={openDialog === 'users'} onOpenChange={(o) => setOpenDialog(o ? 'users' : null)}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full" disabled={loading !== null}>
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar todos los usuarios de prueba
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar eliminacion</DialogTitle>
                <DialogDescription>
                  Se eliminaran TODOS los usuarios con email @test.com, junto con sus sesiones de pasos,
                  fraud flags y entradas de stamina. Esta accion no se puede deshacer.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenDialog(null)}>
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleCleanup('users')}
                  disabled={loading !== null}
                >
                  {loading === 'users' ? 'Eliminando...' : 'Confirmar eliminacion'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={openDialog === 'steps'} onOpenChange={(o) => setOpenDialog(o ? 'steps' : null)}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full" disabled={loading !== null}>
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar todas las sesiones de prueba
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar eliminacion</DialogTitle>
                <DialogDescription>
                  Se eliminaran todas las sesiones de pasos y fraud flags de los usuarios de prueba.
                  Los usuarios en si no seran eliminados.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenDialog(null)}>
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleCleanup('steps')}
                  disabled={loading !== null}
                >
                  {loading === 'steps' ? 'Eliminando...' : 'Confirmar eliminacion'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}
        {result && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm space-y-1">
            <p className="font-medium">Limpieza completada:</p>
            {result.deletedUsers !== undefined && (
              <p>- {result.deletedUsers} usuarios eliminados</p>
            )}
            {result.deletedSteps !== undefined && (
              <p>- {result.deletedSteps} sesiones de pasos eliminadas</p>
            )}
            {result.deletedFraudFlags !== undefined && (
              <p>- {result.deletedFraudFlags} fraud flags eliminados</p>
            )}
            {result.deletedStaminaEntries !== undefined && (
              <p>- {result.deletedStaminaEntries} entradas de stamina eliminadas</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
