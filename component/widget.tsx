import React from 'react'
import { getRandom } from '../helpers/constants'
import Time from '../helpers/time'
import { useTranslation } from '../helpers/i18n'
import { PreferredLinkSite } from './filter'

type FilterType = 'movie' | 'tv' | 'person'
type ChoiceType = FilterType

interface Choice {
  type: ChoiceType
  name: string
  reason: string
  tmdb_id: number
  imdb_id: string
  image_path: string | null
  date: string
  release_date?: string
  first_air_date?: string
  last_air_date?: string
  birthday?: string
  deathday?: string
}

interface IWidget {
  now: Time
  choice: string
  reason: string
  filters: Record<FilterType, boolean>
  preferredLinkSite: PreferredLinkSite
  onChoiceSelected?: (imageUrl: string) => void
}

const DATE_RELATED_REASONS = [
  'released',
  'ended',
  'canceled',
  'birth',
  'death',
  'date_in_title'
]

function applyDate(template: string, date: string = new Date().toISOString()) {
  const year = parseInt(date.slice(0, 4), 10)
  const month = parseInt(date.slice(5, 7), 10) - 1
  const day = parseInt(date.slice(8, 10), 10)
  const monthName = new Date(year, month, day).toLocaleString('en-US', {
    month: 'long'
  })
  const currentYear = new Date().getFullYear()
  const vars: Record<string, string | number> = {
    date: `${day} of ${monthName}`,
    years: currentYear - year
  }

  return template.replace(/\{\{([^}]+)\}\}/g, (_, key) => {
    const value = vars[key.trim()]
    return value !== undefined && value !== null ? String(value) : ''
  })
}

const Widget = ({
  now,
  filters,
  preferredLinkSite,
  onChoiceSelected
}: IWidget) => {
  const [choice, setChoice] = React.useState<string>()
  const [reason, setReason] = React.useState<string>()
  const [selectedChoice, setSelectedChoice] = React.useState<Choice | null>(null)
  const sequenceIndexRef = React.useRef(0)
  const { t } = useTranslation()

  const getChoiceUrl = React.useCallback((selected: Choice | null) => {
    if (!selected) {
      return null
    }

    if (preferredLinkSite === 'tmdb') {
      return `https://www.themoviedb.org/${selected.type}/${selected.tmdb_id}`
    }

    if (preferredLinkSite === 'letterboxd') {
      if (selected.type === 'movie') {
        return `https://letterboxd.com/tmdb/${selected.tmdb_id}`
      }
    }

    return selected.type === 'person'
      ? `https://www.imdb.com/name/${selected.imdb_id}`
      : `https://www.imdb.com/title/${selected.imdb_id}`
  }, [preferredLinkSite])

  const choiceUrl = getChoiceUrl(selectedChoice)

  const getChoiceKey = React.useCallback(() => {
    if (now.isDayBeforeChristmas()) {
      return 'day_before_christmas'
    }
    if (now.isChristmas()) {
      return 'christmas'
    }
    if (now.isNewYear()) {
      return 'new_year'
    }
    if (now.isFriday13th()) {
      return 'friday_13th'
    }
    return now.formatMonthDay()
  }, [now.timezone, now.customDate])

  const getChoices = React.useCallback(() => {
    return t(`choices.${getChoiceKey()}`)
  }, [t, getChoiceKey])

  const buildReason = React.useCallback((item: Choice): string => {
    if (DATE_RELATED_REASONS.includes(item.reason)) {
      return 'Why? ' + applyDate(getRandom(t(`reasons.${item.reason}`)), item.date)
    }
    return 'Why? ' + applyDate(getRandom(t('reasons.featuring'))) + ' ' + item.reason
  }, [t])

  const buildTitle = React.useCallback((item: Choice): string => {
    if (item.type === 'movie') {
      return `${item.name} (${item.release_date?.slice(0, 4)})`
    }
    if (item.type === 'tv') {
      return `${item.name} (${item.first_air_date?.slice(0, 4)}-${item.last_air_date?.slice(0, 4)})`
    }
    if (item.type === 'person') {
      return item.name
    }
    throw new Error(`Invalid type (${item.type})`)
  }, [])

  const setSelectedChoiceBackground = React.useCallback((item: Choice) => {
    if (item.image_path) {
      onChoiceSelected?.(`https://image.tmdb.org/t/p/original/${item.image_path}`)
      return
    }
    onChoiceSelected?.('')
  }, [onChoiceSelected])

  const updateReasons = React.useCallback((resetSequence = false) => {
    const choices = getChoices()
    const allChoices = Array.isArray(choices) ? (choices as Choice[]) : []
    const filteredChoices = allChoices.filter((item) => filters[item.type])

    if (resetSequence) {
      sequenceIndexRef.current = 0
    }

    if (filteredChoices.length === 0) {
      setChoice(t('widget.no_results_title'))
      setReason(t('widget.no_results_reason'))
      setSelectedChoice(null)
      sequenceIndexRef.current = 0
      onChoiceSelected?.('')
      return
    }

    const choiceIndex = sequenceIndexRef.current % filteredChoices.length
    const selected = filteredChoices[choiceIndex]
    sequenceIndexRef.current = (choiceIndex + 1) % filteredChoices.length
    const title = buildTitle(selected)
    const nextReason = buildReason(selected)

    setSelectedChoiceBackground(selected)
    setChoice(title)
    setReason(nextReason)
    setSelectedChoice(selected)
  }, [buildReason, buildTitle, filters, getChoices, onChoiceSelected, setSelectedChoiceBackground, t])

  React.useEffect(() => {
    updateReasons(true)
  }, [updateReasons, filters.movie, filters.tv, filters.person])

  const onSpacePressOrClick = React.useCallback(
    (event: React.MouseEvent | KeyboardEvent) => {
      if (event.type === 'click' || ('key' in event && event.key === ' ')) {
        if ('key' in event && event.key === ' ') {
          event.preventDefault()
        }
        updateReasons()
      }
    },
    [updateReasons]
  )

  React.useEffect(() => {
    document.addEventListener('keydown', onSpacePressOrClick)
    return () => {
      document.removeEventListener('keydown', onSpacePressOrClick)
    }
  }, [onSpacePressOrClick])

  return (
    <div className="item">
      <h3 className="tagline">{t('tagline')}</h3>
      <h2 className="choice">
        {choiceUrl ? (
          <a
            id="title"
            className="title-link"
            href={choiceUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={choice}
          >
            {choice}
          </a>
        ) : (
          <span id="title" className="title-link">
            {choice}
          </span>
        )}
      </h2>
      <h3 id="subtitle" className="reason">
        {reason}
      </h3>
      <span id="reload" onClick={onSpacePressOrClick}>
        {t('reload.hit')} <span className="space-btn">{t('reload.space')}</span>{' '}
        {t('reload.or_click')}
      </span>
    </div>
  )
}

export default Widget
