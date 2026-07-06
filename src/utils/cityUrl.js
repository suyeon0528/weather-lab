export function createCityUrl(path, city) {
  if (!city) {
    return path
  }

  return `${path}?city=${encodeURIComponent(city)}`
}
