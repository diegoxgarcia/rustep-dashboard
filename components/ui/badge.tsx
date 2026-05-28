import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold font-rajdhani tracking-wide transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-[#FF5A1F] text-white',
        secondary: 'border-transparent bg-[#0D2540] text-[#8BA4BE] border-[#1A3A5C]',
        destructive: 'border-transparent bg-red-900/40 text-red-400 border-red-800/50',
        outline: 'text-white border-[#1A3A5C]',
        success: 'border-transparent bg-emerald-900/40 text-emerald-400 border-emerald-800/50',
        warning: 'border-transparent bg-[#FF5A1F]/20 text-[#FF5A1F] border-[#FF5A1F]/30',
        danger: 'border-transparent bg-red-900/40 text-red-400 border-red-800/50',
        info: 'border-transparent bg-[#00C2FF]/15 text-[#00C2FF] border-[#00C2FF]/30',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
