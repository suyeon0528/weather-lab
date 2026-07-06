import { useNavigate } from 'react-router'

function FavoritesPage({ favorites, onRemoveFavorite }) {
  // useNavigate는 코드 안에서 다른 경로로 이동할 때 사용하는 React Router 훅입니다.
  const navigate = useNavigate()

  function handleViewWeather(favorite) {
    // encodeURIComponent는 한글이나 공백이 URL에서 깨지지 않도록 안전하게 바꿔줍니다.
    navigate(`/?city=${encodeURIComponent(favorite.name)}`)
  }

  return (
    <main className="page">
      <section className="info-card">
        <p className="card-label">즐겨찾기</p>

        {favorites.length === 0 ? (
          <h2>아직 저장된 즐겨찾기 도시가 없습니다.</h2>
        ) : (
          <div className="favorites-list">
            {favorites.map((location) => (
              <article
                className="favorite-item"
                key={`${location.latitude}-${location.longitude}`}
              >
                <div>
                  <button
                    type="button"
                    className="favorite-city-button"
                    onClick={() => handleViewWeather(location)}
                  >
                    {location.name}
                  </button>
                  <span>{location.region}</span>
                </div>
                <div className="favorite-actions">
                  <button
                    type="button"
                    onClick={() => handleViewWeather(location)}
                  >
                    날씨 보기
                  </button>
                  <button type="button" onClick={() => onRemoveFavorite(location)}>
                    삭제
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default FavoritesPage
