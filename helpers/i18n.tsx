import React, { createContext, useState, useContext, useEffect } from 'react'
import en from '../locales/en.json'

type LocaleData = typeof en
type Language = string

const locales: Record<string, LocaleData> = {
  en,
}
const DEFAULT_LANGUAGE = 'en'
const AVAILABLE_LANGUAGES = Object.keys(locales)

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => any
  availableLanguages: string[]
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
)

function findBestMatchingLanguage(lang: Language): Language {
  if (locales[lang]) {
    return lang
  }
  const baseLang = lang.split('-')[0]
  if (locales[baseLang]) {
    return baseLang
  }
  return DEFAULT_LANGUAGE
}

function getLocaleData(lang: Language): LocaleData {
  return locales[findBestMatchingLanguage(lang)]
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE)

  useEffect(() => {
    const savedLang = localStorage.getItem('language')
    if (savedLang) {
      setLanguage(findBestMatchingLanguage(savedLang))
    } else {
      const browserLang = navigator.language
      setLanguage(findBestMatchingLanguage(browserLang))
    }
  }, [])

  const changeLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string) => {
    const keys = key.split('.')
    let value: any = getLocaleData(language)
    for (const k of keys) {
      if (value && typeof value === 'object' && value[k] !== undefined) {
        value = value[k]
      } else {
        return key
      }
    }
    return value
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: changeLanguage,
        t,
        availableLanguages: AVAILABLE_LANGUAGES
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export const useTranslation = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider')
  }
  return context
}
