function SearchBar({ value, onSearch }) {
  return (
    <div className="search-bar">
      <input
        className="search-bar__input"
        type="text"
        placeholder="Search applications…"
        value={value}
        onChange={(e) => onSearch(e.target.value)}
        aria-label="Search applications"
      />
    </div>
  );
}

export default SearchBar;
