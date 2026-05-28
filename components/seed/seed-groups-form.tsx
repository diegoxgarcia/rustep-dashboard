'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users } from 'lucide-react'

export function SeedGroupsForm() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [privacy, setPrivacy] = useState('PUBLIC')
  const [memberCount, setMemberCount] = useState('5')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ group: { id: string; name: string }; membersAdded: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/seed/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          privacy,
          memberCount: parseInt(memberCount, 10),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error creando grupo')
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
          Crear grupo de running
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del grupo
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Runners BA"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripcion (opcional)
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Grupo de corredores de Buenos Aires"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Privacidad
              </label>
              <Select value={privacy} onValueChange={setPrivacy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PUBLIC">Publico</SelectItem>
                  <SelectItem value="PRIVATE">Privado</SelectItem>
                  <SelectItem value="INVITE_ONLY">Solo por invitacion</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Miembros a agregar
              </label>
              <Input
                type="number"
                min="1"
                max="49"
                value={memberCount}
                onChange={(e) => setMemberCount(e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creando...' : 'Crear grupo'}
          </Button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}
        {result && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
            Grupo &quot;{result.group.name}&quot; creado con {result.membersAdded} miembros
          </div>
        )}
      </CardContent>
    </Card>
  )
}
