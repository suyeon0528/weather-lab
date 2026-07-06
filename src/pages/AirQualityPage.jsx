import { useEffect, useMemo, useState } from 'react'
import { NavLink, useSearchParams } from 'react-router'
import AirQualityCard from '../components/AirQualityCard'
import AirQualityChart from '../components/AirQualityChart'
import SectionHeader from '../components/SectionHeader'
import StatusMessage from '../components/StatusMessage'
import { getAirQualityByCity } from '../services/airQualityApi'
import { getAqiInfo } from '../utils/airQuality'
import { formatDateTime } from '../utils/dateFormat'

function AirQualityPage() {
  const [airQualityData, setAirQualityData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchParams] = useSearchParams()
  const city = searchParams.get('city')

  useEffect(() => {
    if (!city) {
      return
    }

    let ignore = false

    async function loadAirQuality() {
      setLoading(true)
      setError('')

      try {
        const data = await getAirQualityByCity(city)

        if (!ignore) {
          setAirQualityData(data)
        }
      } catch (error) {
        if (!ignore) {
          setError(error.message)
          setAirQualityData(null)
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadAirQuality()

    return () => {
      ignore = true
    }
  }, [city])

  const aqiInfo = useMemo(
    () => getAqiInfo(airQualityData?.current?.usAqi),
    [airQualityData],
  )

  if (!city) {
    return (
      <main className="page">
        <StatusMessage
          type="info"
          title="먼저 오늘의 날씨 페이지에서 도시를 검색해주세요."
        >
          <NavLink className="btn btn-primary home-link" to="/">
            홈으로 이동
          </NavLink>
        </StatusMessage>
      </main>
    )
  }

  return (
    <main className="page">
      {loading ? (
        <StatusMessage type="loading" title="대기질 정보를 불러오는 중입니다." />
      ) : null}

      {error ? (
        <StatusMessage type="error" title={error}>
          <NavLink className="btn btn-primary home-link" to="/">
            홈으로 이동
          </NavLink>
        </StatusMessage>
      ) : null}

      {!loading && !error && airQualityData ? (
        <>
          <section className="page-heading">
            <p className="eyebrow">대기질</p>
            <h1>
              {airQualityData.location.name}, {airQualityData.location.region}
            </h1>
            <p>미국 AQI 기준과 주요 대기질 지표를 함께 확인하세요.</p>
          </section>

          <section className={`panel air-quality-hero aqi-${aqiInfo.level}`}>
            <div>
              <p className="card-label">현재 대기질 · 미국 AQI 기준</p>
              <h2>{airQualityData.location.name} 대기질</h2>
              <small>데이터 기준 {formatDateTime(airQualityData.current.time)}</small>
            </div>
            <div className="aqi-score">
              <strong>{airQualityData.current.usAqi ?? '정보 없음'}</strong>
              <span>{aqiInfo.label}</span>
              <p>{aqiInfo.description}</p>
            </div>
          </section>

          <section className="panel">
            <SectionHeader
              eyebrow="현재 수치"
              title="주요 대기질 지표"
              description="PM10과 PM2.5는 수치만 표시하며 별도 등급은 임의로 만들지 않습니다."
            />
            <div className="air-quality-grid">
              <AirQualityCard
                title="PM10"
                value={airQualityData.current.pm10}
                unit=" ㎍/㎥"
                description="미세먼지 농도입니다."
              />
              <AirQualityCard
                title="PM2.5"
                value={airQualityData.current.pm25}
                unit=" ㎍/㎥"
                description="초미세먼지 농도입니다."
              />
              <AirQualityCard
                title="자외선 지수"
                value={airQualityData.current.uvIndex}
                description="햇빛 노출에 참고할 수 있는 지표입니다."
              />
              <AirQualityCard
                title="오존"
                value={airQualityData.current.ozone}
                unit=" ㎍/㎥"
                description="햇빛이 강한 날 높아질 수 있습니다."
              />
              <AirQualityCard
                title="이산화질소"
                value={airQualityData.current.nitrogenDioxide}
                unit=" ㎍/㎥"
                description="교통량과 연관이 있는 대기 오염 물질입니다."
              />
            </div>
          </section>

          <AirQualityChart hourly={airQualityData.hourly} />

          <section className="panel health-guide">
            <SectionHeader
              eyebrow="건강 안내"
              title={aqiInfo.label}
              description={aqiInfo.description}
            />
            <p>
              이 안내는 의료 진단이 아니라 일상 활동을 조절하기 위한 일반적인
              생활 정보입니다.
            </p>
          </section>
        </>
      ) : null}
    </main>
  )
}

export default AirQualityPage
