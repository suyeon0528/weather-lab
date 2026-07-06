export function getAqiInfo(usAqi) {
  const value = Number(usAqi)

  // AQI 숫자를 한국어 상태로 바꾸면 화면에서 조건문을 반복하지 않아도 됩니다.
  if (!Number.isFinite(value)) {
    return {
      label: '정보 없음',
      level: 'unknown',
      description: '현재 대기질 정보를 확인할 수 없습니다.',
    }
  }

  if (value <= 50) {
    return {
      label: '좋음',
      level: 'good',
      description: '환기와 야외 활동을 하기 좋은 대기 상태입니다.',
    }
  }

  if (value <= 100) {
    return {
      label: '보통',
      level: 'moderate',
      description: '대부분의 사람이 활동하기에 무난한 대기 상태입니다.',
    }
  }

  if (value <= 150) {
    return {
      label: '민감군 주의',
      level: 'sensitive',
      description: '어린이, 노약자와 호흡기 질환자는 장시간 외출을 줄여주세요.',
    }
  }

  if (value <= 200) {
    return {
      label: '나쁨',
      level: 'bad',
      description: '불필요한 야외 활동을 줄이고 실내 공기 관리에 신경 써주세요.',
    }
  }

  if (value <= 300) {
    return {
      label: '매우 나쁨',
      level: 'veryBad',
      description: '외출 시간을 줄이고 민감한 사람은 실내 활동을 권장합니다.',
    }
  }

  return {
    label: '위험',
    level: 'hazardous',
    description: '야외 활동을 피하고 실내 공기 관리에 더욱 주의해주세요.',
  }
}
