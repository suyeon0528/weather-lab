import { getWeatherInfo } from '../utils/weatherCode'

const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
  month: 'long',
  day: 'numeric',
})

const timeFormatter = new Intl.DateTimeFormat('ko-KR', {
  hour: 'numeric',
  hour12: true,
})

function getDateKey(time) {
  return time.slice(0, 10)
}

function getDayLabel(dateKey) {
  const today = new Date()
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(today.getDate()).padStart(2, '0')}`
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowKey = `${tomorrow.getFullYear()}-${String(
    tomorrow.getMonth() + 1,
  ).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`
  const labelDate = new Date(`${dateKey}T00:00`)

  if (dateKey === todayKey) {
    return `오늘 · ${dateFormatter.format(labelDate)}`
  }

  if (dateKey === tomorrowKey) {
    return `내일 · ${dateFormatter.format(labelDate)}`
  }

  return dateFormatter.format(labelDate)
}

function groupHourlyByDate(hourly) {
  return hourly.reduce((groups, item) => {
    const dateKey = getDateKey(item.time)
    const existingGroup = groups.find((group) => group.dateKey === dateKey)

    if (existingGroup) {
      existingGroup.items.push(item)
      return groups
    }

    return [...groups, { dateKey, items: [item] }]
  }, [])
}

function HourlyForecastList({ hourly }) {
  if (!hourly || hourly.length === 0) {
    return null
  }

  const groupedHourly = groupHourlyByDate(hourly)
  const nearestTime = hourly[0]?.time

  return (
    <section className="hourly-card">
      <div className="hourly-card-header">
        <p className="card-label">시간대별 예보</p>
        <p>시간 순서대로 비 소식과 기온 변화를 확인할 수 있습니다.</p>
      </div>

      <div className="hourly-groups">
        {groupedHourly.map((group) => (
          <div className="hourly-group" key={group.dateKey}>
            <h3>{getDayLabel(group.dateKey)}</h3>

            <div className="hourly-list">
              {/* map은 시간대별 배열을 화면에 표시할 리스트 항목으로 바꿉니다. */}
              {group.items.map((item) => {
                const weatherInfo = getWeatherInfo(item.weatherCode)
                const date = new Date(item.time)
                const isNearest = item.time === nearestTime

                return (
                  <article
                    className={`hourly-item ${isNearest ? 'is-nearest' : ''}`}
                    key={item.time}
                  >
                    <div className="hourly-time">
                      <strong>{timeFormatter.format(date)}</strong>
                      {isNearest ? (
                        <span className="hourly-badge">지금과 가까운 시간</span>
                      ) : null}
                    </div>

                    <div className="hourly-weather">
                      <span className="hourly-icon" aria-hidden="true">
                        {weatherInfo.icon}
                      </span>
                      <span>{weatherInfo.label}</span>
                    </div>

                    <div className="hourly-main">
                      <b>{item.temperature}℃</b>
                      <span>강수확률 {item.precipitationProbability}%</span>
                    </div>

                    <dl className="hourly-sub">
                      <div>
                        <dt>체감</dt>
                        <dd>{item.apparentTemperature}℃</dd>
                      </div>
                      <div>
                        <dt>습도</dt>
                        <dd>{item.humidity}%</dd>
                      </div>
                      <div>
                        <dt>풍속</dt>
                        <dd>{item.windSpeed} m/s</dd>
                      </div>
                    </dl>
                  </article>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default HourlyForecastList
