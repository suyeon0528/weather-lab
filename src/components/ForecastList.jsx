import { getWeatherInfo } from '../utils/weatherCode'

const forecastDateFormatter = new Intl.DateTimeFormat('ko-KR', {
  weekday: 'short',
  month: 'numeric',
  day: 'numeric',
})

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
          const date = new Date(`${day.date}T00:00`)

          return (
            <article className="forecast-item" key={day.date}>
              <strong>{forecastDateFormatter.format(date)}</strong>
              <span className="forecast-icon" aria-hidden="true">
                {weatherInfo.icon}
              </span>
              <span className="forecast-label">{weatherInfo.label}</span>
              <div className="forecast-temps">
                <b>최고 {day.maxTemperature}℃</b>
                <span>최저 {day.minTemperature}℃</span>
              </div>
              <small>강수확률 {day.precipitationProbability}%</small>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default ForecastList
