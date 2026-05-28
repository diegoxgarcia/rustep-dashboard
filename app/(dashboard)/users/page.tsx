import { Header } from '@/components/layout/header'
import { UsersTable } from '@/components/users/users-table'

export default function UsersPage() {
  return (
    <div>
      <Header title="Usuarios" description="Gestion de todos los usuarios registrados" />
      <div className="p-6">
        <UsersTable />
      </div>
    </div>
  )
}
