import { koreanCityAliases } from '../data/koreanCityAliases.js'

const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_API_URL = 'https://api.open-meteo.com/v1/forecast'

function normalizeText(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
}

function formatLocationName(name) {
  return String(name || '')
    .replace(/특별자치시$/, '')
    .replace(/특별자치도$/, '')
    .replace(/특별시$/, '')
    .replace(/광역시$/, '')
    .replace(/시$/, '')
    .trim()
}

function isSameAdmin1(location, alias) {
  if (!alias?.admin1) {
    return false
  }

  const locationAdmin1 = normalizeText(location.admin1)

  return alias.admin1.some((admin1) => normalizeText(admin1) === locationAdmin1)
}

function selectBestLocation(results, alias) {
  const koreaResults = results.filter((location) => location.country_code === 'KR')

  if (koreaResults.length === 0) {
    return null
  }

  // 한글 별칭에 기대 행정구역(admin1)이 있으면 해당 행정구역과 일치하는 결과를 우선 선택합니다.
  const adminMatchedLocation = koreaResults.find((location) =>
    isSameAdmin1(location, alias),
  )

  if (adminMatchedLocation) {
    return adminMatchedLocation
  }

  // 정확한 행정구역을 찾지 못하면 대한민국 결과 중 인구가 가장 많은 결과를 선택합니다.
  return [...koreaResults].sort(
    (a, b) => (b.population || 0) - (a.population || 0),
  )[0]
}

export async function searchLocation(city) {
  const trimmedCity = city.trim()

  if (trimmedCity === '') {
    throw new Error('도시 이름을 입력해주세요.')
  }

  // 한글 도시명이 별칭 목록에 있으면 Open-Meteo가 잘 찾는 영문 이름으로 바꿔서 검색합니다.
  // 예: 사용자가 "서울"을 입력하면 API에는 "Seoul"로 요청합니다.
  const alias = koreanCityAliases[trimmedCity]
  const apiSearchCity = alias?.query || trimmedCity
  const encodedCity = encodeURIComponent(apiSearchCity)
  const url = `${GEOCODING_API_URL}?name=${encodedCity}&count=10&language=ko&countryCode=KR&format=json`

  // fetch는 브라우저에 기본으로 들어 있는 네트워크 요청 함수입니다.
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('도시 검색 요청에 실패했습니다.')
  }

  const data = await response.json()
  const location = selectBestLocation(data.results || [], alias)

  if (!location) {
    throw new Error('도시를 찾을 수 없습니다.')
  }

  console.log('선택된 지역:', {
    name: location.name,
    admin1: location.admin1,
    latitude: location.latitude,
    longitude: location.longitude,
  })

  return {
    // 화면에는 사용자가 조합한 이름이 아니라 Geocoding API가 반환한 실제 지역명을 보여줍니다.
    name: formatLocationName(location.name),
    region: location.admin1 || location.country || '대한민국',
    latitude: location.latitude,
    longitude: location.longitude,
  }
}

export async function getWeatherByCoordinates(latitude, longitude, location) {
  const currentParams = [
    'temperature_2m',
    'relative_humidity_2m',
    'apparent_temperature',
    'weather_code',
    'wind_speed_10m',
  ].join(',')
  const dailyParams = [
    'weather_code',
    'temperature_2m_max',
    'temperature_2m_min',
    'precipitation_probability_max',
  ].join(',')
  const url =
    `${FORECAST_API_URL}?latitude=${latitude}&longitude=${longitude}` +
    `&current=${currentParams}&daily=${dailyParams}` +
    '&timezone=auto&forecast_days=5&wind_speed_unit=ms'

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('날씨 정보를 불러오지 못했습니다.')
  }

  const data = await response.json()

  return {
    location: {
      name: location.name,
      region: location.region,
      latitude,
      longitude,
    },
    current: {
      temperature: data.current.temperature_2m,
      apparentTemperature: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      weatherCode: data.current.weather_code,
    },
    forecast: data.daily.time.map((date, index) => ({
      date,
      weatherCode: data.daily.weather_code[index],
      maxTemperature: data.daily.temperature_2m_max[index],
      minTemperature: data.daily.temperature_2m_min[index],
      precipitationProbability: data.daily.precipitation_probability_max[index],
    })),
  }
}

export async function getWeatherByCity(city) {
  // async/await를 사용하면 "도시 검색 후 날씨 검색"처럼 순서가 있는 비동기 작업을 읽기 쉽게 쓸 수 있습니다.
  const location = await searchLocation(city)
  return getWeatherByCoordinates(location.latitude, location.longitude, location)
}
