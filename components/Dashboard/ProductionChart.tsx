'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface ChartData {
  date: string
  actual: number
  expected: number
}

interface ProductionChartProps {
  data: ChartData[]
}

export default function ProductionChart({ data }: ProductionChartProps) {
  return (
    <div style={{
      backgroundColor: 'var(--bg-secondary)',
      borderColor: 'var(--border-color)',
    }} className="rounded-xl border p-6">
      <h3 className="text-lg font-semibold mb-6">Production Trend (Last 30 Days)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis 
            dataKey="date" 
            stroke="var(--text-secondary)"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="var(--text-secondary)"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="actual" 
            stroke="#3b82f6" 
            name="Actual Production"
            dot={false}
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="expected" 
            stroke="#10b981" 
            name="Expected Production"
            dot={false}
            strokeWidth={2}
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
