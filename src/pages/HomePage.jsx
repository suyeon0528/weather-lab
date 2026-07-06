import { useEffect, useState } from 'react'
import SearchBar from '../components/SearchBar'
import WeatherCard from '../components/WeatherCard'
import ForecastList from '../components/ForecastList'
import { getWeatherByCity } from '../services/weatherApi'

function HomePage() {
  // city는 검색 input에 입력 중인 값입니다.
  const [city, setCity] = useState('')
  // weatherData는 API에서 받아온 실제 날씨 정보를 저장합니다.
  const [weatherData, setWeatherData] = useState(null)
  // loading은 API 요청이 진행 중인지 알려주는 상태입니다.
  const [loading, setLoading] = useState(false)
  // error는 API 요청 실패나 빈 검색어 안내 문구를 저장합니다.
  const [error, setError] = useState('')

  useEffect(() => {
    console.log('Weather Lab이 시작되었습니다.')
  }, [])

  useEffect(() => {
    console.log(`현재 검색 도시 : ${city || '입력 없음'}`)
  }, [city])

  function handleCityChange(event) {
    setCity(event.target.value)
  }

  async function handleSearch() {
    const trimmedCity = city.trim()

    if (trimmedCity === '') {
      setError('도시 이름을 입력해주세요.')
      setWeatherData(null)
      return
    }

    // 요청이 시작되면 loading을 true로 바꿔 사용자에게 대기 상태를 보여줍니다.
    setLoading(true)
    setError('')

    try {
      // async/await는 fetch 같은 비동기 작업을 순서대로 읽기 쉽게 작성하는 문법입니다.
      const weather = await getWeatherByCity(trimmedCity)
      setWeatherData(weather)
    } catch (error) {
      // catch는 네트워크 실패, 도시 검색 실패 같은 오류를 화면에 보여주기 위해 사용합니다.
      setError(error.message)
      setWeatherData(null)
    } finally {
      // finally는 성공해도 실패해도 마지막에 항상 실행되므로 loading을 끄기에 좋습니다.
      setLoading(false)
    }
  }

  return (
    <main className="home-page">
      {/* SearchBar의 value, onChange, onSearch props 구조는 그대로 유지합니다. */}
      <SearchBar
        value={city}
        onChange={handleCityChange}
        onSearch={handleSearch}
      />

      {loading ? (
        <p className="status-message">날씨 정보를 불러오는 중입니다.</p>
      ) : null}
      {error ? <p className="status-message error">{error}</p> : null}
      {!loading && !error && !weatherData ? (
        <p className="status-message">도시를 검색해보세요.</p>
      ) : null}

      <div className="dashboard">
        {weatherData && (
          <>
            <WeatherCard weather={weatherData} />
            <ForecastList weather={weatherData} />
          </>
        )}
      </div>
    </main>
  )
}

export default HomePage
