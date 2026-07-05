// 실제 API를 연결하기 전까지 화면을 테스트하기 위한 도시별 임시 날씨 데이터입니다.
const mockWeather = {
  서울: {
    city: '서울',
    country: '대한민국',
    current: {
      temperature: 24,
      condition: '구름 조금',
      feelsLike: 26,
      humidity: 58,
      windSpeed: 3.2,
    },
    forecast: [
      { id: 1, day: '월', condition: '맑음', high: 27, low: 18 },
      { id: 2, day: '화', condition: '흐림', high: 25, low: 17 },
      { id: 3, day: '수', condition: '비', high: 22, low: 16 },
      { id: 4, day: '목', condition: '쾌청', high: 26, low: 18 },
      { id: 5, day: '금', condition: '따뜻함', high: 29, low: 20 },
    ],
  },
  부산: {
    city: '부산',
    country: '대한민국',
    current: {
      temperature: 27,
      condition: '맑음',
      feelsLike: 29,
      humidity: 64,
      windSpeed: 4.1,
    },
    forecast: [
      { id: 1, day: '월', condition: '맑음', high: 29, low: 22 },
      { id: 2, day: '화', condition: '구름 많음', high: 28, low: 21 },
      { id: 3, day: '수', condition: '소나기', high: 26, low: 20 },
      { id: 4, day: '목', condition: '맑음', high: 30, low: 23 },
      { id: 5, day: '금', condition: '습함', high: 31, low: 24 },
    ],
  },
  제주: {
    city: '제주',
    country: '대한민국',
    current: {
      temperature: 25,
      condition: '바람 많음',
      feelsLike: 26,
      humidity: 70,
      windSpeed: 6.5,
    },
    forecast: [
      { id: 1, day: '월', condition: '바람', high: 26, low: 20 },
      { id: 2, day: '화', condition: '흐림', high: 25, low: 19 },
      { id: 3, day: '수', condition: '비', high: 23, low: 18 },
      { id: 4, day: '목', condition: '구름 조금', high: 26, low: 20 },
      { id: 5, day: '금', condition: '맑음', high: 28, low: 21 },
    ],
  },
}

export default mockWeather
