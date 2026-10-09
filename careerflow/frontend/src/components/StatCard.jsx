function StatCard({ label, count }) {
  return (
    <div className="stat-card">
      <span className="stat-card__label">{label}</span>
      <span className="stat-card__count">{count}</span>
    </div>
  );
}

export default StatCard;
