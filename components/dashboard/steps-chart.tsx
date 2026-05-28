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
        <CartesianGrid strokeDasharray="3 3" stroke="#1A3A5C" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: '#8BA4BE', fontFamily: 'Exo 2' }}
          tickLine={false}
          axisLine={false}
          interval={4}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#8BA4BE', fontFamily: 'Exo 2' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
        />
        <Tooltip
          formatter={(value) => [(Number(value) || 0).toLocaleString('es-AR'), 'Pasos']}
          labelStyle={{ color: '#ffffff', fontWeight: 600, fontFamily: 'Exo 2' }}
          contentStyle={{
            background: '#0D2540',
            border: '1px solid #1A3A5C',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#ffffff',
          }}
        />
        <Line
          type="monotone"
          dataKey="steps"
          stroke="#FF5A1F"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 5, fill: '#FF5A1F', stroke: '#071A2F', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
