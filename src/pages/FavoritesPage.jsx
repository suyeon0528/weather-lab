import { useEffect, useMemo, useState } from 'react'
import { NavLink } from 'react-router'
import FavoriteCityCard from '../components/FavoriteCityCard'
import SectionHeader from '../components/SectionHeader'
import StatusMessage from '../components/StatusMessage'
import { getWeatherByCoordinates } from '../services/weatherApi'

function FavoritesPage({ favorites, onRemoveFavorite }) {
  const [favoriteWeatherResults, setFavoriteWeatherResults] = useState([])
  const [loading, setLoading] = useState(false)

  const favoriteKey = useMemo(
    () =>
      favorites
        .map((favorite) => `${favorite.latitude}-${favorite.longitude}`)
        .join('|'),
    [favorites],
  )

  useEffect(() => {
    if (favorites.length === 0) {
      return
    }

    let ignore = false

    async function loadFavoriteWeather() {
      setLoading(true)

      // Promise.allSettled는 여러 요청 중 일부가 실패해도 성공한 결과를 잃지 않게 해줍니다.
      const results = await Promise.allSettled(
        favorites.map((favorite) =>
          getWeatherByCoordinates(favorite.latitude, favorite.longitude, favorite),
        ),
      )

      if (!ignore) {
        setFavoriteWeatherResults(results)
        setLoading(false)
      }
    }

    loadFavoriteWeather()

    return () => {
      ignore = true
    }
  }, [favoriteKey, favorites])

  if (favorites.length === 0) {
    return (
      <main className="page">
        <StatusMessage type="empty" title="저장된 도시가 없습니다.">
          자주 확인하는 도시를 즐겨찾기에 추가해보세요.
          <NavLink className="btn btn-primary home-link" to="/">
            홈으로 이동
          </NavLink>
        </StatusMessage>
      </main>
    )
  }

  return (
    <main className="page">
      <section className="panel">
        <SectionHeader
          eyebrow="즐겨찾기"
          title="저장 도시"
          description="저장한 도시의 현재 날씨를 빠르게 확인할 수 있습니다."
        />

        {loading ? (
          <StatusMessage type="loading" title="저장 도시 날씨를 불러오는 중입니다." />
        ) : null}

        <div className="favorite-city-grid">
          {favorites.map((favorite, index) => {
            const result = favoriteWeatherResults[index]
            const weather = result?.status === 'fulfilled' ? result.value : null
            const error =
              result?.status === 'rejected'
                ? '이 도시의 날씨를 불러오지 못했습니다.'
                : ''

            return (
              <FavoriteCityCard
                key={`${favorite.latitude}-${favorite.longitude}`}
                favorite={favorite}
                weather={weather}
                error={error}
                onRemove={onRemoveFavorite}
              />
            )
          })}
        </div>
      </section>
    </main>
  )
}

export default FavoritesPage
