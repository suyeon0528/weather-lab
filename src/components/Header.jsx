import { NavLink } from 'react-router'

function Header() {
  return (
    <header className="header">
      {/* 화면의 가장 위에서 앱 이름과 간단한 설명을 보여줍니다. */}
      <p className="header-label">오늘의 날씨</p>
      <h1>우리 동네 날씨를 확인해보세요</h1>
      <p className="header-description">
        Open-Meteo API로 현재 날씨와 5일 예보를 확인할 수 있습니다.
      </p>

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
          to="/forecast"
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
