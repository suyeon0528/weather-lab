export const dateTimeFormatter = new Intl.DateTimeFormat('ko-KR', {
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

export const shortTimeFormatter = new Intl.DateTimeFormat('ko-KR', {
  hour: 'numeric',
  minute: '2-digit',
})

export const chartTimeFormatter = new Intl.DateTimeFormat('ko-KR', {
  hour: 'numeric',
})

const dayFormatter = new Intl.DateTimeFormat('ko-KR', {
  weekday: 'short',
})

const monthDayFormatter = new Intl.DateTimeFormat('ko-KR', {
  month: 'numeric',
  day: 'numeric',
})

export function formatDateTime(value) {
  if (!value) {
    return '정보 없음'
  }

  return dateTimeFormatter.format(new Date(value))
}

export function formatTime(value) {
  if (!value) {
    return '정보 없음'
  }

  return shortTimeFormatter.format(new Date(value))
}

export function formatChartTime(value) {
  if (!value) {
    return ''
  }

  return chartTimeFormatter.format(new Date(value))
}

export function formatDayLabel(dateValue, index) {
  if (index === 0) {
    return '오늘'
  }

  if (index === 1) {
    return '내일'
  }

  return dayFormatter.format(new Date(`${dateValue}T00:00`))
}

export function formatMonthDay(dateValue) {
  if (!dateValue) {
    return '정보 없음'
  }

  return monthDayFormatter.format(new Date(`${dateValue}T00:00`))
}

export function formatDuration(seconds) {
  const value = Number(seconds)

  if (!Number.isFinite(value)) {
    return '정보 없음'
  }

  const hours = Math.floor(value / 3600)
  const minutes = Math.round((value % 3600) / 60)

  return `${hours}시간 ${minutes}분`
}
