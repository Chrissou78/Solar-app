'use client'
import { useState, useEffect } from 'react'
import { getDefaultLanguage, SUPPORTED_LANGUAGES } from '@/lib/i18n'

export function useLanguage() {
  const [language, setLanguageState] = useState('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Get initial language from localStorage or browser
    const saved = typeof window !== 'undefined' ? localStorage.getItem('language') : null
    const defaultLang = saved || getDefaultLanguage()
    setLanguageState(defaultLang)
    localStorage.setItem('language', defaultLang)
    setMounted(true)
  }, [])

  const setLanguage = (lang: string) => {
    if (SUPPORTED_LANGUAGES.includes(lang)) {
      setLanguageState(lang)
      localStorage.setItem('language', lang)
      // Dispatch storage event to sync across components
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'language',
        newValue: lang,
        storageArea: localStorage,
      }))
    }
  }

  // Listen for language changes from other tabs/components
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'language' && e.newValue && SUPPORTED_LANGUAGES.includes(e.newValue)) {
        setLanguageState(e.newValue)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return { language, setLanguage, mounted }
}
