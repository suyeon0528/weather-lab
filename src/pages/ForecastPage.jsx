import { useEffect, useMemo, useState } from 'react'
import { NavLink, useSearchParams } from 'react-router'
import HourlyForecastList from '../components/HourlyForecastList'
import StatusMessage from '../components/StatusMessage'
import TemperatureChart from '../components/TemperatureChart'
import PrecipitationChart from '../components/PrecipitationChart'
import ForecastList from '../components/ForecastList'
import { getWeatherByCity } from '../services/weatherApi'

function ForecastPage() {
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  // useSearchParams는 /forecast?city=당진 처럼 URL의 city 값을 읽을 때 사용합니다.
  const [searchParams] = useSearchParams()
  const city = searchParams.get('city')

  useEffect(() => {
    // URL의 city 값이 변경되면 이 useEffect가 다시 실행되어 새 도시 예보를 요청합니다.
    if (!city) {
      return
    }

    let ignore = false

    async function loadForecastWeather() {
      setLoading(true)
      setError('')

      try {
        const data = await getWeatherByCity(city)

        if (!ignore) {
          setWeatherData(data)
        }
      } catch (error) {
        if (!ignore) {
          setError(error.message)
          setWeatherData(null)
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadForecastWeather()

    return () => {
      ignore = true
    }
  }, [city])

  const upcomingHourly = useMemo(() => {
    if (!weatherData) {
      return []
    }

    return weatherData.hourly
      // 현재 시간 이후 데이터만 골라 이미 지난 예보가 섞이지 않게 합니다.
      .filter((item) => new Date(item.time) >= new Date())
      // 상세 페이지에서는 오늘과 내일을 충분히 볼 수 있도록 48개까지만 자릅니다.
      .slice(0, 48)
  }, [weatherData])

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
        <StatusMessage type="loading" title="상세 예보를 불러오는 중입니다." />
      ) : null}

      {error ? (
        <StatusMessage type="error" title={error}>
          <NavLink className="btn btn-primary home-link" to="/">
            홈으로 이동
          </NavLink>
        </StatusMessage>
      ) : null}

      {!loading && !error && weatherData ? (
        <>
          <section className="page-heading">
            <p className="eyebrow">상세 예보</p>
            <h1>
              {weatherData.location.name}, {weatherData.location.region}
            </h1>
            <p>시간별 기온, 강수확률, 바람과 습도 변화를 함께 확인하세요.</p>
          </section>

          <div className="chart-grid">
            <TemperatureChart hourly={upcomingHourly} />
            <PrecipitationChart hourly={upcomingHourly} />
          </div>

          <HourlyForecastList hourly={upcomingHourly} />
          <ForecastList weather={weatherData} />
        </>
      ) : null}
    </main>
  )
}

export default ForecastPage
