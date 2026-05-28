'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface StaminaChartProps {
  data: { week: string; credited: number; debited: number }[]
}

export function StaminaChart({ data }: StaminaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="week"
          tick={{ fontSize: 11, fill: '#6b7280' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#6b7280' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
        />
        <Tooltip
          formatter={(value, name) => [
            (Number(value) || 0).toLocaleString('es-AR'),
            name === 'credited' ? 'Emitida' : 'Gastada',
          ]}
          contentStyle={{ border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }}
        />
        <Legend formatter={(value) => value === 'credited' ? 'Stamina emitida' : 'Stamina gastada'} />
        <Bar dataKey="credited" fill="#22c55e" radius={[4, 4, 0, 0]} />
        <Bar dataKey="debited" fill="#f87171" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
