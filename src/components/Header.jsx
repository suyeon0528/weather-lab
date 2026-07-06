import { CloudSun } from 'lucide-react'
import { NavLink, useSearchParams } from 'react-router'
import { createCityUrl } from '../utils/cityUrl'

function Header() {
  const [searchParams] = useSearchParams()
  const city = searchParams.get('city')
  const forecastPath = createCityUrl('/forecast', city)
  const airQualityPath = createCityUrl('/air-quality', city)

  return (
    <header className="header">
      <NavLink className="brand" to="/" aria-label="Weather Lab 홈">
        <span className="brand-mark" aria-hidden="true">
          <CloudSun />
        </span>
        <span>Weather Lab</span>
      </NavLink>

      <nav className="nav-menu" aria-label="주요 메뉴">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? 'nav-link active' : 'nav-link'
          }
        >
          오늘의 날씨
        </NavLink>
        <NavLink
          to={forecastPath}
          className={({ isActive }) =>
            isActive ? 'nav-link active' : 'nav-link'
          }
        >
          상세 예보
        </NavLink>
        <NavLink
          to={airQualityPath}
          className={({ isActive }) =>
            isActive ? 'nav-link active' : 'nav-link'
          }
        >
          대기질
        </NavLink>
        <NavLink
          to="/favorites"
          className={({ isActive }) =>
            isActive ? 'nav-link active' : 'nav-link'
          }
        >
          즐겨찾기
        </NavLink>
      </nav>
    </header>
  )
}

export default Header
