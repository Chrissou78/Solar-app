'use client'

import { useEffect, useState } from 'react'
import { useSystem } from '@/lib/hooks/useSystem'
import { useLanguage } from '@/lib/hooks/useLanguage'
import { loadTranslations } from '@/lib/i18n'
import { AlertCircle, AlertTriangle, Info, X, ChevronDown, ChevronUp } from 'lucide-react'

export default function Alerts() {
  const { language, mounted } = useLanguage()
  const { system, loading, error } = useSystem()
  const [setT] = useState<any>({})
  const [dismissedAlerts, setDismissedAlerts] = useState<number[]>([])
  const [expandedAlert, setExpandedAlert] = useState<number | null>(null)

  useEffect(() => {
    if (mounted) {
      loadTranslations(language).then(data => setT(data))
    }
  }, [language, mounted])

  const dismissAlert = (id: number) => {
    setDismissedAlerts([...dismissedAlerts, id])
  }

  const toggleExpand = (id: number) => {
    setExpandedAlert(expandedAlert === id ? null : id)
  }

  if (!mounted || loading) {
    return (
      <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (error || !system) {
    return (
      <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} className="min-h-screen flex items-center justify-center">
        <p>Error: {error || 'System not found'}</p>
      </div>
    )
  }

  const activeAlerts = system.alerts.filter(a => !dismissedAlerts.includes(a.id))
  const warningAlerts = activeAlerts.filter(a => a.severity === 'warning')
  const infoAlerts = activeAlerts.filter(a => a.severity === 'info')

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return '#ef4444'
      case 'warning':
        return '#f59e0b'
      default:
        return '#3b82f6'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return AlertTriangle
      case 'warning':
        return AlertCircle
      default:
        return Info
    }
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#3b82f6' }}>
            Alerts & Notifications
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Stay informed about your system's status
          </p>
        </div>

        {activeAlerts.length === 0 ? (
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }} className="rounded-lg border p-12 text-center">
            <div className="flex justify-center mb-4">
              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }} className="p-4 rounded-full">
                <Info size={32} style={{ color: '#10b981' }} />
              </div>
            </div>
            <p className="text-lg font-medium mb-2">All Clear!</p>
            <p style={{ color: 'var(--text-secondary)' }}>You have no active alerts</p>
          </div>
        ) : (
          <div className="space-y-6">
            {warningAlerts.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span style={{ color: '#f59e0b' }}>⚠️</span>
                  Warnings ({warningAlerts.length})
                </h2>
                <div className="space-y-4">
                  {warningAlerts.map((alert) => {
                    const Icon = getSeverityIcon(alert.severity)
                    const isExpanded = expandedAlert === alert.id
                    return (
                      <div
                        key={alert.id}
                        style={{
                          backgroundColor: 'var(--bg-secondary)',
                          borderColor: getSeverityColor(alert.severity),
                          borderLeftWidth: '4px',
                        }}
                        className="rounded-lg border p-6"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex gap-4 flex-1">
                            <div style={{ color: getSeverityColor(alert.severity) }} className="pt-1">
                              <Icon size={24} />
                            </div>
                            <div className="flex-1 cursor-pointer" onClick={() => toggleExpand(alert.id)}>
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold mb-2">{alert.title}</h3>
                                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                              </div>
                              <p style={{ color: 'var(--text-secondary)' }}>{alert.description}</p>
                              
                              {isExpanded && (
                                <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                                  <p style={{ color: 'var(--text-secondary)' }} className="text-sm mb-3">
                                    <strong>Severity:</strong> {alert.severity}
                                  </p>
                                  <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
                                    <strong>Date:</strong> {new Date().toLocaleDateString()}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => dismissAlert(alert.id)}
                            className="p-2 hover:opacity-50 transition ml-4 flex-shrink-0"
                            title="Dismiss alert"
                          >
                            <X size={20} style={{ color: 'var(--text-secondary)' }} />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {infoAlerts.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span style={{ color: '#3b82f6' }}>ℹ️</span>
                  Information ({infoAlerts.length})
                </h2>
                <div className="space-y-4">
                  {infoAlerts.map((alert) => {
                    const Icon = getSeverityIcon(alert.severity)
                    const isExpanded = expandedAlert === alert.id
                    return (
                      <div
                        key={alert.id}
                        style={{
                          backgroundColor: 'var(--bg-secondary)',
                          borderColor: getSeverityColor(alert.severity),
                          borderLeftWidth: '4px',
                        }}
                        className="rounded-lg border p-6"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex gap-4 flex-1">
                            <div style={{ color: getSeverityColor(alert.severity) }} className="pt-1">
                              <Icon size={24} />
                            </div>
                            <div className="flex-1 cursor-pointer" onClick={() => toggleExpand(alert.id)}>
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold mb-2">{alert.title}</h3>
                                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                              </div>
                              <p style={{ color: 'var(--text-secondary)' }}>{alert.description}</p>
                              
                              {isExpanded && (
                                <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                                  <p style={{ color: 'var(--text-secondary)' }} className="text-sm mb-3">
                                    <strong>Severity:</strong> {alert.severity}
                                  </p>
                                  <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
                                    <strong>Date:</strong> {new Date().toLocaleDateString()}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => dismissAlert(alert.id)}
                            className="p-2 hover:opacity-50 transition ml-4 flex-shrink-0"
                            title="Dismiss alert"
                          >
                            <X size={20} style={{ color: 'var(--text-secondary)' }} />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
