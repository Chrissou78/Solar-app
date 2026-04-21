export const SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'pt']

export function getDefaultLanguage(): string {
  if (typeof window === 'undefined') return 'en'
  const saved = localStorage.getItem('language')
  if (saved && SUPPORTED_LANGUAGES.includes(saved)) return saved
  const browserLang = navigator.language.toLowerCase().split('-')[0]
  if (SUPPORTED_LANGUAGES.includes(browserLang)) {
    localStorage.setItem('language', browserLang)
    return browserLang
  }
  localStorage.setItem('language', 'en')
  return 'en'
}

export async function loadTranslations(language: string) {
  const translations: Record<string, any> = {
    en: () => import('@/public/locales/en/common.json').then(m => m.default),
    es: () => import('@/public/locales/es/common.json').then(m => m.default),
    fr: () => import('@/public/locales/fr/common.json').then(m => m.default),
    de: () => import('@/public/locales/de/common.json').then(m => m.default),
    pt: () => import('@/public/locales/pt/common.json').then(m => m.default),
  }
  return translations[language]?.() || translations.en()
}
