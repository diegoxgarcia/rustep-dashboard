'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface NavItemProps {
  href: string
  icon: LucideIcon
  label: string
  adminOnly?: boolean
}

export function NavItem({ href, icon: Icon, label, adminOnly }: NavItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium font-exo transition-all duration-200',
        isActive
          ? 'bg-[#FF5A1F] text-white shadow-orange'
          : 'text-[#8BA4BE] hover:bg-[#0D2540] hover:text-white border-l-2 border-transparent hover:border-[#FF5A1F]'
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span>{label}</span>
      {adminOnly && (
        <span className="ml-auto text-xs bg-[#00C2FF]/20 text-[#00C2FF] px-1.5 py-0.5 rounded font-rajdhani font-semibold tracking-wide">
          ADMIN
        </span>
      )}
    </Link>
  )
}
