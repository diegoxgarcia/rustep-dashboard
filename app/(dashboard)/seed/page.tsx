import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SeedUsersForm } from '@/components/seed/seed-users-form'
import { SeedStepsForm } from '@/components/seed/seed-steps-form'
import { SeedStaminaForm } from '@/components/seed/seed-stamina-form'
import { SeedGroupsForm } from '@/components/seed/seed-groups-form'
import { CleanupSection } from '@/components/seed/cleanup-section'
import { ShieldAlert } from 'lucide-react'

export default async function SeedPage() {
  const session = await auth()

  if (!session?.user?.isAdmin) {
    redirect('/')
  }

  return (
    <div>
      <Header title="Datos de prueba" description="Generar y gestionar datos de testing" />
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800">Zona de administracion</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Esta seccion solo es visible para administradores. Los datos generados usan emails @test.com para facilitar su identificacion y limpieza.
            </p>
          </div>
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="steps">Sesiones de pasos</TabsTrigger>
            <TabsTrigger value="stamina">Stamina</TabsTrigger>
            <TabsTrigger value="groups">Grupos</TabsTrigger>
            <TabsTrigger value="cleanup">Limpiar datos</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <SeedUsersForm />
          </TabsContent>

          <TabsContent value="steps">
            <SeedStepsForm />
          </TabsContent>

          <TabsContent value="stamina">
            <SeedStaminaForm />
          </TabsContent>

          <TabsContent value="groups">
            <SeedGroupsForm />
          </TabsContent>

          <TabsContent value="cleanup">
            <CleanupSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
