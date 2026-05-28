'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface StepsChartProps {
  data: { date: string; steps: number }[]
}

export function StepsChart({ data }: StepsChartProps) {
  const formatted = data.map((d) => ({
    ...d,
    label: format(new Date(d.date), 'd MMM', { locale: es }),
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={formatted} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: '#6b7280' }}
          tickLine={false}
          axisLine={false}
          interval={4}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#6b7280' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
        />
        <Tooltip
          formatter={(value) => [(Number(value) || 0).toLocaleString('es-AR'), 'Pasos']}
          labelStyle={{ color: '#111827', fontWeight: 600 }}
          contentStyle={{ border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }}
        />
        <Line
          type="monotone"
          dataKey="steps"
          stroke="#22c55e"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: '#22c55e' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
