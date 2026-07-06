import { getWeatherInfo } from '../utils/weatherCode'

const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
  month: 'long',
  day: 'numeric',
})

const timeFormatter = new Intl.DateTimeFormat('ko-KR', {
  hour: 'numeric',
  hour12: true,
})

function HourlyForecastList({ hourly }) {
  if (!hourly || hourly.length === 0) {
    return null
  }

  return (
    <section className="hourly-card">
      <p className="card-label">시간대별 예보</p>

      <div className="hourly-list">
        {/* map은 시간대별 배열을 화면에 표시할 카드 목록으로 바꿉니다. */}
        {hourly.map((item) => {
          const weatherInfo = getWeatherInfo(item.weatherCode)
          const date = new Date(item.time)

          return (
            <article className="hourly-item" key={item.time}>
              <strong>{dateFormatter.format(date)}</strong>
              <span>{timeFormatter.format(date)}</span>
              <p>
                <span aria-hidden="true">{weatherInfo.icon}</span>{' '}
                {weatherInfo.label}
              </p>
              <b>{item.temperature}℃</b>
              <small>체감 {item.apparentTemperature}℃</small>
              <small>습도 {item.humidity}%</small>
              <small>강수확률 {item.precipitationProbability}%</small>
              <small>풍속 {item.windSpeed} m/s</small>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default HourlyForecastList
