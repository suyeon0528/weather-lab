function FavoriteButton({ location, isFavorite, onAdd, onRemove }) {
  if (!location) {
    return null
  }

  function handleClick() {
    if (isFavorite) {
      onRemove(location)
      return
    }

    onAdd(location)
  }

  return (
    <button type="button" className="favorite-button" onClick={handleClick}>
      {isFavorite ? '★ 즐겨찾기 삭제' : '☆ 즐겨찾기 추가'}
    </button>
  )
}

export default FavoriteButton
