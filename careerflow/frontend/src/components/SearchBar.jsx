/**
 * SearchBar — controlled input component for filtering applications.
 *
 * Props:
 *   value    {string}   – current search string (controlled)
 *   onSearch {Function} – called with the new value on every keystroke
 */
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
