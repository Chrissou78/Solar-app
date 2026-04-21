'use client'

interface LanguageSwitcherProps {
  onChange: (lang: string) => void
  currentLang: string
}

export default function LanguageSwitcher({ onChange, currentLang }: LanguageSwitcherProps) {
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'pt', label: 'Português' },
  ]

  return (
    <select
      value={currentLang}
      onChange={(e) => onChange(e.target.value)}
      style={{
        backgroundColor: 'var(--bg-tertiary)',
        color: 'var(--text-primary)',
        borderColor: 'var(--border-color)',
      }}
      className="px-3 py-2 rounded-lg border transition text-sm font-medium"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  )
}
