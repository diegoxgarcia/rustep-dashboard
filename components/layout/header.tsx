'use client'

import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { signOutAction } from '@/lib/actions'

interface HeaderProps {
  title: string
  description?: string
}

export function Header({ title, description }: HeaderProps) {
  const { data: session } = useSession()

  return (
    <header className="h-16 border-b border-[#1A3A5C] bg-[#0D2540] flex items-center justify-between px-6">
      <div>
        <h2 className="text-xl font-bebas tracking-wider text-white leading-none">{title}</h2>
        {description && (
          <p className="text-xs text-[#8BA4BE] font-exo mt-0.5">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-4">
        {session?.user && (
          <span className="text-sm text-[#8BA4BE] font-exo hidden sm:block">{session.user.email}</span>
        )}
        <form action={signOutAction}>
          <Button
            variant="outline"
            size="sm"
            type="submit"
            className="border-[#FF5A1F] text-[#FF5A1F] hover:bg-[#FF5A1F] hover:text-white font-exo font-medium transition-all duration-200"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Salir
          </Button>
        </form>
      </div>
    </header>
  )
}
