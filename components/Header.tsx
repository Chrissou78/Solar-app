'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/hooks/useLanguage'
import { useAuth } from '@/lib/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut, Settings, User } from 'lucide-react'

export default function Header() {
  const { language, setLanguage, mounted } = useLanguage()
  const { user, loading } = useAuth()
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang)
    // Force page refresh to reload translations
    window.location.reload()
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setShowMenu(false)
    router.push('/auth/login')
  }

  if (!mounted) return null

  return (
    <header style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }} className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <h1 
          className="text-xl font-bold cursor-pointer hover:opacity-80 transition"
          onClick={() => router.push('/')}
          style={{ color: 'var(--accent)' }}>
          Virtual Energy
        </h1>

        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="px-3 py-2 rounded text-sm outline-none font-medium" 
            style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="pt">Português</option>
          </select>

          {/* User Menu - Only show if authenticated */}
          {!loading && user && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:opacity-80 transition"
                style={{ backgroundColor: 'var(--bg-tertiary)' }}
              >
                <User size={18} />
                <span className="text-sm">{user.email?.split('@')[0]}</span>
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border shadow-lg" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                  <button
                    onClick={() => {
                      router.push('/settings')
                      setShowMenu(false)
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 hover:opacity-80 transition rounded-t-lg"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <Settings size={16} />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 hover:opacity-80 transition rounded-b-lg text-red-500"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Login button if not authenticated */}
          {!loading && !user && (
            <button
              onClick={() => router.push('/auth/login')}
              style={{ backgroundColor: 'var(--accent)' }}
              className="px-4 py-2 rounded-lg text-white font-semibold hover:opacity-80 transition"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  )
}