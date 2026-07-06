import { Droplets } from 'lucide-react'
import { getWeatherInfo } from '../utils/weatherCode'
import { formatTime } from '../utils/dateFormat'
import WeatherIcon from './WeatherIcon'
import SectionHeader from './SectionHeader'

function formatValue(value, unit = '') {
  return value === null || value === undefined ? '정보 없음' : `${value}${unit}`
}

function HourlyForecast({ hourly }) {
  if (!hourly || hourly.length === 0) {
    return null
  }

  const upcoming = hourly
    // 현재 시간 이후의 데이터만 고르면 사용자가 앞으로의 날씨를 바로 볼 수 있습니다.
    .filter((item) => new Date(item.time) >= new Date())
    // slice로 최대 12개만 보여주면 홈 화면이 너무 길어지지 않습니다.
    .slice(0, 12)

  if (upcoming.length === 0) {
    return null
  }

  return (
    <section className="panel">
      <SectionHeader
        eyebrow="시간별 예보"
        title="앞으로 12시간"
        description="기온과 비 소식을 시간 흐름대로 확인해보세요."
      />
      <div
        className="hourly-strip"
        tabIndex="0"
        aria-label="앞으로 12시간 예보 가로 목록"
      >
        {upcoming.map((item, index) => {
          const weatherInfo = getWeatherInfo(item.weatherCode)

          return (
            <article
              className={`hourly-strip-item ${index === 0 ? 'is-now' : ''}`}
              key={item.time}
            >
              <div className="hourly-strip-time">
                {index === 0 ? <span>지금</span> : null}
                <strong>{formatTime(item.time)}</strong>
              </div>
              <WeatherIcon code={item.weatherCode} />
              <span>{weatherInfo.label}</span>
              <b>{formatValue(item.temperature, '℃')}</b>
              <small>
                <Droplets size={14} aria-hidden="true" />
                강수 {formatValue(item.precipitationProbability, '%')}
              </small>
              <small>강수량 {formatValue(item.precipitation, ' mm')}</small>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default HourlyForecast
