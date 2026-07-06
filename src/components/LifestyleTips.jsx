import {
  Activity,
  CloudRain,
  Shirt,
  Sun,
  ThermometerSnowflake,
  ThermometerSun,
  Wind,
} from 'lucide-react'
import { createLifestyleTips } from '../utils/lifestyleTips'
import SectionHeader from './SectionHeader'

const tipIcons = {
  umbrella: CloudRain,
  heat: ThermometerSun,
  cold: ThermometerSnowflake,
  sun: Sun,
  laundry: Shirt,
  air: Wind,
  activity: Activity,
}

function LifestyleTips({ weatherData, airQualityData }) {
  const tips = createLifestyleTips(weatherData, airQualityData)

  return (
    <section className="panel">
      <SectionHeader
        eyebrow="생활 날씨"
        title="오늘 챙기면 좋은 것"
        description="날씨와 대기질을 바탕으로 간단한 생활 팁을 추천합니다."
      />
      <div className="tips-grid">
        {tips.map((tip) => {
          const Icon = tipIcons[tip.type] || Activity

          return (
            <article className="tip-card" key={`${tip.type}-${tip.title}`}>
              <Icon aria-hidden="true" />
              <div>
                <h3>{tip.title}</h3>
                <p>{tip.description}</p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default LifestyleTips
