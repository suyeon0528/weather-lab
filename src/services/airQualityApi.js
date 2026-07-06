import { searchLocation } from './weatherApi.js'

const AIR_QUALITY_API_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality'

function getValue(values, index) {
  return Array.isArray(values) ? values[index] ?? null : null
}

function mapHourlyAirQuality(hourly) {
  return (hourly?.time || []).map((time, index) => ({
    time,
    pm10: getValue(hourly.pm10, index),
    pm25: getValue(hourly.pm2_5, index),
    usAqi: getValue(hourly.us_aqi, index),
    ozone: getValue(hourly.ozone, index),
    nitrogenDioxide: getValue(hourly.nitrogen_dioxide, index),
    uvIndex: getValue(hourly.uv_index, index),
  }))
}

export async function getAirQualityByCoordinates(latitude, longitude, location) {
  const currentParams = [
    'pm10',
    'pm2_5',
    'us_aqi',
    'ozone',
    'nitrogen_dioxide',
    'sulphur_dioxide',
    'carbon_monoxide',
    'uv_index',
  ].join(',')
  const hourlyParams = [
    'pm10',
    'pm2_5',
    'us_aqi',
    'ozone',
    'nitrogen_dioxide',
    'uv_index',
  ].join(',')
  const url =
    `${AIR_QUALITY_API_URL}?latitude=${latitude}&longitude=${longitude}` +
    `&current=${currentParams}&hourly=${hourlyParams}` +
    '&timezone=auto&forecast_days=5'

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('대기질 정보를 불러오지 못했습니다.')
  }

  const data = await response.json()

  return {
    location: {
      name: location?.name || '현재 위치',
      region: location?.region || '',
      latitude,
      longitude,
      timezone: data.timezone || '',
    },
    current: {
      time: data.current?.time || null,
      pm10: data.current?.pm10 ?? null,
      pm25: data.current?.pm2_5 ?? null,
      usAqi: data.current?.us_aqi ?? null,
      ozone: data.current?.ozone ?? null,
      nitrogenDioxide: data.current?.nitrogen_dioxide ?? null,
      sulphurDioxide: data.current?.sulphur_dioxide ?? null,
      carbonMonoxide: data.current?.carbon_monoxide ?? null,
      uvIndex: data.current?.uv_index ?? null,
    },
    hourly: mapHourlyAirQuality(data.hourly),
  }
}

export async function getAirQualityByCity(city) {
  const location = await searchLocation(city)

  return getAirQualityByCoordinates(
    location.latitude,
    location.longitude,
    location,
  )
}
