/**
 * StatusFilter — controlled select component for filtering applications by status.
 *
 * Props:
 *   value          {string}   – currently selected filter value (controlled)
 *   onFilterChange {Function} – called with the new selected value on change
 */
function StatusFilter({ value, onFilterChange }) {
  return (
    <div className="status-filter">
      <select
        className="status-filter__select"
        value={value}
        onChange={(e) => onFilterChange(e.target.value)}
        aria-label="Filter applications by status"
      >
        <option value="All">All</option>
        <option value="Applied">Applied</option>
        <option value="Interview">Interview</option>
        <option value="Selected">Selected</option>
        <option value="Rejected">Rejected</option>
      </select>
    </div>
  );
}

export default StatusFilter;
