'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface MonthlyData {
  month: string
  production: number
  savings: number
}

interface MonthlyComparisonChartProps {
  data: MonthlyData[]
}

export default function MonthlyComparisonChart({ data }: MonthlyComparisonChartProps) {
  return (
    <div style={{
      backgroundColor: 'var(--bg-secondary)',
      borderColor: 'var(--border-color)',
    }} className="rounded-xl border p-6">
      <h3 className="text-lg font-semibold mb-6">Monthly Performance</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis 
            dataKey="month" 
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
          <Bar 
            dataKey="production" 
            fill="#3b82f6" 
            name="Production (kWh)"
            radius={[8, 8, 0, 0]}
          />
          <Bar 
            dataKey="savings" 
            fill="#10b981" 
            name="Savings ($)"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
