import { Card, CardContent } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { formatNumber } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  description?: string
  trend?: number
  color?: string
}

export function StatsCard({ title, value, icon: Icon, description, color = 'text-[#FF5A1F]' }: StatsCardProps) {
  const isCyan = color.includes('blue') || color.includes('cyan') || color.includes('00C2FF')

  return (
    <Card className="group hover:border-[#FF5A1F]/50 transition-all duration-200 hover:shadow-orange">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-rajdhani font-semibold text-[#8BA4BE] uppercase tracking-widest">{title}</p>
            <p className={`text-3xl font-bebas tracking-wider mt-2 ${isCyan ? 'text-[#00C2FF]' : 'text-white'}`}>
              {typeof value === 'number' ? formatNumber(value) : value}
            </p>
            {description && (
              <p className="text-xs text-[#8BA4BE] font-exo mt-1">{description}</p>
            )}
          </div>
          <div className={`h-12 w-12 rounded-lg flex items-center justify-center shrink-0 ${
            isCyan
              ? 'bg-[#00C2FF]/15 border border-[#00C2FF]/30'
              : 'bg-[#FF5A1F]/15 border border-[#FF5A1F]/30'
          }`}>
            <Icon className={`h-6 w-6 ${isCyan ? 'text-[#00C2FF]' : 'text-[#FF5A1F]'}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
