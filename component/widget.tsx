import React from 'react'
import { getRandom } from '../helpers/constants'
import Time from '../helpers/time'
import { useTranslation } from '../helpers/i18n'

interface IWidget {
  now: Time
  choice: string
  reason: string
  onChoiceSelected?: (imageUrl: string) => void
}

const Widget = (props: IWidget) => {
  const [choice, setChoices] = React.useState<string>()
  const [reason, setReasons] = React.useState<string>()
  const { t } = useTranslation()

  /**
   * Get the choice key based on current time
   * @return string
   */
  const getChoiceKey = React.useCallback(() => {
    const time = props.now
    if (time.isDayBeforeChristmas()) {
      return 'day_before_christmas'
    }
    if (time.isChristmas()) {
      return 'christmas'
    }
    if (time.isNewYear()) {
      return 'new_year'
    }
    if (time.isFriday13th()) {
      return 'friday_13th'
    }
    return time.formatMonthDay()
  }, [props.now.timezone, props.now.customDate])

  /**
   * Get reasons according to current time
   * @return string[]
   */
  const getChoices = React.useCallback(() => {
    return t(`choices.${getChoiceKey()}`)
  }, [t, getChoiceKey])

  function applyDate(template: string, date: string = new Date().toISOString()) {
    const year = parseInt(date.slice(0, 4), 10)
    const month = parseInt(date.slice(5, 7), 10)
    const day = parseInt(date.slice(8, 10), 10)
    const monthName = new Date(year, month, day).toLocaleString("en-US", { month: "long" });
    const currentYear = new Date().getFullYear()
    const vars: Record<string, string | number> = {
      date: `${day} of ${monthName}`,
      years: currentYear - year
    }
    return template.replace(/\{\{([^}]+)\}\}/g, (_, key) => {
      const value = vars[key.trim()]
      return value !== undefined && value !== null ? String(value) : ""
    })
  }

  /**
   * Update and get random choice
   * @return void
   */
  const updateReasons = React.useCallback(() => {
    const choices = getChoices()
    const choice = getRandom(choices) as {
      type: string
      name: string
      reason: string
      image_path: string
      date: string
      release_date?: string
      first_air_date?: string
      last_air_date?: string
      birthday?: string
      deathday?: string
    }
    let title: string = choice.name
    let reason: string = choice.reason

    if (['released', 'ended', 'canceled', 'birth', 'death', 'date_in_title'].includes(choice.reason)) {
      reason = 'Why? ' + applyDate(getRandom(t(`reasons.${choice.reason}`)), choice.date)
    } else {
      reason = 'Why? ' + applyDate(getRandom(t('reasons.featuring'))) + choice.reason
    }

    if (choice.type === 'movie') {
      title = `${choice.name} (${choice.release_date?.slice(0, 4)})`
    } else if (choice.type === 'tv') {
      title = `${choice.name} (${choice.first_air_date?.slice(0, 4)}-${choice.last_air_date?.slice(0, 4)})`
    } else if (choice.type === 'person') {
      title = choice.name
    } else {
      throw new Error(`Invalid type (${choice.type})`)
    }

    if (choice.image_path) {
      const imageUrl = `https://image.tmdb.org/t/p/original/${choice.image_path}`
      props.onChoiceSelected?.(imageUrl)
    } else {
      props.onChoiceSelected?.('')
    }

    setChoices(title)
    setReasons(reason)
  }, [getChoices])

  React.useEffect(() => {
    updateReasons()
  }, [updateReasons])

  /**
   * On hitting Space reload reasons
   * @return void
   */
  const onSpacePressOrClick = React.useCallback(
    (event: React.MouseEvent | KeyboardEvent) => {
      if (event.type === 'click' || ('key' in event && event.key === ' ')) {
        // Prevent default space bar behavior (scrolling, dropdown triggering)
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

  /**
   * Render widget
   * @return JSX.Element
   */
  return (
    <div className="item">
      <h3 className="tagline">{t('tagline')}</h3>
      <h2 id="title" className="choice">
        {choice}
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
