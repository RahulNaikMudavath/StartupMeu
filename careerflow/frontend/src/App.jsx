import { useState, useEffect } from 'react';
import {
  fetchAll,
  fetchStats,
  createApplication,
  updateApplication,
  deleteApplication,
} from './services/applicationService';
import { filterApplications } from './utils/filterApplications';
import Stats_Panel from './components/Stats_Panel';
import SearchBar from './components/SearchBar';
import StatusFilter from './components/StatusFilter';
import Application_Form from './components/Application_Form';
import Application_List from './components/Application_List';
import './App.css';

/**
 * App — root component and single source of truth for CareerFlow.
 *
 * State:
 *   applications  {Array}       – full list of application records from the API
 *   stats         {Object|null} – aggregate stats ({ total, applied, interview, selected, rejected })
 *   loading       {boolean}     – true while fetchAll is in-flight (Requirement 2.3, 10.4)
 *   statsLoading  {boolean}     – true while fetchStats is in-flight (Requirement 8.4)
 *   error         {string|null} – error message from fetchAll (Requirement 10.5)
 *   statsError    {string|null} – error message from fetchStats (Requirement 8.5)
 *   searchText    {string}      – current search input value (Requirement 6.1)
 *   statusFilter  {string}      – current status filter value, default 'All' (Requirement 7.1)
 *   selectedId    {string|null} – id of the currently selected application (future use)
 *   editTarget    {Object|null} – application being edited; null means create mode (Requirement 4.3)
 */
function App() {
  // ── Data state ──────────────────────────────────────────────────────────────
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);

  // ── Loading / error state ────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statsError, setStatsError] = useState(null);

  // ── UI / filter state ────────────────────────────────────────────────────────
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [_selectedId, _setSelectedId] = useState(null);
  const [editTarget, setEditTarget] = useState(null);

  // ── Derived data ─────────────────────────────────────────────────────────────
  // Computed on every render; no extra state needed (Requirements 6.1, 7.1, 7.4)
  const filteredApplications = filterApplications(applications, searchText, statusFilter);

  // ── Data-fetching helpers ─────────────────────────────────────────────────────

  /**
   * Reload the full application list.
   * Sets `loading` true before the call and false when it settles.
   */
  async function loadApplications() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAll();
      setApplications(data);
    } catch (err) {
      setError(err.message || 'Failed to load applications.');
    } finally {
      setLoading(false);
    }
  }

  /**
   * Reload aggregate statistics.
   * Sets `statsLoading` true before the call and false when it settles.
   */
  async function loadStats() {
    setStatsLoading(true);
    setStatsError(null);
    try {
      const data = await fetchStats();
      setStats(data);
    } catch (err) {
      setStatsError(err.message || 'Failed to load statistics.');
    } finally {
      setStatsLoading(false);
    }
  }

  /**
   * Reload both lists in parallel.
   * Satisfies Requirement 8.6: stats refresh after any mutation.
   */
  async function refresh() {
    await Promise.all([loadApplications(), loadStats()]);
  }

  // ── Initial data load on mount (Requirements 2.1, 8.1) ──────────────────────
  useEffect(() => {
    loadApplications();
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── CRUD handlers ─────────────────────────────────────────────────────────────

  /**
   * handleCreate — create a new application then refresh all data.
   * Called by Application_Form's onSubmit when editTarget is null.
   * Satisfies Requirement 1.7.
   *
   * @param {Object} data – form draft
   */
  async function handleCreate(data) {
    try {
      await createApplication(data);
      await refresh();
    } catch (err) {
      setError(err.message || 'Failed to create application.');
    }
  }

  /**
   * handleUpdate — update an existing application then refresh all data.
   * Called by Application_Form's onSubmit when editTarget is set.
   * Satisfies Requirements 4.5 and 8.6.
   *
   * @param {string} id   – MongoDB ObjectId of the application to update
   * @param {Object} data – updated form draft
   */
  async function handleUpdate(id, data) {
    try {
      await updateApplication(id, data);
      setEditTarget(null);
      await refresh();
    } catch (err) {
      setError(err.message || 'Failed to update application.');
    }
  }

  /**
   * handleDelete — ask for confirmation then delete, refresh all data.
   * Satisfies Requirements 5.4 and 5.5.
   *
   * @param {string} id – MongoDB ObjectId of the application to delete
   */
  async function handleDelete(id) {
    const confirmed = window.confirm('Are you sure you want to delete this application?');
    if (!confirmed) return;

    try {
      await deleteApplication(id);
      // If the deleted app was being edited, clear that state
      if (editTarget && editTarget._id === id) {
        setEditTarget(null);
      }
      await refresh();
    } catch (err) {
      setError(err.message || 'Failed to delete application.');
    }
  }

  /**
   * handleFormSubmit — unified submit handler for Application_Form.
   * Routes to handleCreate or handleUpdate based on whether editTarget is set.
   *
   * @param {Object} data – form draft
   */
  function handleFormSubmit(data) {
    if (editTarget) {
      handleUpdate(editTarget._id, data);
    } else {
      handleCreate(data);
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="app__header">
        <h1 className="app__title">CareerFlow</h1>
        <p className="app__subtitle">Track your job &amp; internship applications</p>
      </header>

      {error && (
        <div className="app__error-banner" role="alert">
          {error}
        </div>
      )}

      <main className="app__main">
        {/* ── Dashboard statistics (Requirements 8.3, 8.4, 8.5) ── */}
        <section className="app__section app__section--stats" aria-label="Application statistics">
          <Stats_Panel
            stats={stats}
            loading={statsLoading}
            error={statsError}
          />
        </section>

        {/* ── Add / Edit form (Requirements 1.2–1.7, 4.3, 4.5) ── */}
        <section className="app__section app__section--form" aria-label={editTarget ? 'Edit application' : 'Add application'}>
          <Application_Form
            onSubmit={handleFormSubmit}
            editTarget={editTarget}
          />
          {editTarget && (
            <button
              className="app__cancel-edit"
              onClick={() => setEditTarget(null)}
              type="button"
            >
              Cancel Edit
            </button>
          )}
        </section>

        {/* ── Search and filter controls (Requirements 6.1, 7.1) ── */}
        <section className="app__section app__section--controls" aria-label="Search and filter">
          <SearchBar
            value={searchText}
            onSearch={setSearchText}
          />
          <StatusFilter
            value={statusFilter}
            onFilterChange={setStatusFilter}
          />
        </section>

        {/* ── Application list (Requirements 2.1–2.6, 10.6) ── */}
        <section className="app__section app__section--list" aria-label="Applications">
          <Application_List
            applications={filteredApplications}
            loading={loading}
            error={error}
            onEdit={setEditTarget}
            onDelete={handleDelete}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
