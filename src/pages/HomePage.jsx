import { useEffect, useState } from 'react'
import SearchBar from '../components/SearchBar'
import WeatherCard from '../components/WeatherCard'
import ForecastList from '../components/ForecastList'
import mockWeather from '../data/mockWeather'

function HomePage() {
  // useState는 컴포넌트가 기억해야 하는 값을 만들 때 사용합니다.
  // city는 검색 input에 입력 중인 값이고, HomePage가 부모로서 관리합니다.
  const [city, setCity] = useState('')
  const [weatherData, setWeatherData] = useState(null)
  const [message, setMessage] = useState('도시를 검색해보세요.')

  useEffect(() => {
    // useEffect의 첫 번째 인자는 실행할 작업을 담은 함수입니다.
    // 두 번째 인자 []는 "처음 화면에 나타날 때 한 번만 실행"하라는 뜻입니다.
    console.log('Weather Lab이 시작되었습니다.')
  }, [])

  useEffect(() => {
    // [city]는 city 값이 바뀔 때마다 이 effect를 다시 실행하라는 뜻입니다.
    // input에 입력한 값이 바뀌는 흐름을 콘솔에서 확인할 수 있습니다.
    console.log(`현재 검색 도시 : ${city || '입력 없음'}`)
  }, [city])

  function handleCityChange(event) {
    // input에서 onChange가 발생하면 SearchBar가 이 함수를 호출합니다.
    // event.target.value에는 사용자가 방금 입력한 도시명이 들어 있습니다.
    setCity(event.target.value)
  }

  function handleSearch() {
    const trimmedCity = city.trim()

    if (trimmedCity === '') {
      setMessage('도시 이름을 입력해주세요.')
      setWeatherData(null)
      return
    }

    const foundWeather = mockWeather[trimmedCity]

    // if 조건문은 검색 결과가 있는 경우와 없는 경우를 나누기 위해 사용합니다.
    if (foundWeather) {
      setWeatherData(foundWeather)
      setMessage('')
    } else {
      setWeatherData(null)
      setMessage('검색 결과가 없습니다.')
    }
  }

  return (
    <main className="home-page">
      {/* HomePage는 홈 화면의 검색 기능과 검색 결과만 담당합니다. */}
      {/* value, onChange, onSearch props는 부모인 HomePage에서 SearchBar로 내려갑니다. */}
      <SearchBar
        value={city}
        onChange={handleCityChange}
        onSearch={handleSearch}
      />
      {/* 삼항연산자는 조건에 따라 둘 중 하나를 선택해서 보여줄 때 사용합니다. */}
      {message ? <p className="search-message">{message}</p> : null}

      <div className="dashboard">
        {/* weatherData는 부모인 HomePage에서 자식 컴포넌트로 props로 내려갑니다. */}
        {/* &&는 앞의 값이 있을 때만 뒤의 컴포넌트를 보여주는 조건부 렌더링 방법입니다. */}
        {weatherData && (
          <>
            <WeatherCard weather={weatherData} />
            <ForecastList weather={weatherData} />
          </>
        )}
      </div>
    </main>
  )
}

export default HomePage
