import { getWeatherInfo } from '../utils/weatherCode'

function WeatherCard({ weather, action }) {
  if (!weather) {
    return null
  }

  const weatherInfo = getWeatherInfo(weather.current.weatherCode)

  return (
    <section className="weather-card">
      <div className="weather-card-main">
        <div className="weather-place">
          <p className="card-label">현재 날씨</p>
          <h2>{weather.location.name}</h2>
          {weather.location.region ? <span>{weather.location.region}</span> : null}
        </div>

        <div className="weather-condition">
          <span className="weather-icon" aria-hidden="true">
            {weatherInfo.icon}
          </span>
          <span>{weatherInfo.label}</span>
        </div>
      </div>

      <div className="weather-temperature">
        <strong>{weather.current.temperature}℃</strong>
        <span>현재 기온</span>
      </div>

      {action ? <div className="weather-action">{action}</div> : null}

      <div className="weather-details">
        <div>
          <span>체감 온도</span>
          <strong>{weather.current.apparentTemperature}℃</strong>
        </div>
        <div>
          <span>습도</span>
          <strong>{weather.current.humidity}%</strong>
        </div>
        <div>
          <span>풍속</span>
          <strong>{weather.current.windSpeed} m/s</strong>
        </div>
      </div>
    </section>
  )
}

export default WeatherCard
