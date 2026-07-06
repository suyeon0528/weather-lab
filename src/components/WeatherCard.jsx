import { Cloud, Droplets, Gauge, Navigation, Wind } from 'lucide-react'
import { getWeatherInfo } from '../utils/weatherCode'
import { formatDateTime } from '../utils/dateFormat'
import WeatherIcon from './WeatherIcon'

function formatValue(value, unit = '') {
  return value === null || value === undefined ? '정보 없음' : `${value}${unit}`
}

function getWindDirectionLabel(degrees) {
  const value = Number(degrees)

  if (!Number.isFinite(value)) {
    return '정보 없음'
  }

  const directions = [
    '북풍',
    '북동풍',
    '동풍',
    '남동풍',
    '남풍',
    '남서풍',
    '서풍',
    '북서풍',
  ]
  const index = Math.round(value / 45) % directions.length

  return directions[index]
}

function WeatherCard({ weather, action, detailAction }) {
  if (!weather) {
    return null
  }

  const weatherInfo = getWeatherInfo(weather.current.weatherCode)
  const today = weather.daily?.[0]

  return (
    <section className="weather-card">
      <div className="weather-card-top">
        <div className="weather-place">
          <p className="card-label">현재 날씨</p>
          <h2>{weather.location.name}</h2>
          {weather.location.region ? <span>{weather.location.region}</span> : null}
          <small>데이터 기준 {formatDateTime(weather.current.time)}</small>
        </div>
        <div className="weather-actions">
          {action}
          {detailAction}
        </div>
      </div>

      <div className="weather-hero">
        <div className="weather-condition">
          <WeatherIcon code={weather.current.weatherCode} className="weather-hero-icon" />
          <div>
            <strong>{weatherInfo.label}</strong>
            <span>
              최고 {formatValue(today?.maxTemperature, '℃')} · 최저{' '}
              {formatValue(today?.minTemperature, '℃')}
            </span>
          </div>
        </div>

        <div className="weather-temperature">
          <strong>{formatValue(weather.current.temperature, '℃')}</strong>
          <span>현재 기온</span>
        </div>
      </div>

      <div className="weather-details">
        <article className="metric-card">
          <span>체감온도</span>
          <strong>{formatValue(weather.current.apparentTemperature, '℃')}</strong>
        </article>
        <article className="metric-card">
          <Droplets aria-hidden="true" />
          <span>습도</span>
          <strong>{formatValue(weather.current.humidity, '%')}</strong>
        </article>
        <article className="metric-card">
          <Wind aria-hidden="true" />
          <span>풍속</span>
          <strong>{formatValue(weather.current.windSpeed, ' m/s')}</strong>
        </article>
        <article className="metric-card">
          <Navigation aria-hidden="true" />
          <span>풍향</span>
          <strong>{getWindDirectionLabel(weather.current.windDirection)}</strong>
        </article>
        <article className="metric-card">
          <span>돌풍</span>
          <strong>{formatValue(weather.current.windGusts, ' m/s')}</strong>
        </article>
        <article className="metric-card">
          <Droplets aria-hidden="true" />
          <span>강수량</span>
          <strong>{formatValue(weather.current.precipitation, ' mm')}</strong>
        </article>
        <article className="metric-card">
          <Cloud aria-hidden="true" />
          <span>구름량</span>
          <strong>{formatValue(weather.current.cloudCover, '%')}</strong>
        </article>
        <article className="metric-card">
          <Gauge aria-hidden="true" />
          <span>기압</span>
          <strong>{formatValue(weather.current.surfacePressure, ' hPa')}</strong>
        </article>
      </div>
    </section>
  )
}

export default WeatherCard
