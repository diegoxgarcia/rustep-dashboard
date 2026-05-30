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
        <CartesianGrid strokeDasharray="3 3" stroke="#1E1E30" />
        <XAxis
          dataKey="week"
          tick={{ fontSize: 11, fill: '#8BA4BE', fontFamily: 'Exo 2' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#8BA4BE', fontFamily: 'Exo 2' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
        />
        <Tooltip
          formatter={(value, name) => [
            (Number(value) || 0).toLocaleString('es-AR'),
            name === 'credited' ? 'Emitida' : 'Gastada',
          ]}
          contentStyle={{
            background: '#12121E',
            border: '1px solid #1E1E30',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#ffffff',
          }}
          labelStyle={{ color: '#ffffff', fontFamily: 'Exo 2' }}
        />
        <Legend
          formatter={(value) => (
            value === 'credited' ? 'Stamina emitida' : 'Stamina gastada'
          )}
          wrapperStyle={{ color: '#8BA4BE', fontFamily: 'Exo 2', fontSize: '12px' }}
        />
        <Bar dataKey="credited" fill="#FF5A1F" radius={[4, 4, 0, 0]} />
        <Bar dataKey="debited" fill="#00C2FF" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
