'use client'

import Card from '../Card'
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react'

interface ProductionCardProps {
  production: number
  expected: number
  trend: number
}

export default function ProductionCard({ production, trend }: ProductionCardProps) {
  const isPositive = trend >= 0

  return (
    <Card>
      <h2 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Today's Production</h2>
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-4xl font-bold text-blue-600">{production}</span>
        <span className="text-slate-600 dark:text-slate-400">kWh</span>
      </div>

      <div className="flex items-center gap-2 text-sm">
        {isPositive ? (
          <ArrowUpRight size={16} className="text-green-500" />
        ) : (
          <ArrowDownLeft size={16} className="text-red-500" />
        )}
        <span className={isPositive ? 'text-green-500' : 'text-red-500'}>
          {Math.abs(trend)}% vs. yesterday
        </span>
      </div>
    </Card>
  )
}
