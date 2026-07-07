import { useMemo, useState } from 'react'
import { getWeatherInfo } from '../utils/weatherCode'
import WeatherIcon from './WeatherIcon'

const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
  month: 'long',
  day: 'numeric',
  weekday: 'short',
})

const timeFormatter = new Intl.DateTimeFormat('ko-KR', {
  hour: 'numeric',
  hour12: true,
})

function formatValue(value, unit = '') {
  return value === null || value === undefined ? '정보 없음' : `${value}${unit}`
}

function getDateKey(time) {
  return time.slice(0, 10)
}

function getTodayKey() {
  const today = new Date()

  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(today.getDate()).padStart(2, '0')}`
}

function getTomorrowKey() {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  return `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(tomorrow.getDate()).padStart(2, '0')}`
}

function getDayTitle(dateKey) {
  return dateFormatter.format(new Date(`${dateKey}T00:00`))
}

function getNearestHour(hours) {
  if (hours.length === 0) {
    return null
  }

  const now = Date.now()

  return hours.reduce((nearest, item) => {
    const currentGap = Math.abs(new Date(item.time).getTime() - now)
    const nearestGap = Math.abs(new Date(nearest.time).getTime() - now)

    return currentGap < nearestGap ? item : nearest
  }, hours[0])
}

function HourlyForecastList({ hourly }) {
  const [selectedDayKey, setSelectedDayKey] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [isAllHoursOpen, setIsAllHoursOpen] = useState(false)

  const todayKey = getTodayKey()
  const tomorrowKey = getTomorrowKey()

  const dayOptions = useMemo(() => {
    if (!hourly || hourly.length === 0) {
      return []
    }

    const options = [
      {
        key: todayKey,
        label: '오늘',
        items: hourly.filter((item) => getDateKey(item.time) === todayKey),
      },
      {
        key: tomorrowKey,
        label: '내일',
        items: hourly.filter((item) => getDateKey(item.time) === tomorrowKey),
      },
    ]

    return options.filter((option) => option.items.length > 0)
  }, [hourly, todayKey, tomorrowKey])

  const defaultDayKey = dayOptions[0]?.key || ''
  const activeDayKey = dayOptions.some((option) => option.key === selectedDayKey)
    ? selectedDayKey
    : defaultDayKey
  const selectedDay = dayOptions.find((option) => option.key === activeDayKey)
  const visibleHours = selectedDay?.items || []
  const nearestHour = activeDayKey === todayKey ? getNearestHour(visibleHours) : null
  const defaultHour = nearestHour || visibleHours[0]
  const selectedHour =
    visibleHours.find((item) => item.time === selectedTime) ||
    defaultHour

  if (!hourly || hourly.length === 0 || dayOptions.length === 0 || !selectedHour) {
    return null
  }

  const selectedWeatherInfo = getWeatherInfo(selectedHour.weatherCode)
  const selectedDate = new Date(selectedHour.time)

  return (
    <section className="hourly-card panel">
      <div className="hourly-card-header">
        <div>
          <p className="card-label">시간대별 예보</p>
          <h2>시간 흐름으로 비교하기</h2>
          <p>오늘과 내일의 기온, 날씨, 강수확률을 가로 타임라인에서 빠르게 확인하세요.</p>
        </div>

        <div className="hourly-day-tabs" role="tablist" aria-label="날짜 선택">
          {dayOptions.map((option) => {
            const isSelected = option.key === activeDayKey

            return (
              <button
                type="button"
                className={`hourly-day-tab ${isSelected ? 'is-selected' : ''}`}
                role="tab"
                aria-selected={isSelected}
                key={option.key}
                onClick={() => {
                  setSelectedDayKey(option.key)
                  setSelectedTime('')
                }}
              >
                <span>{option.label}</span>
                <small>{getDayTitle(option.key)}</small>
              </button>
            )
          })}
        </div>
      </div>

      <div className="hourly-timeline" aria-label={`${selectedDay?.label} 시간대별 예보`}>
        {visibleHours.map((item) => {
          const weatherInfo = getWeatherInfo(item.weatherCode)
          const date = new Date(item.time)
          const isSelected = item.time === selectedHour.time
          const isNearest = nearestHour?.time === item.time

          return (
            <button
              type="button"
              className={`hourly-timeline-item ${isSelected ? 'is-selected' : ''}`}
              key={item.time}
              aria-pressed={isSelected}
              onClick={() => setSelectedTime(item.time)}
            >
              <span className="hourly-timeline-time">{timeFormatter.format(date)}</span>
              {isNearest ? <span className="hourly-badge">지금 근처</span> : null}
              <WeatherIcon code={item.weatherCode} className="hourly-icon" />
              <strong>{formatValue(item.temperature, '℃')}</strong>
              <small>강수 {formatValue(item.precipitationProbability, '%')}</small>
              <span className="sr-only">{weatherInfo.label}</span>
            </button>
          )
        })}
      </div>

      <article className="hourly-detail-panel">
        <div className="hourly-detail-main">
          <div>
            <p className="card-label">선택한 시간</p>
            <h3>
              {getDayTitle(getDateKey(selectedHour.time))} ·{' '}
              {timeFormatter.format(selectedDate)}
            </h3>
          </div>

          <div className="hourly-detail-weather">
            <WeatherIcon code={selectedHour.weatherCode} className="hourly-detail-icon" />
            <div>
              <strong>{selectedWeatherInfo.label}</strong>
              <span>강수확률 {formatValue(selectedHour.precipitationProbability, '%')}</span>
            </div>
          </div>

          <div className="hourly-detail-temp">
            <strong>{formatValue(selectedHour.temperature, '℃')}</strong>
            <span>예상 기온</span>
          </div>
        </div>

        <dl className="hourly-detail-grid">
          <div>
            <dt>체감온도</dt>
            <dd>{formatValue(selectedHour.apparentTemperature, '℃')}</dd>
          </div>
          <div>
            <dt>습도</dt>
            <dd>{formatValue(selectedHour.humidity, '%')}</dd>
          </div>
          <div>
            <dt>풍속</dt>
            <dd>{formatValue(selectedHour.windSpeed, ' m/s')}</dd>
          </div>
          <div>
            <dt>돌풍</dt>
            <dd>{formatValue(selectedHour.windGusts, ' m/s')}</dd>
          </div>
          <div>
            <dt>강수량</dt>
            <dd>{formatValue(selectedHour.precipitation, ' mm')}</dd>
          </div>
          <div>
            <dt>구름량</dt>
            <dd>{formatValue(selectedHour.cloudCover, '%')}</dd>
          </div>
        </dl>
      </article>

      <div className="hourly-all">
        <button
          type="button"
          className="btn btn-outline hourly-all-toggle"
          onClick={() => setIsAllHoursOpen((isOpen) => !isOpen)}
          aria-expanded={isAllHoursOpen}
        >
          {isAllHoursOpen ? '전체 시간 접기' : '전체 시간 펼쳐보기'}
        </button>

        {isAllHoursOpen ? (
          <div className="hourly-compact-list">
            {visibleHours.map((item) => {
              const weatherInfo = getWeatherInfo(item.weatherCode)

              return (
                <div className="hourly-compact-row" key={item.time}>
                  <span>{timeFormatter.format(new Date(item.time))}</span>
                  <span>{weatherInfo.label}</span>
                  <strong>{formatValue(item.temperature, '℃')}</strong>
                  <span>체감 {formatValue(item.apparentTemperature, '℃')}</span>
                  <span>강수 {formatValue(item.precipitationProbability, '%')}</span>
                  <span>습도 {formatValue(item.humidity, '%')}</span>
                  <span>풍속 {formatValue(item.windSpeed, ' m/s')}</span>
                </div>
              )
            })}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default HourlyForecastList
