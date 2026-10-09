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

function App() {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statsError, setStatsError] = useState(null);

  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [_selectedId, _setSelectedId] = useState(null);
  const [editTarget, setEditTarget] = useState(null);

  const filteredApplications = filterApplications(applications, searchText, statusFilter);

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

  async function refresh() {
    await Promise.all([loadApplications(), loadStats()]);
  }

  useEffect(() => {
    loadApplications();
    loadStats();
  }, []);

  async function handleCreate(data) {
    try {
      await createApplication(data);
      await refresh();
    } catch (err) {
      setError(err.message || 'Failed to create application.');
    }
  }

  async function handleUpdate(id, data) {
    try {
      await updateApplication(id, data);
      setEditTarget(null);
      await refresh();
    } catch (err) {
      setError(err.message || 'Failed to update application.');
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm('Are you sure you want to delete this application?');
    if (!confirmed) return;

    try {
      await deleteApplication(id);
      if (editTarget && editTarget._id === id) {
        setEditTarget(null);
      }
      await refresh();
    } catch (err) {
      setError(err.message || 'Failed to delete application.');
    }
  }

  function handleFormSubmit(data) {
    if (editTarget) {
      handleUpdate(editTarget._id, data);
    } else {
      handleCreate(data);
    }
  }

  return (
    <div className="app">
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
        <section className="app__section app__section--stats" aria-label="Application statistics">
          <Stats_Panel
            stats={stats}
            loading={statsLoading}
            error={statsError}
          />
        </section>

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
