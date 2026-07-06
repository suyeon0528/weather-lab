import { koreanCityAliases } from '../data/koreanCityAliases.js'

const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_API_URL = 'https://api.open-meteo.com/v1/forecast'

function normalizeText(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
}

function formatLocationName(name) {
  return String(name || '').trim()
}

function getValue(values, index) {
  return Array.isArray(values) ? values[index] ?? null : null
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

  const adminMatchedLocation = koreaResults.find((location) =>
    isSameAdmin1(location, alias),
  )

  if (adminMatchedLocation) {
    return adminMatchedLocation
  }

  return [...koreaResults].sort(
    (a, b) => (b.population || 0) - (a.population || 0),
  )[0]
}

function mapHourlyWeather(hourly) {
  // Open-Meteo는 time, temperature_2m처럼 항목별 배열을 따로 줍니다.
  // 같은 index의 값들이 같은 시간대 데이터이므로 하나의 객체 배열로 합칩니다.
  return (hourly?.time || []).map((time, index) => ({
    time,
    temperature: getValue(hourly.temperature_2m, index),
    apparentTemperature: getValue(hourly.apparent_temperature, index),
    humidity: getValue(hourly.relative_humidity_2m, index),
    precipitationProbability: getValue(hourly.precipitation_probability, index),
    precipitation: getValue(hourly.precipitation, index),
    weatherCode: getValue(hourly.weather_code, index),
    cloudCover: getValue(hourly.cloud_cover, index),
    visibility: getValue(hourly.visibility, index),
    windSpeed: getValue(hourly.wind_speed_10m, index),
    windDirection: getValue(hourly.wind_direction_10m, index),
    windGusts: getValue(hourly.wind_gusts_10m, index),
  }))
}

function mapDailyWeather(daily) {
  // daily도 날짜 배열의 index를 기준으로 최고/최저기온, 일출, 일몰 등을 합칩니다.
  return (daily?.time || []).map((date, index) => ({
    date,
    weatherCode: getValue(daily.weather_code, index),
    maxTemperature: getValue(daily.temperature_2m_max, index),
    minTemperature: getValue(daily.temperature_2m_min, index),
    maxApparentTemperature: getValue(daily.apparent_temperature_max, index),
    minApparentTemperature: getValue(daily.apparent_temperature_min, index),
    precipitationProbability: getValue(daily.precipitation_probability_max, index),
    precipitationSum: getValue(daily.precipitation_sum, index),
    sunrise: getValue(daily.sunrise, index),
    sunset: getValue(daily.sunset, index),
    daylightDuration: getValue(daily.daylight_duration, index),
    sunshineDuration: getValue(daily.sunshine_duration, index),
    uvIndexMax: getValue(daily.uv_index_max, index),
    maxWindSpeed: getValue(daily.wind_speed_10m_max, index),
    maxWindGusts: getValue(daily.wind_gusts_10m_max, index),
    dominantWindDirection: getValue(daily.wind_direction_10m_dominant, index),
  }))
}

export async function searchLocation(city) {
  const trimmedCity = String(city || '').trim()

  if (trimmedCity === '') {
    throw new Error('도시 이름을 입력해주세요.')
  }

  // 한글 도시명이 별칭 목록에 있으면 Open-Meteo가 더 잘 찾는 검색어로 바꿉니다.
  // 예: "서울" -> "Seoul", "당진" -> "당진시"
  const alias = koreanCityAliases[trimmedCity]
  const apiSearchCity = alias?.query || trimmedCity
  const encodedCity = encodeURIComponent(apiSearchCity)
  const url = `${GEOCODING_API_URL}?name=${encodedCity}&count=10&language=ko&countryCode=KR&format=json`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('도시 검색 요청에 실패했습니다.')
  }

  const data = await response.json()
  const location = selectBestLocation(data.results || [], alias)

  if (!location) {
    throw new Error('도시를 찾을 수 없습니다.')
  }

  return {
    name: formatLocationName(location.name),
    region: location.admin1 || location.country || '대한민국',
    latitude: location.latitude,
    longitude: location.longitude,
  }
}

export async function getWeatherByCoordinates(
  latitude,
  longitude,
  location = {
    name: '현재 위치',
    region: `위도 ${Number(latitude).toFixed(2)}, 경도 ${Number(longitude).toFixed(2)}`,
    latitude,
    longitude,
  },
) {
  const currentParams = [
    'temperature_2m',
    'apparent_temperature',
    'relative_humidity_2m',
    'weather_code',
    'precipitation',
    'cloud_cover',
    'wind_speed_10m',
    'wind_direction_10m',
    'wind_gusts_10m',
    'surface_pressure',
    'is_day',
  ].join(',')
  const hourlyParams = [
    'temperature_2m',
    'apparent_temperature',
    'relative_humidity_2m',
    'precipitation_probability',
    'precipitation',
    'weather_code',
    'cloud_cover',
    'visibility',
    'wind_speed_10m',
    'wind_direction_10m',
    'wind_gusts_10m',
  ].join(',')
  const dailyParams = [
    'weather_code',
    'temperature_2m_max',
    'temperature_2m_min',
    'apparent_temperature_max',
    'apparent_temperature_min',
    'precipitation_probability_max',
    'precipitation_sum',
    'sunrise',
    'sunset',
    'daylight_duration',
    'sunshine_duration',
    'uv_index_max',
    'wind_speed_10m_max',
    'wind_gusts_10m_max',
    'wind_direction_10m_dominant',
  ].join(',')
  const url =
    `${FORECAST_API_URL}?latitude=${latitude}&longitude=${longitude}` +
    `&current=${currentParams}&hourly=${hourlyParams}&daily=${dailyParams}` +
    '&timezone=auto&forecast_days=7&wind_speed_unit=ms'

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('날씨 정보를 불러오지 못했습니다.')
  }

  const data = await response.json()
  const hourly = mapHourlyWeather(data.hourly)
  const daily = mapDailyWeather(data.daily)

  return {
    location: {
      name: location.name,
      region: location.region || '',
      latitude,
      longitude,
      timezone: data.timezone || '',
    },
    current: {
      time: data.current?.time || null,
      temperature: data.current?.temperature_2m ?? null,
      apparentTemperature: data.current?.apparent_temperature ?? null,
      humidity: data.current?.relative_humidity_2m ?? null,
      weatherCode: data.current?.weather_code ?? null,
      precipitation: data.current?.precipitation ?? null,
      cloudCover: data.current?.cloud_cover ?? null,
      windSpeed: data.current?.wind_speed_10m ?? null,
      windDirection: data.current?.wind_direction_10m ?? null,
      windGusts: data.current?.wind_gusts_10m ?? null,
      surfacePressure: data.current?.surface_pressure ?? null,
      isDay: data.current?.is_day === 1,
    },
    hourly,
    daily,
    forecast: daily,
  }
}

export async function getWeatherByCity(city) {
  const location = await searchLocation(city)
  return getWeatherByCoordinates(location.latitude, location.longitude, location)
}

export async function getHourlyWeatherByCity(city) {
  const weather = await getWeatherByCity(city)

  return {
    location: weather.location,
    hourly: weather.hourly,
    daily: weather.daily,
  }
}
