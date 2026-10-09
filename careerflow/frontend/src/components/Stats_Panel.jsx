import StatCard from './StatCard';

/**
 * Stats_Panel — displays aggregated application statistics.
 *
 * Props:
 *   stats   {Object}  – { total, applied, interview, selected, rejected }
 *   loading {boolean} – when true, renders a loading indicator
 *   error   {string|null} – when truthy, renders the error message instead of stats
 */
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
