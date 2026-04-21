'use client'
import { useState, useEffect } from 'react'
import { getDefaultLanguage, SUPPORTED_LANGUAGES } from '@/lib/i18n'

export function useLanguage() {
  const [language, setLanguage] = useState('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const defaultLang = getDefaultLanguage()
    setLanguage(defaultLang)
    setMounted(true) // ← Add this line
  }, [])

  const handleSetLanguage = (lang: string) => {
    if (SUPPORTED_LANGUAGES.includes(lang)) {
      setLanguage(lang)
      localStorage.setItem('language', lang)
    }
  }

  return { language, setLanguage: handleSetLanguage, mounted }
}
