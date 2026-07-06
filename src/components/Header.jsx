import { NavLink, useSearchParams } from 'react-router'

function Header() {
  const [searchParams] = useSearchParams()
  const city = searchParams.get('city')
  const forecastPath = city
    ? `/forecast?city=${encodeURIComponent(city)}`
    : '/forecast'

  return (
    <header className="header">
      <NavLink className="brand" to="/" aria-label="Weather Lab 홈">
        <span className="brand-mark" aria-hidden="true">
          ☀️
        </span>
        <span>Weather Lab</span>
      </NavLink>

      <nav className="nav-menu" aria-label="주요 메뉴">
        {/* NavLink는 현재 URL과 연결된 메뉴에 active 상태를 자동으로 알려줍니다. */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            // isActive가 true이면 현재 접속한 메뉴이므로 active 클래스를 추가합니다.
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
          자세한 예보
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
