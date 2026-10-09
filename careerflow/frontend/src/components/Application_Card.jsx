function Application_Card({ application, onEdit, onDelete }) {
  const { company, position, status, applicationDate, jobUrl, notes, _id } = application;

  const formattedDate = applicationDate
    ? new Date(applicationDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '—';

  const initial = company ? company.trim().charAt(0).toUpperCase() : '?';

  return (
    <div className={`application-card application-card--${status.toLowerCase()}`}>
      <div className="application-card__left">
        <div className="application-card__avatar" aria-hidden="true">
          {initial}
        </div>
        <div className="application-card__body">
          <div className="application-card__title-row">
            <h3 className="application-card__position">{position}</h3>
            <span className={`application-card__status application-card__status--${status.toLowerCase()}`}>
              <span className="application-card__status-dot" aria-hidden="true"></span>
              {status}
            </span>
          </div>

          <p className="application-card__company">{company}</p>

          <div className="application-card__meta">
            <span className="application-card__meta-item application-card__date">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              {formattedDate}
            </span>

            {jobUrl && (
              <a
                href={jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="application-card__meta-item application-card__link"
                title="Open job posting"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                Posting
              </a>
            )}

            {notes && (
              <span className="application-card__meta-item application-card__notes-tag" title={notes}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                </svg>
                Note
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="application-card__actions">
        <button
          className="application-card__btn application-card__btn--edit"
          onClick={() => onEdit(application)}
          aria-label={`Edit application for ${position} at ${company}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          Edit
        </button>
        <button
          className="application-card__btn application-card__btn--delete"
          onClick={() => onDelete(_id)}
          aria-label={`Delete application for ${position} at ${company}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
          Delete
        </button>
      </div>
    </div>
  );
}

export default Application_Card;
