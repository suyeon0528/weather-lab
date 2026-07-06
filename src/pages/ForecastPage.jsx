import { useEffect, useState } from 'react'
import { NavLink, useSearchParams } from 'react-router'
import HourlyForecastList from '../components/HourlyForecastList'
import { getHourlyWeatherByCity } from '../services/weatherApi'

function ForecastPage() {
  const [hourlyWeather, setHourlyWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  // useSearchParams는 /forecast?city=당진 처럼 URL 검색 파라미터를 읽을 때 사용합니다.
  const [searchParams] = useSearchParams()
  const city = searchParams.get('city')

  useEffect(() => {
    // URL의 city 값이 변경되면 이 useEffect가 다시 실행됩니다.
    // 그래서 /forecast?city=서울 에서 /forecast?city=부산 으로 바뀌면 새 도시를 다시 요청합니다.
    if (!city) {
      setHourlyWeather(null)
      setError('')
      return
    }

    let ignore = false

    async function loadHourlyWeather() {
      setLoading(true)
      setError('')

      try {
        const data = await getHourlyWeatherByCity(city)

        if (!ignore) {
          setHourlyWeather(data)
        }
      } catch (error) {
        if (!ignore) {
          setError(error.message)
          setHourlyWeather(null)
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadHourlyWeather()

    return () => {
      ignore = true
    }
  }, [city])

  const now = new Date()
  const upcomingHourly = hourlyWeather
    ? hourlyWeather.hourly
        // filter는 현재 시간 이후의 데이터만 고를 때 사용합니다.
        // 이미 지난 시간대는 사용자에게 덜 유용하므로 제외합니다.
        .filter((item) => new Date(item.time) >= now)
        // slice는 너무 많은 카드가 한 번에 보이지 않도록 앞에서 24개만 자릅니다.
        .slice(0, 24)
    : []

  if (!city) {
    return (
      <main className="page">
        <section className="info-card">
          <p className="card-label">자세한 예보</p>
          <h2>먼저 오늘의 날씨 페이지에서 도시를 검색해주세요.</h2>
          <NavLink className="home-link" to="/">
            홈으로 이동
          </NavLink>
        </section>
      </main>
    )
  }

  return (
    <main className="page">
      {loading ? (
        <p className="status-message">시간대별 예보를 불러오는 중입니다.</p>
      ) : null}

      {error ? (
        <section className="info-card">
          <p className="card-label">오류</p>
          <h2>{error}</h2>
          <NavLink className="home-link" to="/">
            홈으로 이동
          </NavLink>
        </section>
      ) : null}

      {!loading && !error && hourlyWeather ? (
        <>
          <section className="info-card forecast-heading">
            <p className="card-label">자세한 예보</p>
            <h2>
              {hourlyWeather.location.name}, {hourlyWeather.location.region}
            </h2>
            <p>
              시간대별 날씨를 확인하고 비 소식과 기온 변화를 한눈에
              살펴보세요.
            </p>
          </section>
          <HourlyForecastList hourly={upcomingHourly} />
        </>
      ) : null}
    </main>
  )
}

export default ForecastPage
