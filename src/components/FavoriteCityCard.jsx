import { NavLink } from 'react-router'
import { getWeatherInfo } from '../utils/weatherCode'
import { createCityUrl } from '../utils/cityUrl'
import WeatherIcon from './WeatherIcon'

function formatValue(value, unit = '') {
  return value === null || value === undefined ? '정보 없음' : `${value}${unit}`
}

function FavoriteCityCard({ favorite, weather, error, onRemove }) {
  const weatherInfo = weather ? getWeatherInfo(weather.current.weatherCode) : null
  const today = weather?.daily?.[0]

  return (
    <article className="favorite-city-card">
      <div className="favorite-city-main">
        <div>
          <h2>{favorite.name}</h2>
          <p>{favorite.region}</p>
        </div>
        {weather ? (
          <div className="favorite-city-weather">
            <WeatherIcon code={weather.current.weatherCode} />
            <span>{weatherInfo.label}</span>
          </div>
        ) : null}
      </div>

      {error ? <p className="favorite-error">{error}</p> : null}

      {weather ? (
        <div className="favorite-city-metrics">
          <div>
            <span>현재</span>
            <strong>{formatValue(weather.current.temperature, '℃')}</strong>
          </div>
          <div>
            <span>최고</span>
            <strong>{formatValue(today?.maxTemperature, '℃')}</strong>
          </div>
          <div>
            <span>최저</span>
            <strong>{formatValue(today?.minTemperature, '℃')}</strong>
          </div>
          <div>
            <span>강수확률</span>
            <strong>{formatValue(today?.precipitationProbability, '%')}</strong>
          </div>
        </div>
      ) : null}

      <div className="favorite-actions">
        <NavLink className="btn btn-primary" to={createCityUrl('/', favorite.name)}>
          날씨 보기
        </NavLink>
        <NavLink className="btn btn-outline" to={createCityUrl('/air-quality', favorite.name)}>
          대기질 보기
        </NavLink>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => onRemove(favorite)}
        >
          삭제
        </button>
      </div>
    </article>
  )
}

export default FavoriteCityCard
