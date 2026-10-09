import Application_Card from './Application_Card';

function Application_List({ applications, loading, error, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="application-list application-list--loading">
        <div className="application-list__loader-spinner" aria-hidden="true"></div>
        <p className="application-list__loading">Loading applications…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="application-list application-list--error">
        <div className="application-list__error-icon" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <p className="application-list__error" role="alert">{error}</p>
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="application-list application-list--empty">
        <div className="application-list__empty-graphic" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="9" y1="15" x2="15" y2="15"></line>
          </svg>
        </div>
        <h4 className="application-list__empty-title">No applications found</h4>
        <p className="application-list__empty-subtitle">
          Add an application using the form above or adjust your search and filters.
        </p>
      </div>
    );
  }

  return (
    <div className="application-list">
      {applications.map((application) => (
        <Application_Card
          key={application._id}
          application={application}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default Application_List;
