import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import ForecastPage from './pages/ForecastPage'
import FavoritesPage from './pages/FavoritesPage'
import NotFoundPage from './pages/NotFoundPage'
import './App.css'

const FAVORITES_STORAGE_KEY = 'weather-lab-favorites'

function App() {
  const [favorites, setFavorites] = useState(() => {
    try {
      // useState 초기화 함수는 첫 렌더링 때 한 번만 실행됩니다.
      // localStorage.getItem은 브라우저 저장소에서 문자열 데이터를 꺼냅니다.
      const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY)

      if (!savedFavorites) {
        return []
      }

      // JSON.parse는 localStorage에 저장된 문자열을 배열 데이터로 다시 바꿉니다.
      return JSON.parse(savedFavorites)
    } catch {
      return []
    }
  })
  const [favoriteMessage, setFavoriteMessage] = useState('')

  useEffect(() => {
    // useEffect는 favorites가 바뀐 뒤 localStorage에 저장하는 작업을 맡습니다.
    // JSON.stringify는 배열 데이터를 localStorage에 저장할 수 있는 문자열로 바꿉니다.
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

  function clearFavoriteMessage() {
    setFavoriteMessage('')
  }

  function addFavorite(location) {
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

    setFavorites((prevFavorites) => [...prevFavorites, location])
    setFavoriteMessage('즐겨찾기에 추가했습니다.')
  }

  function removeFavorite(location) {
    // filter는 조건에 맞는 항목만 남겨 새 배열을 만듭니다.
    setFavorites((prevFavorites) =>
      prevFavorites.filter(
        (favorite) =>
          favorite.latitude !== location.latitude ||
          favorite.longitude !== location.longitude,
      ),
    )
    setFavoriteMessage('즐겨찾기에서 삭제했습니다.')
  }

  return (
    <>
      <Header />

      {/* 부모 컴포넌트인 App이 favorites를 관리하면 여러 페이지가 같은 데이터를 props로 받을 수 있습니다. */}
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
    </>
  )
}

export default App
