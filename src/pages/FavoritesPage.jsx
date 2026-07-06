import { useNavigate } from 'react-router'
import StatusMessage from '../components/StatusMessage'

function FavoritesPage({ favorites, onRemoveFavorite }) {
  // useNavigate는 코드 안에서 다른 경로로 이동할 때 사용하는 React Router 훅입니다.
  const navigate = useNavigate()

  function handleViewWeather(favorite) {
    // encodeURIComponent는 한글이나 공백이 URL에서 깨지지 않도록 안전하게 바꿔줍니다.
    navigate(`/?city=${encodeURIComponent(favorite.name)}`)
  }

  return (
    <main className="page">
      {favorites.length === 0 ? (
        <StatusMessage
          type="empty"
          title="아직 저장된 즐겨찾기 도시가 없습니다."
        >
          오늘의 날씨 페이지에서 자주 확인하는 도시를 저장해보세요.
        </StatusMessage>
      ) : (
        <section className="info-card">
          <p className="card-label">즐겨찾기</p>
          <div className="favorites-list">
            {favorites.map((location) => (
              <article
                className="favorite-item"
                key={`${location.latitude}-${location.longitude}`}
              >
                <div>
                  <button
                    type="button"
                    className="btn btn-text favorite-city-button"
                    onClick={() => handleViewWeather(location)}
                  >
                    {location.name}
                  </button>
                  <span>{location.region}</span>
                </div>
                <div className="favorite-actions">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleViewWeather(location)}
                  >
                    날씨 보기
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => onRemoveFavorite(location)}
                  >
                    삭제
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

export default FavoritesPage
