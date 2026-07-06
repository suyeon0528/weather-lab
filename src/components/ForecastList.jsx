import { Droplets } from 'lucide-react'
import { getWeatherInfo } from '../utils/weatherCode'
import { formatDayLabel, formatMonthDay } from '../utils/dateFormat'
import WeatherIcon from './WeatherIcon'
import SectionHeader from './SectionHeader'

function formatValue(value, unit = '') {
  return value === null || value === undefined ? '정보 없음' : `${value}${unit}`
}

function ForecastList({ weather }) {
  const forecast = weather?.daily || weather?.forecast || []

  if (!weather || forecast.length === 0) {
    return null
  }

  return (
    <section className="panel forecast-card">
      <SectionHeader
        eyebrow="주간 예보"
        title={`${weather.location.name} 7일 예보`}
        description="날짜별 기온과 비 소식을 비교해보세요."
      />

      <div className="forecast-list">
        {/* map()은 날짜별 예보 배열을 같은 형태의 카드 목록으로 바꿔줍니다. */}
        {forecast.map((day, index) => {
          const weatherInfo = getWeatherInfo(day.weatherCode)

          return (
            <article className="forecast-item" key={day.date}>
              <div className="forecast-date">
                <strong>{formatDayLabel(day.date, index)}</strong>
                <span>{formatMonthDay(day.date)}</span>
              </div>
              <WeatherIcon code={day.weatherCode} />
              <span className="forecast-label">{weatherInfo.label}</span>
              <div className="forecast-temps">
                <b>최고 {formatValue(day.maxTemperature, '℃')}</b>
                <span>최저 {formatValue(day.minTemperature, '℃')}</span>
              </div>
              <small>
                <Droplets size={14} aria-hidden="true" />
                강수확률 {formatValue(day.precipitationProbability, '%')}
              </small>
              <small>예상 강수량 {formatValue(day.precipitationSum, ' mm')}</small>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default ForecastList
