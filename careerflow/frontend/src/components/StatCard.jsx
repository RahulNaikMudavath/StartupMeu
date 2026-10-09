/**
 * StatCard — purely presentational component.
 * Displays a single statistic with a label and a count.
 *
 * Props:
 *   label {string} – descriptive name for the statistic (e.g. "Total")
 *   count {number} – numeric value to display
 */
function StatCard({ label, count }) {
  return (
    <div className="stat-card">
      <span className="stat-card__label">{label}</span>
      <span className="stat-card__count">{count}</span>
    </div>
  );
}

export default StatCard;
