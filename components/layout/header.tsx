import { auth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { signOutAction } from '@/lib/actions'

interface HeaderProps {
  title: string
  description?: string
}

export async function Header({ title, description }: HeaderProps) {
  const session = await auth()

  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <div className="flex items-center gap-4">
        {session?.user && (
          <span className="text-sm text-gray-600">{session.user.email}</span>
        )}
        <form action={signOutAction}>
          <Button variant="ghost" size="sm" type="submit">
            <LogOut className="h-4 w-4 mr-2" />
            Salir
          </Button>
        </form>
      </div>
    </header>
  )
}
