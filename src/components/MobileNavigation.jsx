import { CloudSun, Heart, LineChart, Wind } from 'lucide-react'
import { NavLink, useSearchParams } from 'react-router'
import { createCityUrl } from '../utils/cityUrl'

function MobileNavigation() {
  const [searchParams] = useSearchParams()
  const city = searchParams.get('city')

  const items = [
    { to: '/', label: '오늘', icon: CloudSun, end: true },
    { to: createCityUrl('/forecast', city), label: '예보', icon: LineChart },
    { to: createCityUrl('/air-quality', city), label: '대기질', icon: Wind },
    { to: '/favorites', label: '저장 도시', icon: Heart },
  ]

  return (
    <nav className="mobile-nav" aria-label="모바일 주요 메뉴">
      {items.map((item) => {
        const Icon = item.icon

        return (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              isActive ? 'mobile-nav-link active' : 'mobile-nav-link'
            }
          >
            <Icon aria-hidden="true" />
            <span>{item.label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}

export default MobileNavigation
