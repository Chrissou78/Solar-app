'use client'

interface EfficiencyMetricsProps {
  systemSizeKw: number
  totalProduction: number
  expectedProduction: number
  daysTracked: number
}

export default function EfficiencyMetrics({
  systemSizeKw,
  totalProduction,
  expectedProduction,
  daysTracked,
}: EfficiencyMetricsProps) {
  const efficiency = expectedProduction > 0 
    ? ((totalProduction / expectedProduction) * 100).toFixed(1)
    : '0'
  
  const avgDaily = daysTracked > 0 ? (totalProduction / daysTracked).toFixed(2) : '0'
  const capacityFactor = systemSizeKw > 0
    ? ((totalProduction / (systemSizeKw * daysTracked * 24)) * 100).toFixed(1)
    : '0'

  const metrics = [
    {
      label: 'System Efficiency',
      value: `${efficiency}%`,
      color: '#3b82f6',
      description: 'Actual vs Expected',
    },
    {
      label: 'Avg Daily Production',
      value: `${avgDaily} kWh`,
      color: '#06b6d4',
      description: 'Per day average',
    },
    {
      label: 'Capacity Factor',
      value: `${capacityFactor}%`,
      color: '#10b981',
      description: 'System utilization',
    },
    {
      label: 'Total Production',
      value: `${totalProduction.toFixed(0)} kWh`,
      color: '#f59e0b',
      description: `Over ${daysTracked} days`,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, idx) => (
        <div
          key={idx}
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
          className="rounded-xl border p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm font-medium">
              {metric.label}
            </p>
            <div
              style={{ backgroundColor: metric.color, opacity: 0.2 }}
              className="w-3 h-3 rounded-full"
            ></div>
          </div>
          <p style={{ color: metric.color }} className="text-2xl font-bold mb-1">
            {metric.value}
          </p>
          <p style={{ color: 'var(--text-secondary)' }} className="text-xs">
            {metric.description}
          </p>
        </div>
      ))}
    </div>
  )
}
