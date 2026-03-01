import React from 'react'
import names from '../helpers/timezones'

interface ITimezone {
  onChange: (value: string) => void
  timezone: string
}

const Timezone = (props: ITimezone) => {
  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    props.onChange(event.target.value)
  }
  const options = () => {
    return names.map((name, index) => {
      return (
        <option value={name} key={index}>
          {name}
        </option>
      )
    })
  }
  return (
    <select value={props.timezone} onChange={onChange}>
      {options()}
    </select>
  )
}

export default Timezone
