function SearchBar({ value, onSearch }) {
  return (
    <div className="search-bar">
      <div className="search-bar__icon" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
      <input
        className="search-bar__input"
        type="text"
        placeholder="Search applications by company or role…"
        value={value}
        onChange={(e) => onSearch(e.target.value)}
        aria-label="Search applications"
      />
      {value && (
        <button
          type="button"
          className="search-bar__clear"
          onClick={() => onSearch('')}
          aria-label="Clear search text"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
    </div>
  );
}

export default SearchBar;
