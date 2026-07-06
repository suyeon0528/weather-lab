import { getWeatherInfo } from '../utils/weatherCode'

function ForecastList({ weather }) {
  if (!weather) {
    return null
  }

  return (
    <section className="forecast-card">
      <p className="card-label">{weather.location.name} 5일 예보</p>

      <div className="forecast-list">
        {/* map()은 forecast 배열의 각 날짜 데이터를 하나씩 JSX 카드로 바꿔줍니다. */}
        {weather.forecast.map((day) => {
          const weatherInfo = getWeatherInfo(day.weatherCode)

          return (
            <article className="forecast-item" key={day.date}>
              <strong>{day.date}</strong>
              <span>
                <span aria-hidden="true">{weatherInfo.icon}</span>{' '}
                {weatherInfo.label}
              </span>
              <b>최고 {day.maxTemperature}℃</b>
              <b>최저 {day.minTemperature}℃</b>
              <small>강수확률 {day.precipitationProbability}%</small>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default ForecastList
