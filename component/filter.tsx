import React from 'react'
import { useTranslation } from '../helpers/i18n'

export type ContentTypeFilter =
  | 'all'
  | 'only_movies'
  | 'only_tv'
  | 'only_people'
export type PreferredLinkSite = 'imdb' | 'tmdb' | 'letterboxd'

interface IFilter {
  value: ContentTypeFilter
  onChange: (value: ContentTypeFilter) => void
}

const contentTypeOptions: Array<{ value: ContentTypeFilter; labelKey: string }> = [
  { value: 'all', labelKey: 'footer.filter_all' },
  { value: 'only_movies', labelKey: 'footer.filter_only_movies' },
  { value: 'only_tv', labelKey: 'footer.filter_only_tv' },
  { value: 'only_people', labelKey: 'footer.filter_only_people' }
]

const linkSiteOptions: Array<{ value: PreferredLinkSite; labelKey: string }> = [
  { value: 'imdb', labelKey: 'footer.imdb' },
  { value: 'tmdb', labelKey: 'footer.tmdb' },
  { value: 'letterboxd', labelKey: 'footer.letterboxd' }
]

const Filter = ({ value, onChange }: IFilter) => {
  const { t } = useTranslation()
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value as ContentTypeFilter)
  }
  return (
    <select value={value} onChange={handleChange}>
      {contentTypeOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {t(option.labelKey)}
        </option>
      ))}
    </select>
  )
}

export default Filter

interface ILinkSiteFilter {
  value: PreferredLinkSite
  onChange: (value: PreferredLinkSite) => void
}

export const LinkSiteFilter = ({ value, onChange }: ILinkSiteFilter) => {
  const { t } = useTranslation()
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value as PreferredLinkSite)
  }
  return (
    <select value={value} onChange={handleChange}>
      {linkSiteOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {t(option.labelKey)}
        </option>
      ))}
    </select>
  )
}
