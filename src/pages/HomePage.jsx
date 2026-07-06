import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import SearchBar from '../components/SearchBar'
import WeatherCard from '../components/WeatherCard'
import ForecastList from '../components/ForecastList'
import FavoriteButton from '../components/FavoriteButton'
import { getWeatherByCity } from '../services/weatherApi'

function HomePage({
  favorites,
  favoriteMessage,
  onAddFavorite,
  onRemoveFavorite,
  onClearFavoriteMessage,
}) {
  const [city, setCity] = useState('')
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  // useSearchParams는 URL 검색 파라미터를 읽고 바꾸는 React Router 훅입니다.
  // URL 검색 파라미터는 /?city=당진 처럼 ? 뒤에 붙는 값입니다.
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const cityFromUrl = searchParams.get('city')

  useEffect(() => {
    console.log('Weather Lab이 시작되었습니다.')
  }, [])

  useEffect(() => {
    console.log(`현재 검색 도시 : ${city || '입력 없음'}`)
  }, [city])

  async function searchWeather(nextCity) {
    const trimmedCity = nextCity.trim()

    if (trimmedCity === '') {
      setError('도시 이름을 입력해주세요.')
      setWeatherData(null)
      return
    }

    setLoading(true)
    setError('')
    onClearFavoriteMessage()

    try {
      const weather = await getWeatherByCity(trimmedCity)
      setWeatherData(weather)
      setCity(trimmedCity)
    } catch (error) {
      setError(error.message)
      setWeatherData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // URL의 city 값이 변경되면 이 useEffect가 다시 실행됩니다.
    // 그래서 /?city=당진 으로 이동하면 당진 날씨를 자동으로 검색할 수 있습니다.
    if (!cityFromUrl) {
      return
    }

    searchWeather(cityFromUrl)
  }, [cityFromUrl])

  function handleCityChange(event) {
    setCity(event.target.value)
  }

  function handleSearch() {
    const trimmedCity = city.trim()
    onClearFavoriteMessage()

    if (trimmedCity === '') {
      setError('도시 이름을 입력해주세요.')
      setWeatherData(null)
      return
    }

    // 직접 검색할 때도 URL에 city 값을 저장합니다.
    // URL이 바뀌면 위의 useEffect가 실행되어 기존 getWeatherByCity 흐름을 재사용합니다.
    if (cityFromUrl === trimmedCity) {
      searchWeather(trimmedCity)
      return
    }

    setSearchParams({ city: trimmedCity })
  }

  function handleViewHourlyForecast() {
    if (!weatherData) {
      return
    }

    navigate(`/forecast?city=${encodeURIComponent(weatherData.location.name)}`)
  }

  const isCurrentLocationFavorite =
    weatherData &&
    favorites.some(
      (favorite) =>
        favorite.latitude === weatherData.location.latitude &&
        favorite.longitude === weatherData.location.longitude,
    )

  return (
    <main className="home-page">
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
      {favoriteMessage && (
        <p className="favorite-message">{favoriteMessage}</p>
      )}

      <div className="dashboard">
        {weatherData && (
          <>
            <FavoriteButton
              location={weatherData.location}
              isFavorite={isCurrentLocationFavorite}
              onAdd={onAddFavorite}
              onRemove={onRemoveFavorite}
            />
            <WeatherCard weather={weatherData} />
            <ForecastList weather={weatherData} />
            <button
              type="button"
              className="detail-forecast-button"
              onClick={handleViewHourlyForecast}
            >
              시간대별 자세한 예보 보기
            </button>
          </>
        )}
      </div>
    </main>
  )
}

export default HomePage
