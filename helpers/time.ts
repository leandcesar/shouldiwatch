export default class Time {
  static DEFAULT_TIMEZONE = 'UTC'
  timezone: string
  customDate: Date | null

  constructor(timezone: string | null = null, customDate?: string) {
    this.timezone = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone

    if (customDate) {
      const utcDate = new Date(customDate + 'T00:00:00Z')
      const offset = utcDate.getTimezoneOffset() * 60 * 1000
      this.customDate = new Date(utcDate.getTime() + offset)
    } else {
      this.customDate = null
    }
  }

  toObject() {
    return {
      timezone: this.timezone,
      customDate: this.customDate
    }
  }

  setTimezone(timezone: string) {
    if (Time.zoneExists(timezone)) {
      this.timezone = timezone
    }
  }

  private getTimezoneDate(): Date {
    const timeZoneDate = new Date().toLocaleString('en-US', {
      timeZone: this.timezone
    })
    return new Date(timeZoneDate)
  }

  getDate(): Date {
    if (this.customDate) {
      return this.customDate
    }
    return this.getTimezoneDate()
  }

  formatMonthDay(): string {
    const date = this.getDate()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${month}-${day}`
  }

  static zoneExists(timeZone: string): boolean {
    try {
      Intl.DateTimeFormat('en-US', { timeZone }).format(Date.now())
      return true
    } catch {
      return false
    }
  }

  static validOrNull(timezone: string | null) {
    const resolvedTimezone = timezone || Time.DEFAULT_TIMEZONE
    return this.zoneExists(resolvedTimezone) ? new Time(resolvedTimezone) : null
  }

  now(): Date {
    return this.getDate()
  }

  isFriday(): boolean {
    return this.getDate().getDay() === 5
  }

  is13th(): boolean {
    return this.getDate().getDate() === 13
  }

  isFriday13th(): boolean {
    return this.isFriday() && this.is13th()
  }

  isDayBeforeChristmas(): boolean {
    return (
      this.getDate().getMonth() === 11 &&
      this.getDate().getDate() === 24 &&
      this.getDate().getHours() >= 16
    )
  }

  isChristmas(): boolean {
    return this.getDate().getMonth() === 11 && this.getDate().getDate() === 25
  }

  isNewYear(): boolean {
    return (
      (this.now().getMonth() === 11 &&
        this.now().getDate() === 31 &&
        this.now().getHours() >= 16) ||
      (this.now().getMonth() === 0 && this.now().getDate() === 1)
    )
  }

  isHolidays(): boolean {
    return this.isDayBeforeChristmas() || this.isChristmas() || this.isNewYear()
  }
}
