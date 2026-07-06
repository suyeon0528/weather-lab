import { getAqiInfo } from './airQuality.js'

function hasHighRainChance(hourly) {
  return hourly.some((item) => Number(item.precipitationProbability) >= 60)
}

export function createLifestyleTips(weatherData, airQualityData) {
  if (!weatherData) {
    return []
  }

  const tips = []
  const next12Hours = (weatherData.hourly || [])
    // 현재 이후의 시간만 생활 추천 판단에 사용합니다.
    .filter((item) => new Date(item.time) >= new Date())
    .slice(0, 12)
  const today = weatherData.daily?.[0]
  const apparentTemperature = Number(weatherData.current?.apparentTemperature)
  const humidity = Number(weatherData.current?.humidity)
  const aqiInfo = getAqiInfo(airQualityData?.current?.usAqi)

  if (hasHighRainChance(next12Hours)) {
    tips.push({
      type: 'umbrella',
      title: '우산을 챙겨보세요',
      description: '앞으로 12시간 안에 비가 올 가능성이 높아요.',
    })
  }

  if (Number.isFinite(apparentTemperature) && apparentTemperature >= 30) {
    tips.push({
      type: 'heat',
      title: '더위에 주의하세요',
      description: '체감온도가 높아요. 물을 자주 마시고 쉬어가세요.',
    })
  } else if (Number.isFinite(apparentTemperature) && apparentTemperature <= 5) {
    tips.push({
      type: 'cold',
      title: '따뜻한 겉옷이 필요해요',
      description: '체감온도가 낮아서 외출할 때 보온이 중요합니다.',
    })
  }

  if (Number(today?.uvIndexMax) >= 6) {
    tips.push({
      type: 'sun',
      title: '자외선이 강해요',
      description: '자외선 차단제를 바르고 모자나 양산을 준비하세요.',
    })
  }

  if (hasHighRainChance(next12Hours) || humidity >= 80) {
    tips.push({
      type: 'laundry',
      title: '실외 빨래는 천천히',
      description: '습도나 비 소식 때문에 빨래가 잘 마르지 않을 수 있어요.',
    })
  }

  if (Number(airQualityData?.current?.usAqi) >= 101) {
    tips.push({
      type: 'air',
      title: '야외 활동을 줄여보세요',
      description: aqiInfo.description,
    })
  }

  if (tips.length === 0) {
    tips.push({
      type: 'activity',
      title: '가벼운 외출에 좋아요',
      description: '큰 날씨 변수가 적어 일상 활동을 하기 무난합니다.',
    })
  }

  return tips.slice(0, 4)
}
