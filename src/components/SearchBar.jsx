function SearchBar({ value, onChange, onSearch }) {
  function handleSubmit(event) {
    event.preventDefault()
    onSearch()
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <label className="search-field">
        <span className="sr-only">도시 이름</span>
        <input
          type="text"
          value={value}
          placeholder="도시 이름을 입력하세요"
          onChange={onChange}
        />
      </label>
      <button type="submit" className="btn btn-primary">
        검색
      </button>
    </form>
  )
}

export default SearchBar
