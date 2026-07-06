import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import SearchBar from '../components/SearchBar'
import WeatherCard from '../components/WeatherCard'
import ForecastList from '../components/ForecastList'
import FavoriteButton from '../components/FavoriteButton'
import StatusMessage from '../components/StatusMessage'
import {
  getWeatherByCity,
  getWeatherByCoordinates,
} from '../services/weatherApi'

const geolocationOptions = {
  // enableHighAccuracy가 false이면 아주 정밀한 위치보다 빠르고 부담이 적은 위치를 우선 사용합니다.
  enableHighAccuracy: false,
  // timeout은 위치 확인을 최대 10초까지만 기다리겠다는 뜻입니다.
  timeout: 10000,
  // maximumAge는 5분 안에 확인한 위치 정보가 있으면 재사용해도 된다는 뜻입니다.
  maximumAge: 300000,
}

function getGeolocationErrorMessage(error) {
  if (error.code === error.PERMISSION_DENIED) {
    return '위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.'
  }

  if (error.code === error.POSITION_UNAVAILABLE) {
    return '현재 위치 정보를 확인할 수 없습니다. 잠시 후 다시 시도해주세요.'
  }

  if (error.code === error.TIMEOUT) {
    return '위치 확인 시간이 초과되었습니다. 다시 시도해주세요.'
  }

  return '현재 위치를 확인하는 중 문제가 발생했습니다.'
}

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
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationError, setLocationError] = useState('')
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
    setLocationError('')
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

  function handleCurrentLocationSearch() {
    setError('')
    setLocationError('')
    onClearFavoriteMessage()

    // navigator.geolocation은 브라우저가 제공하는 현재 위치 확인 기능입니다.
    if (!navigator.geolocation) {
      setLocationError('현재 브라우저에서는 위치 기능을 지원하지 않습니다.')
      setWeatherData(null)
      return
    }

    setLocationLoading(true)
    setWeatherData(null)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        // 성공 콜백은 위치 권한이 허용되고 좌표를 가져왔을 때 실행됩니다.
        // latitude는 위도, longitude는 경도입니다.
        const { latitude, longitude } = position.coords

        try {
          const weather = await getWeatherByCoordinates(latitude, longitude)
          setWeatherData(weather)
          setCity('')
          setSearchParams({})
        } catch (error) {
          setLocationError(error.message)
          setWeatherData(null)
        } finally {
          setLocationLoading(false)
        }
      },
      (error) => {
        // 오류 콜백은 위치 권한 거부, 위치 확인 실패, 시간 초과 같은 상황에서 실행됩니다.
        // 위치 권한은 사용자가 브라우저에서 현재 위치 접근을 허용하거나 거부하는 설정입니다.
        setLocationError(getGeolocationErrorMessage(error))
        setWeatherData(null)
        setLocationLoading(false)
      },
      geolocationOptions,
    )
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
      <section className="home-hero">
        <p className="eyebrow">오늘의 날씨</p>
        <h1>우리 동네 날씨를 확인해보세요</h1>
        <p>현재 날씨부터 5일 예보까지 한눈에 확인할 수 있어요.</p>
      </section>

      <section className="search-panel" aria-label="날씨 검색">
        <SearchBar
          value={city}
          onChange={handleCityChange}
          onSearch={handleSearch}
        />
        <button
          type="button"
          className="btn btn-outline location-weather-button"
          onClick={handleCurrentLocationSearch}
          // disabled는 위치 확인 중 버튼을 다시 누르지 못하게 막습니다.
          disabled={locationLoading}
        >
          {locationLoading ? '위치 확인 중...' : '📍 내 위치 날씨'}
        </button>
      </section>

      {loading ? (
        <StatusMessage type="loading" title="날씨 정보를 불러오는 중입니다." />
      ) : null}
      {locationLoading ? (
        <StatusMessage type="loading" title="현재 위치를 확인하는 중입니다." />
      ) : null}
      {error ? <StatusMessage type="error" title={error} /> : null}
      {locationError ? <StatusMessage type="error" title={locationError} /> : null}
      {!loading && !locationLoading && !error && !locationError && !weatherData ? (
        <StatusMessage
          type="info"
          title="도시를 검색해보세요."
          >
          서울, 부산, 제주처럼 도시 이름을 입력하거나 현재 위치 날씨를 확인할 수 있습니다.
        </StatusMessage>
      ) : null}
      {favoriteMessage && (
        <div
          className={`toast ${
            favoriteMessage.includes('이미') ? 'toast-info' : 'toast-success'
          }`}
          role="status"
          aria-live="polite"
        >
          {favoriteMessage}
        </div>
      )}

      <div className="dashboard">
        {weatherData && (
          <>
            <WeatherCard
              weather={weatherData}
              action={
                <FavoriteButton
                  location={weatherData.location}
                  isFavorite={isCurrentLocationFavorite}
                  onAdd={onAddFavorite}
                  onRemove={onRemoveFavorite}
                />
              }
            />
            <ForecastList weather={weatherData} />
            {weatherData.location.name !== '현재 위치' ? (
              <section className="detail-forecast-cta">
                <div>
                  <p className="card-label">자세한 예보</p>
                  <h2>시간별 변화가 궁금한가요?</h2>
                  <p>앞으로 24시간의 기온, 강수확률, 바람 흐름을 확인해보세요.</p>
                </div>
                <button
                  type="button"
                  className="btn btn-primary detail-forecast-button"
                  onClick={handleViewHourlyForecast}
                >
                  시간대별 자세한 예보 보기 →
                </button>
              </section>
            ) : null}
          </>
        )}
      </div>
    </main>
  )
}

export default HomePage
