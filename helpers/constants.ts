import Time from './time'
import { Theme } from './themes'
import { getTranslatedReasons } from './i18n-server'

export function getBaseUrl() {
  if (typeof window !== 'undefined') return ''
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  if (process.env.NODE_ENV === 'production')
    return 'https://onthisday.watch'
  return `http://localhost:${process.env.PORT ?? 3001}`
}

export const colorTheme = function (
  theme?: string
) {
  const isDark = theme === Theme.Dark
  if (isDark) {
    return '#121212'
  }
  return '#fff'
}

export const fontTheme = function (
  theme?: string
) {
  const isDark = theme === Theme.Dark
  if (isDark) {
    return '#fff'
  }
  return '#111'
}

export const getRandom = <T,>(list: T[]): T => {
  const array = new Uint32Array(1)
  crypto.getRandomValues(array)
  const index = array[0] % list.length
  return list[index]
}

/**
 * Return a list of reasons according of time parameter
 * @param time - Time object
 * @param lang - Optional language code for translations (defaults to English)
 * @returns string[]
 */
export function dayHelper(time: Time, lang?: string): string[] {
  time = time || new Time(time)

  // Default to English if no language specified
  const language = lang || 'en'

  if (time.isDayBeforeChristmas()) {
    return getTranslatedReasons('day_before_christmas', language)
  }

  if (time.isChristmas()) {
    return getTranslatedReasons('christmas', language)
  }

  if (time.isNewYear()) {
    return getTranslatedReasons('new_year', language)
  }

  if (time.isFriday13th()) {
    return getTranslatedReasons('friday_13th', language)
  }

  return getTranslatedReasons('to_deploy', language)
}
