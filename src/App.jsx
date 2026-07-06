import { useCallback, useEffect, useState } from 'react'
import { Route, Routes } from 'react-router'
import Header from './components/Header'
import MobileNavigation from './components/MobileNavigation'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ForecastPage from './pages/ForecastPage'
import AirQualityPage from './pages/AirQualityPage'
import FavoritesPage from './pages/FavoritesPage'
import NotFoundPage from './pages/NotFoundPage'
import './App.css'

const FAVORITES_STORAGE_KEY = 'weather-lab-favorites'
const MAX_FAVORITES_COUNT = 8

function App() {
  const [favorites, setFavorites] = useState(() => {
    try {
      // useState 초기화 함수는 첫 렌더링 때 한 번만 실행됩니다.
      // localStorage.getItem은 브라우저 저장소에 있는 문자열 데이터를 꺼냅니다.
      const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY)

      if (!savedFavorites) {
        return []
      }

      // JSON.parse는 localStorage에 저장된 문자열을 다시 배열로 바꿉니다.
      return JSON.parse(savedFavorites)
    } catch {
      return []
    }
  })
  const [favoriteMessage, setFavoriteMessage] = useState('')

  useEffect(() => {
    // favorites가 바뀔 때마다 localStorage에 다시 저장합니다.
    // JSON.stringify는 배열 데이터를 저장 가능한 문자열로 바꿉니다.
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    if (!favoriteMessage) {
      return
    }

    const timer = setTimeout(() => {
      setFavoriteMessage('')
    }, 2000)

    return () => {
      clearTimeout(timer)
    }
  }, [favoriteMessage])

  const clearFavoriteMessage = useCallback(() => {
    setFavoriteMessage('')
  }, [])

  const addFavorite = useCallback(
    (location) => {
      // some은 배열 안에 조건을 만족하는 항목이 하나라도 있는지 확인합니다.
      const alreadySaved = favorites.some(
        (favorite) =>
          favorite.latitude === location.latitude &&
          favorite.longitude === location.longitude,
      )

      if (alreadySaved) {
        setFavoriteMessage('이미 즐겨찾기에 등록된 도시입니다.')
        return
      }

      if (favorites.length >= MAX_FAVORITES_COUNT) {
        setFavoriteMessage('즐겨찾기는 최대 8개까지 저장할 수 있습니다.')
        return
      }

      setFavorites((prevFavorites) => [...prevFavorites, location])
      setFavoriteMessage('즐겨찾기에 추가했습니다.')
    },
    [favorites],
  )

  const removeFavorite = useCallback((location) => {
    // filter는 삭제할 도시를 제외한 새 배열을 만듭니다.
    setFavorites((prevFavorites) =>
      prevFavorites.filter(
        (favorite) =>
          favorite.latitude !== location.latitude ||
          favorite.longitude !== location.longitude,
      ),
    )
    setFavoriteMessage('즐겨찾기에서 삭제했습니다.')
  }, [])

  return (
    <>
      <Header />

      {/* App이 favorites를 관리하면 여러 페이지가 같은 즐겨찾기 데이터를 props로 공유할 수 있습니다. */}
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              favorites={favorites}
              favoriteMessage={favoriteMessage}
              onAddFavorite={addFavorite}
              onRemoveFavorite={removeFavorite}
              onClearFavoriteMessage={clearFavoriteMessage}
            />
          }
        />
        <Route path="/forecast" element={<ForecastPage />} />
        <Route path="/air-quality" element={<AirQualityPage />} />
        <Route
          path="/favorites"
          element={
            <FavoritesPage
              favorites={favorites}
              onRemoveFavorite={removeFavorite}
            />
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Footer />
      <MobileNavigation />
    </>
  )
}

export default App
