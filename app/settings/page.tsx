'use client'

import { useEffect, useState } from 'react'
import { useSystem } from '@/lib/hooks/useSystem'
import { useLanguage } from '@/lib/hooks/useLanguage'
import { loadTranslations } from '@/lib/i18n'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { Settings as SettingsIcon, Bell, Download } from 'lucide-react'

export default function Settings() {
  const { language, setLanguage, mounted: langMounted } = useLanguage()
  const [mounted] = useState(false)
  const { system, loading, error } = useSystem()
  const [setT] = useState<any>({})
  const [notifications, setNotifications] = useState(true)

  useEffect(() => {
    if (langMounted) {
        loadTranslations(language).then(data => setT(data))
    }
  }, [language, langMounted])

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang)
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

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-2" style={{ color: '#3b82f6' }}>
            <SettingsIcon size={32} />
            Settings
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Manage your preferences and account settings
          </p>
        </div>

        {/* System Information */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">System Information</h2>
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }} className="rounded-lg border p-6 space-y-4">
            <div>
              <p style={{ color: 'var(--text-secondary)' }} className="text-sm font-medium mb-1">System Name</p>
              <p className="font-medium">{system.systemName}</p>
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)' }} className="text-sm font-medium mb-1">Location</p>
              <p className="font-medium">{system.location}</p>
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)' }} className="text-sm font-medium mb-1">System Size</p>
              <p className="font-medium">{system.systemSizeKw}kW</p>
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)' }} className="text-sm font-medium mb-1">Inverter Type</p>
              <p className="font-medium">{system.inverterType}</p>
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)' }} className="text-sm font-medium mb-1">Installation Date</p>
              <p className="font-medium">
                {new Date(system.installationDate).toLocaleDateString(language === 'en' ? 'en-US' : language)}
              </p>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Preferences</h2>
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }} className="rounded-lg border p-6 space-y-6">
            {/* Language */}
            <div className="flex items-center justify-between pb-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <div>
                <p className="font-medium">Language</p>
                <p style={{ color: 'var(--text-secondary)' }} className="text-sm">Choose your preferred language</p>
              </div>
              <LanguageSwitcher currentLang={language} onChange={handleLanguageChange} />
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell size={20} style={{ color: '#3b82f6' }} />
                <div>
                  <p className="font-medium">Notifications</p>
                  <p style={{ color: 'var(--text-secondary)' }} className="text-sm">Receive system alerts</p>
                </div>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                style={{
                  backgroundColor: notifications ? '#10b981' : '#9ca3af',
                }}
                className="relative inline-flex h-8 w-14 items-center rounded-full transition"
              >
                <span
                  style={{
                    transform: notifications ? 'translateX(28px)' : 'translateX(2px)',
                  }}
                  className="inline-block h-6 w-6 transform rounded-full bg-white transition"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Data */}
        <div>
          <h2 className="text-xl font-bold mb-4">Data</h2>
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }} className="rounded-lg border p-6">
            <button style={{
              backgroundColor: '#3b82f6',
              color: '#fff',
            }} className="flex items-center gap-2 px-4 py-3 rounded-lg hover:opacity-80 transition font-medium">
              <Download size={20} />
              Export My Data
            </button>
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm mt-3">
              Download all your system data in CSV format
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
