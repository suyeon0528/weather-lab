import { useEffect } from 'react'

// weather는 HomePage에서 전달받은 props입니다.
// 이 컴포넌트는 전달받은 현재 날씨 정보를 카드 형태로 보여줍니다.
function WeatherCard({ weather }) {
  useEffect(() => {
    // useEffect의 첫 번째 인자는 컴포넌트가 렌더링된 뒤 실행할 함수입니다.
    console.log('WeatherCard가 렌더링되었습니다.')

    // return 안의 함수는 컴포넌트가 화면에서 사라질 때 실행됩니다.
    // 검색 결과가 없어져 WeatherCard가 언마운트되는 순간을 확인할 수 있습니다.
    return () => {
      console.log('WeatherCard가 언마운트되었습니다.')
    }
  }, [])
  // 두 번째 인자 []는 이 effect를 처음 렌더링될 때 한 번만 실행하게 합니다.

  // if 조건문은 데이터가 없을 때 카드 내용을 그리지 않기 위해 사용합니다.
  // 이렇게 하면 undefined 값을 읽으려다 생기는 오류를 막을 수 있습니다.
  if (!weather) {
    return null
  }

  return (
    <section className="weather-card">
      {/* 부모 컴포넌트에서 받은 현재 날씨 데이터를 화면에 표시합니다. */}
      <div>
        <p className="card-label">현재 {weather.city}의 날씨</p>
        <h2>
          {weather.city}, {weather.country}
        </h2>
        <p className="condition">{weather.current.condition}</p>
      </div>

      <div className="temperature">{weather.current.temperature}℃</div>

      <div className="weather-details">
        <div>
          <span>체감 온도</span>
          <strong>{weather.current.feelsLike}℃</strong>
        </div>
        <div>
          <span>습도</span>
          <strong>{weather.current.humidity}%</strong>
        </div>
        <div>
          <span>바람</span>
          <strong>{weather.current.windSpeed} m/s</strong>
        </div>
      </div>
    </section>
  )
}

export default WeatherCard
