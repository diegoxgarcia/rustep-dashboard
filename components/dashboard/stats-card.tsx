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

export function StatsCard({ title, value, icon: Icon, description, color = 'text-green-600' }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {typeof value === 'number' ? formatNumber(value) : value}
            </p>
            {description && (
              <p className="text-xs text-gray-400 mt-1">{description}</p>
            )}
          </div>
          <div className={`h-12 w-12 rounded-lg bg-gray-50 flex items-center justify-center ${color}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
