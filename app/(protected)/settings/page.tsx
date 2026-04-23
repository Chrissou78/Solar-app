'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { useLanguage } from '@/lib/hooks/useLanguage'
import { loadTranslations } from '@/lib/i18n'
import { createClient } from '@/lib/supabase/client'
import { User, Lock, Zap, Save } from 'lucide-react'

const ENERGY_PROVIDERS = [
  { value: 'solar_edge', label: 'SolarEdge' },
  { value: 'fronius', label: 'Fronius' },
  { value: 'enphase', label: 'Enphase' },
  { value: 'string_kicker', label: 'String Kicker' },
  { value: 'sma', label: 'SMA' },
  { value: 'victron', label: 'Victron' },
  { value: 'growatt', label: 'Growatt' },
  { value: 'tesla_powerwall', label: 'Tesla Powerwall' },
]

export default function Settings() {
  const { language, mounted: langMounted } = useLanguage()
  const { user, profile, appSettings, loading: authLoading } = useAuth()
  const [t, setT] = useState<any>({})
  const [mounted, setMounted] = useState(false)

  // User profile state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)

  // App settings state
  const [provider, setProvider] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [apiEndpoint, setApiEndpoint] = useState('')
  const [settingsLoading, setSettingsLoading] = useState(false)
  const [settingsSuccess, setSettingsSuccess] = useState(false)

  const [error, setError] = useState<string | null>(null)

  // Load translations
  useEffect(() => {
    if (langMounted) {
      loadTranslations(language).then(data => setT(data))
    }
  }, [language, langMounted])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '')
      setLastName(profile.last_name || '')
      setBirthDate(profile.birth_date || '')
    }
    if (appSettings) {
      setProvider(appSettings.energy_provider || '')
      setApiKey(appSettings.api_key || '')
      setApiEndpoint(appSettings.api_endpoint || '')
    }
  }, [profile, appSettings])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setProfileLoading(true)
    setError(null)
    setProfileSuccess(false)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          birth_date: birthDate || null,
        })
        .eq('id', user.id)

      if (error) throw error
      setProfileSuccess(true)
      setTimeout(() => setProfileSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setProfileLoading(false)
    }
  }

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSettingsLoading(true)
    setError(null)
    setSettingsSuccess(false)

    try {
      const supabase = createClient()

      if (appSettings?.id) {
        // Update existing
        const { error } = await supabase
          .from('app_settings')
          .update({
            energy_provider: provider || null,
            api_key: apiKey || null,
            api_endpoint: apiEndpoint || null,
          })
          .eq('id', appSettings.id)

        if (error) throw error
      } else {
        // Insert new
        const { error } = await supabase
          .from('app_settings')
          .insert({
            user_id: user.id,
            energy_provider: provider || null,
            api_key: apiKey || null,
            api_endpoint: apiEndpoint || null,
          })

        if (error) throw error
      }

      setSettingsSuccess(true)
      setTimeout(() => setSettingsSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSettingsLoading(false)
    }
  }

  if (!mounted || !langMounted || authLoading) {
    return (
      <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} className="min-h-screen flex items-center justify-center">
        <p>Please log in to access settings</p>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--accent)' }}>
          {t.settings?.title || 'Settings'}
        </h1>
        <p style={{ color: 'var(--text-secondary)' }} className="mb-12">
          {t.settings?.description || 'Manage your profile and application settings'}
        </p>

        {error && (
          <div className="p-4 rounded-lg bg-red-500/20 text-red-500 mb-8">
            {error}
          </div>
        )}

        {/* User Information */}
        <div className="rounded-xl border p-8 mb-8" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6" style={{ color: 'var(--accent)' }} />
            <h2 className="text-2xl font-semibold">
              {t.settings?.userInformation || 'User Information'}
            </h2>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  {t.settings?.firstName || 'First Name'}
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  className="w-full px-4 py-2 rounded-lg outline-none" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  {t.settings?.lastName || 'Last Name'}
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="w-full px-4 py-2 rounded-lg outline-none" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                {t.settings?.birthDate || 'Birth Date'}
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-2 rounded-lg outline-none" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                {t.settings?.email || 'Email'}
              </label>
              <input
                type="email"
                value={user.email || ''}
                disabled
                className="w-full px-4 py-2 rounded-lg outline-none opacity-50 cursor-not-allowed" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
              />
              <p style={{ color: 'var(--text-secondary)' }} className="text-xs mt-2">
                {t.settings?.emailCannotChange || 'Email cannot be changed'}
              </p>
            </div>

            {profileSuccess && (
              <div className="p-3 rounded-lg bg-green-500/20 text-green-500 text-sm">
                {t.settings?.profileUpdated || 'Profile updated successfully!'}
              </div>
            )}

            <button
              type="submit"
              disabled={profileLoading}
              style={{ backgroundColor: 'var(--accent)' }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold hover:opacity-80 transition disabled:opacity-50"
            >
              <Save size={18} />
              {profileLoading ? t.settings?.saving || 'Saving...' : t.settings?.saveProfile || 'Save Profile'}
            </button>
          </form>
        </div>

        {/* App Settings */}
        <div className="rounded-xl border p-8" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-6 h-6" style={{ color: 'var(--accent)' }} />
            <h2 className="text-2xl font-semibold">
              {t.settings?.energyProvider || 'Energy Provider Settings'}
            </h2>
          </div>

          <form onSubmit={handleUpdateSettings} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                {t.settings?.provider || 'Energy Provider'}
              </label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full px-4 py-2 rounded-lg outline-none" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
              >
                <option value="">{t.settings?.selectProvider || 'Select a provider...'}</option>
                {ENERGY_PROVIDERS.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                {t.settings?.apiKey || 'API Key'}
              </label>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <Lock size={18} style={{ color: 'var(--text-secondary)' }} />
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={t.settings?.enterApiKey || 'Enter your API key'}
                  className="bg-transparent flex-1 outline-none" style={{ color: 'var(--text-primary)' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                {t.settings?.apiEndpoint || 'API Endpoint'}
              </label>
              <input
                type="text"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                placeholder="https://api.provider.com/v1"
                className="w-full px-4 py-2 rounded-lg outline-none" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
              />
            </div>

            {settingsSuccess && (
              <div className="p-3 rounded-lg bg-green-500/20 text-green-500 text-sm">
                {t.settings?.settingsUpdated || 'Settings updated successfully!'}
              </div>
            )}

            <button
              type="submit"
              disabled={settingsLoading}
              style={{ backgroundColor: 'var(--accent)' }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold hover:opacity-80 transition disabled:opacity-50"
            >
              <Save size={18} />
              {settingsLoading ? t.settings?.saving || 'Saving...' : t.settings?.saveSettings || 'Save Settings'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
