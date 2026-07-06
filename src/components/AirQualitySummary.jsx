import { NavLink } from 'react-router'
import { Wind } from 'lucide-react'
import { getAqiInfo } from '../utils/airQuality'
import { createCityUrl } from '../utils/cityUrl'
import SectionHeader from './SectionHeader'
import StatusMessage from './StatusMessage'

function formatValue(value, unit = '') {
  return value === null || value === undefined ? '정보 없음' : `${value}${unit}`
}

function AirQualitySummary({ airQualityData, loading, error, city }) {
  if (loading) {
    return <StatusMessage type="loading" title="대기질 정보를 불러오는 중입니다." />
  }

  if (error) {
    return <StatusMessage type="error" title={error} />
  }

  if (!airQualityData) {
    return null
  }

  const aqiInfo = getAqiInfo(airQualityData.current.usAqi)

  return (
    <section className="panel air-summary">
      <SectionHeader
        eyebrow="대기질 요약"
        title={`${airQualityData.location.name} 대기질`}
        description="AQI는 미국 AQI 기준으로 표시합니다."
        action={
          city ? (
            <NavLink className="btn btn-outline" to={createCityUrl('/air-quality', city)}>
              대기질 상세보기
            </NavLink>
          ) : null
        }
      />
      <div className="air-summary-grid">
        <article className={`air-aqi-card aqi-${aqiInfo.level}`}>
          <Wind aria-hidden="true" />
          <span>미국 AQI 기준</span>
          <strong>{formatValue(airQualityData.current.usAqi)}</strong>
          <b>{aqiInfo.label}</b>
          <p>{aqiInfo.description}</p>
        </article>
        <article className="metric-card">
          <span>PM10</span>
          <strong>{formatValue(airQualityData.current.pm10, ' ㎍/㎥')}</strong>
        </article>
        <article className="metric-card">
          <span>PM2.5</span>
          <strong>{formatValue(airQualityData.current.pm25, ' ㎍/㎥')}</strong>
        </article>
        <article className="metric-card">
          <span>자외선 지수</span>
          <strong>{formatValue(airQualityData.current.uvIndex)}</strong>
        </article>
      </div>
    </section>
  )
}

export default AirQualitySummary
