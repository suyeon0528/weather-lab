import { Moon, Sunrise, Sunset, SunMedium } from 'lucide-react'
import { formatDuration, formatTime } from '../utils/dateFormat'
import SectionHeader from './SectionHeader'

function getDayProgress(sunrise, sunset, currentTime) {
  if (!sunrise || !sunset || !currentTime) {
    return 0
  }

  const start = new Date(sunrise).getTime()
  const end = new Date(sunset).getTime()
  const now = new Date(currentTime).getTime()

  if (now <= start) {
    return 0
  }

  if (now >= end) {
    return 100
  }

  return Math.round(((now - start) / (end - start)) * 100)
}

function SunriseSunsetCard({ weatherData }) {
  const today = weatherData?.daily?.[0]

  if (!today) {
    return null
  }

  const progress = getDayProgress(
    today.sunrise,
    today.sunset,
    weatherData.current.time,
  )

  return (
    <section className="panel sun-card">
      <SectionHeader
        eyebrow="해와 달"
        title="일출과 일몰"
        description="오늘 낮 길이와 현재 시간의 위치를 확인해보세요."
      />
      <div className="sun-grid">
        <article className="metric-card">
          <Sunrise aria-hidden="true" />
          <span>일출</span>
          <strong>{formatTime(today.sunrise)}</strong>
        </article>
        <article className="metric-card">
          <Sunset aria-hidden="true" />
          <span>일몰</span>
          <strong>{formatTime(today.sunset)}</strong>
        </article>
        <article className="metric-card">
          {weatherData.current.isDay ? (
            <SunMedium aria-hidden="true" />
          ) : (
            <Moon aria-hidden="true" />
          )}
          <span>현재</span>
          <strong>{weatherData.current.isDay ? '낮' : '밤'}</strong>
        </article>
      </div>
      <progress
        className="sun-progress"
        value={progress}
        max="100"
        aria-label={`낮 진행률 ${progress}%`}
      />
      <p className="sun-duration">낮 길이 {formatDuration(today.daylightDuration)}</p>
    </section>
  )
}

export default SunriseSunsetCard
