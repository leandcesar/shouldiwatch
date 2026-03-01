// index.tsx
import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Time from '../helpers/time'
import Widget from '../component/widget'
import { useTranslation } from '../helpers/i18n'
import Footer from '../component/footer'
import { ContentTypeFilter, PreferredLinkSite } from '../component/filter'
import Router from 'next/router'
import { Theme, ThemeType } from '../helpers/themes'

interface IPage {
  tz: string
  now: { timezone: string; customDate: string | null }
  initialChoice: string
  initialReason: string
}

type FilterType = 'movie' | 'tv' | 'person'
type ContentFilters = Record<FilterType, boolean>

const FILTER_PRESET_MAP: Record<ContentTypeFilter, ContentFilters> = {
  all: { movie: true, tv: true, person: true },
  only_movies: { movie: true, tv: false, person: false },
  only_tv: { movie: false, tv: true, person: false },
  only_people: { movie: false, tv: false, person: true }
}

const THEME_STORAGE_KEY = 'theme'
const PREFERRED_LINK_SITE_STORAGE_KEY = 'preferredLinkSite'
const VALID_LINK_SITES: PreferredLinkSite[] = ['imdb', 'tmdb', 'letterboxd']

const isPreferredLinkSite = (value: string | null): value is PreferredLinkSite => {
  return value !== null && VALID_LINK_SITES.includes(value as PreferredLinkSite)
}

const Page: React.FC<IPage> = ({
  tz,
  now: initialNow,
  initialChoice,
  initialReason
}) => {
  const [timezone, setTimezone] = useState<string>(tz)
  const [backgroundUrl, setBackgroundUrl] = useState<string>()
  const [now, setNow] = useState<Time>(
    new Time(initialNow.timezone, initialNow.customDate ?? undefined)
  )
  const [theme, setTheme] = useState<ThemeType>(Theme.Light)
  const [filters, setFilters] = useState<ContentFilters>({
    movie: true,
    tv: true,
    person: true
  })
  const [filterPreset, setFilterPreset] = useState<ContentTypeFilter>('all')
  const [preferredLinkSite, setPreferredLinkSite] = useState<PreferredLinkSite>('imdb')

  const applyTheme = (newTheme: ThemeType) => {
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeType | null
    if (savedTheme) {
      setTheme(savedTheme)
      applyTheme(savedTheme)
    } else {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? Theme.Dark
        : Theme.Light
      setTheme(systemTheme)
      applyTheme(systemTheme)
    }
  }, [])

  useEffect(() => {
    const savedSite = localStorage.getItem(PREFERRED_LINK_SITE_STORAGE_KEY)
    if (isPreferredLinkSite(savedSite)) {
      setPreferredLinkSite(savedSite)
    }
  }, [])

  useEffect(() => {
    const currentUrl = new URL(window.location.toString())
    const timezoneFromQuery = currentUrl.searchParams.get('tz')

    if (timezoneFromQuery && Time.zoneExists(timezoneFromQuery)) {
      return
    }

    const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (!browserTimezone || !Time.zoneExists(browserTimezone)) {
      return
    }

    setTimezone(browserTimezone)
    setNow(new Time(browserTimezone))
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === Theme.Light ? Theme.Dark : Theme.Light

    setTheme(nextTheme)
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
    applyTheme(nextTheme)
  }

  const changeTimezone = (newTimezone: string) => {
    if (!Time.zoneExists(newTimezone)) {
      return
    }

    const newUrl = new URL(window.location.toString())
    newUrl.searchParams.set('tz', newTimezone)
    Router.push(newUrl.pathname + newUrl.search)

    setTimezone(newTimezone)
    setNow(new Time(newTimezone))
  }

  const changeFilterPreset = (preset: ContentTypeFilter) => {
    setFilterPreset(preset)
    setFilters(FILTER_PRESET_MAP[preset])
  }

  const changePreferredLinkSite = (site: PreferredLinkSite) => {
    setPreferredLinkSite(site)
    localStorage.setItem(PREFERRED_LINK_SITE_STORAGE_KEY, site)
  }

  const { t } = useTranslation()

  return (
    <>
      <Head>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
      </Head>
      <div
        className={`wrapper`}
        style={{ '--bg': `url(${backgroundUrl})` } as React.CSSProperties}
      >
        <Widget
          choice={initialChoice}
          reason={initialReason}
          now={now}
          filters={filters}
          preferredLinkSite={preferredLinkSite}
          onChoiceSelected={setBackgroundUrl}
        />
        <div className="meta">
          <Footer
            timezone={timezone}
            changeTimezone={changeTimezone}
            theme={theme}
            toggleTheme={toggleTheme}
            filterPreset={filterPreset}
            changeFilterPreset={changeFilterPreset}
            preferredLinkSite={preferredLinkSite}
            changePreferredLinkSite={changePreferredLinkSite}
          />
        </div>
      </div>
    </>
  )
}

export const getStaticProps = async () => {
  const timezone = Time.DEFAULT_TIMEZONE
  const time = Time.validOrNull(timezone)

  return {
    props: {
      tz: timezone,
      now: time ? time.toObject() : null
    },
    revalidate: 3600
  }
}

export default Page
