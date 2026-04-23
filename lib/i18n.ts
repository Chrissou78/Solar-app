export const SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'pt']

const translationCache: Record<string, any> = {}

export function getDefaultLanguage(): string {
  if (typeof window === 'undefined') return 'en'
  
  const saved = localStorage.getItem('language')
  if (saved && SUPPORTED_LANGUAGES.includes(saved)) {
    return saved
  }
  
  const browserLang = navigator.language.toLowerCase().split('-')[0]
  if (SUPPORTED_LANGUAGES.includes(browserLang)) {
    localStorage.setItem('language', browserLang)
    return browserLang
  }
  
  localStorage.setItem('language', 'en')
  return 'en'
}

export async function loadTranslations(language: string): Promise<any> {
  // Return from cache if already loaded
  if (translationCache[language]) {
    return translationCache[language]
  }

  try {
    let translations
    switch (language) {
      case 'es':
        translations = await import('@/public/locales/es/common.json').then(m => m.default)
        break
      case 'fr':
        translations = await import('@/public/locales/fr/common.json').then(m => m.default)
        break
      case 'de':
        translations = await import('@/public/locales/de/common.json').then(m => m.default)
        break
      case 'pt':
        translations = await import('@/public/locales/pt/common.json').then(m => m.default)
        break
      default:
        translations = await import('@/public/locales/en/common.json').then(m => m.default)
    }
    
    // Cache the translations
    translationCache[language] = translations
    return translations
  } catch (error) {
    console.error(`Failed to load translations for ${language}:`, error)
    // Fallback to English
    if (language !== 'en') {
      return loadTranslations('en')
    }
    return {}
  }
}
