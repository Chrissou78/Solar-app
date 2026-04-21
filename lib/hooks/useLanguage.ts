'use client'

import { useEffect, useState } from 'react'
import { getDefaultLanguage } from '@/lib/i18n'

export function useLanguage() {
  const [language, setLanguage] = useState('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const defaultLang = getDefaultLanguage()
    setLanguage(defaultLang)

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'language' && e.newValue) {
        setLanguage(e.newValue)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return { language, setLanguage, mounted }
}
