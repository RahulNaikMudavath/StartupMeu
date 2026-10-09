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

  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const filteredApplications = filterApplications(applications, searchText, statusFilter);

  function showToast(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, 3500);
  }

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
      showToast('Application added successfully!', 'success');
      await refresh();
    } catch (err) {
      setError(err.message || 'Failed to create application.');
      showToast(err.message || 'Failed to create application.', 'error');
    }
  }

  async function handleUpdate(id, data) {
    try {
      await updateApplication(id, data);
      setEditTarget(null);
      showToast('Application updated successfully!', 'success');
      await refresh();
    } catch (err) {
      setError(err.message || 'Failed to update application.');
      showToast(err.message || 'Failed to update application.', 'error');
    }
  }

  function handleDelete(id) {
    const target = applications.find((a) => a._id === id);
    setDeleteConfirmTarget(target || { _id: id, company: 'this application', position: 'Record' });
  }

  async function confirmDeleteApplication() {
    if (!deleteConfirmTarget?._id) return;
    setIsDeleting(true);
    try {
      await deleteApplication(deleteConfirmTarget._id);
      if (editTarget && editTarget._id === deleteConfirmTarget._id) {
        setEditTarget(null);
      }
      showToast('Application deleted successfully.', 'success');
      setDeleteConfirmTarget(null);
      await refresh();
    } catch (err) {
      setError(err.message || 'Failed to delete application.');
      showToast(err.message || 'Failed to delete application.', 'error');
    } finally {
      setIsDeleting(false);
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
      {toast && (
        <div className={`app__toast app__toast--${toast.type}`} role="status">
          <span className="app__toast-icon" aria-hidden="true">
            {toast.type === 'success' ? '✓' : '!'}
          </span>
          <span className="app__toast-message">{toast.message}</span>
          <button
            type="button"
            className="app__toast-close"
            onClick={() => setToast(null)}
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      )}

      <header className="app__header">
        <div className="app__header-brand">
          <div className="app__header-icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
          </div>
          <span className="app__header-badge">✦ Live Career Tracker</span>
        </div>
        <h1 className="app__title">CareerFlow</h1>
        <p className="app__subtitle">Streamline, track, and manage your job &amp; internship applications</p>
      </header>

      {error && (
        <div className="app__error-banner" role="alert">
          <span className="app__error-banner-icon" aria-hidden="true">⚠️</span>
          <span>{error}</span>
          <button
            type="button"
            className="app__error-banner-close"
            onClick={() => setError(null)}
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      <main className="app__main">
        <section className="app__section app__section--stats" aria-label="Application statistics">
          <div className="app__section-heading">
            <h2 className="app__section-title">Application Funnel</h2>
            <span className="app__section-desc">Real-time metrics across all hiring stages</span>
          </div>
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
            onCancelEdit={() => setEditTarget(null)}
          />
        </section>

        <section className="app__section app__section--controls" aria-label="Search and filter">
          <div className="app__controls-bar">
            <SearchBar
              value={searchText}
              onSearch={setSearchText}
            />
            <StatusFilter
              value={statusFilter}
              onFilterChange={setStatusFilter}
            />
          </div>

          <div className="app__controls-summary">
            <span className="app__results-count">
              Showing <strong>{filteredApplications.length}</strong> of <strong>{applications.length}</strong> {applications.length === 1 ? 'application' : 'applications'}
            </span>
            {(searchText || statusFilter !== 'All') && (
              <button
                type="button"
                className="app__reset-filters"
                onClick={() => {
                  setSearchText('');
                  setStatusFilter('All');
                }}
              >
                Reset Filters
              </button>
            )}
          </div>
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

      {deleteConfirmTarget && (
        <div
          className="modal-backdrop"
          onClick={() => !isDeleting && setDeleteConfirmTarget(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon modal-icon--danger" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </div>
            <div className="modal-content">
              <h3 className="modal-title">Delete Application</h3>
              <p className="modal-desc">
                Are you sure you want to delete the application for{' '}
                <strong>{deleteConfirmTarget.position}</strong> at{' '}
                <strong>{deleteConfirmTarget.company}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => setDeleteConfirmTarget(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn--danger"
                onClick={confirmDeleteApplication}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting…' : 'Delete Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
