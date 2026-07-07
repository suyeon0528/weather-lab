function Footer() {
  return (
    <footer className="footer">
      <div>
        <strong>Weather Lab</strong>
        <p>현재 날씨, 예보, 대기질을 한눈에 보는 생활형 날씨 서비스입니다.</p>
      </div>
      <div>
        <p>
          Weather and air-quality data by{' '}
          <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">
            Open-Meteo
          </a>
        </p>
        <p>
        프로젝트 소스는{' '}
        <a
            href="https://github.com/suyeon0528/weather-lab"
            target="_blank"
            rel="noreferrer"
            className="footer-github-link"
      >
    GitHub에서 확인할 수 있습니다.
  </a>
</p>
      </div>
    </footer>
  )
}

export default Footer
