// weather는 HomePage에서 전달받은 props입니다.
function ForecastList({ weather }) {
  // if 조건문은 예보 데이터가 없을 때 컴포넌트를 렌더링하지 않기 위해 사용합니다.
  if (!weather) {
    return null
  }

  return (
    <section className="forecast-card">
      <p className="card-label">{weather.city} 5일 예보</p>

      <div className="forecast-list">
        {/* map()은 배열의 각 요소를 하나씩 꺼내서 JSX 목록으로 바꿀 때 사용합니다. */}
        {/* forecast 배열에 5개 데이터가 있으므로 예보 카드도 5개 만들어집니다. */}
        {weather.forecast.map((day) => (
          <article className="forecast-item" key={day.id}>
            <strong>{day.day}</strong>
            <span>{day.condition}</span>
            <b>
              {day.high}℃ / {day.low}℃
            </b>
          </article>
        ))}
      </div>
    </section>
  )
}

export default ForecastList
