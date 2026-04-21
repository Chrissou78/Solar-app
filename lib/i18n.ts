const SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'pt']

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

export async function loadTranslations(language: string) {
  if (translationCache[language]) {
    return translationCache[language]
  }

  try {
    const data = await import(`@/public/locales/${language}/common.json`)
    translationCache[language] = data.default
    return data.default
  } catch (error) {
    console.error(`Failed to load ${language} translations`, error)
    return {}
  }
}
