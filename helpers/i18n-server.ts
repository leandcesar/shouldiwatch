import en from '../locales/en.json'

type LocaleData = typeof en
type Language = string

const locales: Record<string, LocaleData> = {
  en
}
const DEFAULT_LANGUAGE = 'en'

function getLocaleData(lang: Language): LocaleData {
  if (locales[lang]) {
    return locales[lang]
  }
  const baseLang = lang.split('-')[0]
  if (locales[baseLang]) {
    return locales[baseLang]
  }
  return locales.en
}

function getValueByKeyPath(source: any, key: string) {
  const keys = key.split('.')
  let value = source
  for (const part of keys) {
    if (value && typeof value === 'object' && value[part] !== undefined) {
      value = value[part]
    } else {
      return undefined
    }
  }
  return value
}

export function translate(key: string, lang?: string): any {
  const language = lang || DEFAULT_LANGUAGE
  const translatedValue = getValueByKeyPath(getLocaleData(language), key)
  if (translatedValue !== undefined) {
    return translatedValue
  }
  const fallbackValue = getValueByKeyPath(locales.en, key)
  return fallbackValue !== undefined ? fallbackValue : key
}

export function getTranslatedReasons(
  reasonType: string,
  lang?: string
): string[] {
  return translate(`reasons.${reasonType}`, lang)
}
