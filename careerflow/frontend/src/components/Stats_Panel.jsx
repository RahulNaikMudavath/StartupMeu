import StatCard from './StatCard';

function Stats_Panel({ stats, loading, error }) {
  if (loading) {
    return <p className="stats-panel__loading">Loading statistics…</p>;
  }

  if (error) {
    return <p className="stats-panel__error">{error}</p>;
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
