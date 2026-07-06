import { Route, Routes } from 'react-router'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import ForecastPage from './pages/ForecastPage'
import FavoritesPage from './pages/FavoritesPage'
import NotFoundPage from './pages/NotFoundPage'
import './App.css'

function App() {
  return (
    <>
      <Header />

      {/* Routes는 여러 Route 중 현재 URL과 일치하는 Route 하나를 찾아 화면에 보여줍니다. */}
      <Routes>
        {/* path는 연결할 URL 주소이고, element는 그 주소에서 보여줄 컴포넌트입니다. */}
        <Route path="/" element={<HomePage />} />
        <Route path="/forecast" element={<ForecastPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App
