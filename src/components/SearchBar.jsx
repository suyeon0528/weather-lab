// props는 부모 컴포넌트가 자식 컴포넌트에 전달하는 값입니다.
// value, onChange, onSearch는 모두 부모인 HomePage에서 내려옵니다.
function SearchBar({ value, onChange, onSearch }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        value={value}
        placeholder="도시 이름을 입력하세요"
        aria-label="도시 이름"
        // onChange는 input 값이 바뀔 때마다 실행됩니다.
        // 실제 city 상태는 SearchBar가 아니라 부모인 HomePage에 있습니다.
        onChange={onChange}
      />
      {/* onClick은 버튼을 클릭했을 때 부모에서 내려온 onSearch 함수를 실행합니다. */}
      <button type="button" onClick={onSearch}>
        검색
      </button>
    </div>
  )
}

export default SearchBar
