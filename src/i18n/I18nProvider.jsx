import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { en } from './en'
import { fr } from './fr'

const STORAGE_KEY = 'veritas.ui.lang'
const TABLES = { en, fr }

const I18nContext = createContext(null)

function interpolate(template, vars) {
  if (!vars) return template
  return String(template).replace(/\{(\w+)\}/g, (_, key) =>
    vars[key] == null ? `{${key}}` : String(vars[key]),
  )
}

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'fr' ? 'fr' : 'en'
    } catch {
      return 'en'
    }
  })

  const setLocale = useCallback((next) => {
    const lang = next === 'fr' ? 'fr' : 'en'
    setLocaleState(lang)
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* keep in memory */
    }
  }, [])

  const t = useCallback(
    (key, vars) => {
      const table = TABLES[locale] || en
      return interpolate(table[key] ?? en[key] ?? key, vars)
    },
    [locale],
  )

  useEffect(() => {
    document.documentElement.lang = locale === 'fr' ? 'fr' : 'en'
  }, [locale])

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error('useI18n needs I18nProvider')
  }
  return ctx
}
