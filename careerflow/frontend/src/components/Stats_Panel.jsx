import StatCard from './StatCard';

function Stats_Panel({ stats, loading, error }) {
  if (loading) {
    return (
      <div className="stats-panel stats-panel--loading">
        <div className="stats-panel__spinner" aria-hidden="true"></div>
        <p className="stats-panel__loading">Loading statistics…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stats-panel stats-panel--error">
        <p className="stats-panel__error">{error}</p>
      </div>
    );
  }

  return (
    <div className="stats-panel">
      <StatCard label="Total"     count={stats?.total     ?? 0} />
      <StatCard label="Applied"   count={stats?.applied   ?? 0} />
      <StatCard label="Interview" count={stats?.interview ?? 0} />
      <StatCard label="Selected"  count={stats?.selected  ?? 0} />
      <StatCard label="Rejected"  count={stats?.rejected  ?? 0} />
    </div>
  );
}

export default Stats_Panel;
