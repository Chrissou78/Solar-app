'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useLanguage } from '@/lib/hooks/useLanguage'

export default function Header() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { language, setLanguage, mounted: langMounted } = useLanguage()

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'pt', label: 'Português', flag: '🇵🇹' },
  ]

  useEffect(() => {
    setMounted(true)
    const isDarkMode = document.documentElement.classList.contains('dark')
    setIsDark(isDarkMode)
  }, [])

  const toggleTheme = () => {
    const newDark = !isDark
    setIsDark(newDark)
    if (newDark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', newDark ? 'dark' : 'light')
  }

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang)
    localStorage.setItem('language', newLang)
  }

  if (!mounted || !langMounted) return null

  return (
    <header className="sticky top-0 z-50" style={{ backgroundColor: 'var(--bg-secondary)', borderBottomColor: 'var(--border-color)', borderBottomWidth: '1px' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-500">☀️ Virtual Energy</h1>
        
        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <select 
            value={language} 
            onChange={(e) => handleLanguageChange(e.target.value)}
            style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
            className="px-3 py-2 rounded-lg border text-sm font-medium hover:opacity-80 transition"
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.label}
              </option>
            ))}
          </select>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
            className="p-2 rounded-lg border hover:opacity-80 transition"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  )
}
