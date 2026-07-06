import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Sun,
  Umbrella,
} from 'lucide-react'

function iconProps(className) {
  return { className, 'aria-hidden': 'true', strokeWidth: 2.2 }
}

function renderWeatherIcon(weatherCode, className) {
  if (weatherCode === 0) {
    return <Sun {...iconProps(className)} />
  }

  if ([1, 2].includes(weatherCode)) {
    return <CloudSun {...iconProps(className)} />
  }

  if (weatherCode === 3) {
    return <Cloud {...iconProps(className)} />
  }

  if ([45, 48].includes(weatherCode)) {
    return <CloudFog {...iconProps(className)} />
  }

  if ([51, 53, 55, 56, 57, 80, 81, 82].includes(weatherCode)) {
    return <Umbrella {...iconProps(className)} />
  }

  if ([61, 63, 65, 66, 67].includes(weatherCode)) {
    return <CloudRain {...iconProps(className)} />
  }

  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    return <CloudSnow {...iconProps(className)} />
  }

  if ([95, 96, 99].includes(weatherCode)) {
    return <CloudLightning {...iconProps(className)} />
  }

  return <CloudSun {...iconProps(className)} />
}

function WeatherIcon({ code, className = 'weather-svg-icon' }) {
  return renderWeatherIcon(code, className)
}

export default WeatherIcon
