'use client'
import { useState, useEffect } from 'react'
import { getDefaultLanguage, SUPPORTED_LANGUAGES } from '@/lib/i18n'

export function useLanguage() {
  const [language, setLanguageState] = useState('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Get initial language on mount
    const defaultLang = getDefaultLanguage()
    setLanguageState(defaultLang)
    setMounted(true)
  }, [])

  const setLanguage = (lang: string) => {
    if (SUPPORTED_LANGUAGES.includes(lang)) {
      setLanguageState(lang)
      localStorage.setItem('language', lang)
      // Dispatch custom event to sync across tabs/components
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'language',
        newValue: lang,
        oldValue: language,
        storageArea: localStorage,
      }))
    }
  }

  // Listen for language changes from other tabs/components
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'language' && e.newValue) {
        setLanguageState(e.newValue)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return { language, setLanguage, mounted }
}