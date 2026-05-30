'use client'

import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

interface HeaderProps {
  title: string
  description?: string
  bannerSrc?: string        // path to /assets/banner-xxx.svg
  bannerPosition?: string   // object-position, e.g. "right center"
}

function SignOutButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="border-[#FF5A1F] text-[#FF5A1F] hover:bg-[#FF5A1F] hover:text-white font-exo font-medium transition-all duration-200"
    >
      <LogOut className="h-4 w-4 mr-2" />
      Salir
    </Button>
  )
}

export function Header({ title, description, bannerSrc, bannerPosition = 'right center' }: HeaderProps) {
  const { data: session } = useSession()

  if (bannerSrc) {
    return (
      <header className="relative overflow-hidden border-b border-[#1E1E30]" style={{ minHeight: '160px' }}>
        {/* Asset image — decorative background */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bannerSrc}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          style={{ objectPosition: bannerPosition, opacity: 0.18 }}
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, #0A0A12 45%, #0A0A1299 75%, transparent 100%)',
          }}
        />
        {/* Top-right action bar */}
        <div className="absolute top-0 right-0 z-20 flex items-center gap-4 px-6 py-3">
          {session?.user && (
            <span className="text-xs text-[#8BA4BE] font-exo hidden sm:block">{session.user.email}</span>
          )}
          <SignOutButton />
        </div>
        {/* Title content */}
        <div className="relative z-10 px-8 pt-10 pb-6">
          <h1 className="text-4xl font-bebas tracking-widest text-white leading-none drop-shadow-md">{title}</h1>
          {description && (
            <p className="text-sm text-[#8BA4BE] font-exo mt-1.5 tracking-wide">{description}</p>
          )}
        </div>
      </header>
    )
  }

  // Fallback: slim bar without banner
  return (
    <header className="h-16 border-b border-[#1E1E30] bg-[#12121E] flex items-center justify-between px-6">
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
        <SignOutButton />
      </div>
    </header>
  )
}
