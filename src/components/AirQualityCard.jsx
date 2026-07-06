function formatValue(value, unit = '') {
  return value === null || value === undefined ? '정보 없음' : `${value}${unit}`
}

function AirQualityCard({ title, value, unit, description }) {
  return (
    <article className="air-quality-card">
      <span>{title}</span>
      <strong>{formatValue(value, unit)}</strong>
      <p>{description}</p>
    </article>
  )
}

export default AirQualityCard
