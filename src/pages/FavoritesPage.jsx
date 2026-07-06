function FavoritesPage({ favorites, onRemoveFavorite }) {
  return (
    <main className="page">
      <section className="info-card">
        <p className="card-label">즐겨찾기</p>

        {favorites.length === 0 ? (
          <h2>아직 저장된 즐겨찾기 도시가 없습니다.</h2>
        ) : (
          <div className="favorites-list">
            {/* map은 즐겨찾기 배열의 각 도시를 화면에 보이는 목록 항목으로 바꿉니다. */}
            {favorites.map((location) => (
              <article
                className="favorite-item"
                key={`${location.latitude}-${location.longitude}`}
              >
                <div>
                  <strong>{location.name}</strong>
                  <span>{location.region}</span>
                </div>
                <button type="button" onClick={() => onRemoveFavorite(location)}>
                  삭제
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default FavoritesPage
