export function getWeatherInfo(weatherCode) {
  if (weatherCode === 0) {
    return { label: '맑음', icon: '☀️' }
  }

  if ([1, 2].includes(weatherCode)) {
    return { label: '구름 조금', icon: '🌤️' }
  }

  if (weatherCode === 3) {
    return { label: '흐림', icon: '☁️' }
  }

  if ([45, 48].includes(weatherCode)) {
    return { label: '안개', icon: '🌫️' }
  }

  if ([51, 53, 55, 56, 57].includes(weatherCode)) {
    return { label: '이슬비', icon: '🌦️' }
  }

  if ([80, 81, 82].includes(weatherCode)) {
    return { label: '소나기', icon: '🌦️' }
  }

  if ([61, 63, 65, 66, 67].includes(weatherCode)) {
    return { label: '비', icon: '🌧️' }
  }

  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    return { label: '눈', icon: '❄️' }
  }

  if ([95, 96, 99].includes(weatherCode)) {
    return { label: '뇌우', icon: '⛈️' }
  }

  return { label: '알 수 없음', icon: '🌡️' }
}
