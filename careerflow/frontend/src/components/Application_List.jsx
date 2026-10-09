import Application_Card from './Application_Card';

/**
 * Application_List — renders a list of job/internship application cards.
 *
 * Props:
 *   applications {Array}    – array of application records to display
 *   onEdit       {Function} – passed through to each Application_Card
 *   onDelete     {Function} – passed through to each Application_Card
 */
function Application_List({ applications, loading, error, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="application-list application-list--loading">
        <p className="application-list__loading">Loading applications…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="application-list application-list--error">
        <p className="application-list__error" role="alert">{error}</p>
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="application-list application-list--empty">
        <p className="application-list__empty-state">No applications found</p>
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
