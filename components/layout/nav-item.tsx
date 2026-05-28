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
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-green-600 text-white'
          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span>{label}</span>
      {adminOnly && (
        <span className="ml-auto text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">
          Admin
        </span>
      )}
    </Link>
  )
}
