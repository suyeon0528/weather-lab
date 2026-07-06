import { getWeatherInfo } from '../utils/weatherCode'

function WeatherCard({ weather }) {
  if (!weather) {
    return null
  }

  const weatherInfo = getWeatherInfo(weather.current.weatherCode)

  return (
    <section className="weather-card">
      <div>
        <p className="card-label">현재 {weather.location.name}의 날씨</p>
        <h2>
          {weather.location.name}, {weather.location.region}
        </h2>
        <p className="condition">
          <span aria-hidden="true">{weatherInfo.icon}</span> {weatherInfo.label}
        </p>
      </div>

      <div className="temperature">{weather.current.temperature}℃</div>

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
