function Header() {
  return (
    <header className="header">
      {/* 화면의 가장 위에서 앱 이름과 간단한 설명을 보여줍니다. */}
      <p className="header-label">오늘의 날씨</p>
      <h1>우리 동네 날씨를 확인해보세요</h1>
      <p className="header-description">
        아직 실제 날씨 API는 연결하지 않았고, 임시 데이터로 화면을 보여줍니다.
      </p>
    </header>
  )
}

export default Header
