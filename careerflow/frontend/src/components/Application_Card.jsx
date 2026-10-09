/**
 * Application_Card — displays a summary of a single job/internship application.
 *
 * Props:
 *   application {Object}   – the application record to display
 *     .company         {string} – company name
 *     .position        {string} – role / position title
 *     .status          {string} – one of 'Applied' | 'Interview' | 'Selected' | 'Rejected'
 *     .applicationDate {string} – ISO date string
 *     ._id             {string} – unique identifier
 *   onEdit   {Function} – called with the full application object when Edit is clicked
 *   onDelete {Function} – called with application._id when Delete is clicked
 */
function Application_Card({ application, onEdit, onDelete }) {
  const { company, position, status, applicationDate, _id } = application;

  // Format the date for display (e.g. "Jan 15, 2025")
  const formattedDate = applicationDate
    ? new Date(applicationDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '—';

  return (
    <div className={`application-card application-card--${status.toLowerCase()}`}>
      <div className="application-card__body">
        <h3 className="application-card__position">{position}</h3>
        <p className="application-card__company">{company}</p>
        <div className="application-card__meta">
          <span className="application-card__status">{status}</span>
          <span className="application-card__date">{formattedDate}</span>
        </div>
      </div>

      <div className="application-card__actions">
        <button
          className="application-card__btn application-card__btn--edit"
          onClick={() => onEdit(application)}
          aria-label={`Edit application for ${position} at ${company}`}
        >
          Edit
        </button>
        <button
          className="application-card__btn application-card__btn--delete"
          onClick={() => onDelete(_id)}
          aria-label={`Delete application for ${position} at ${company}`}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default Application_Card;
