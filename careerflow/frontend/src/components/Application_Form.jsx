import { useState, useEffect } from 'react';
import { isNonBlank, isValidUrl } from '../utils/validation';

const STATUS_OPTIONS = ['Applied', 'Interview', 'Selected', 'Rejected'];

const EMPTY_DRAFT = {
  company: '',
  position: '',
  status: 'Applied',
  applicationDate: '',
  jobUrl: '',
  notes: '',
};

function Application_Form({ onSubmit, editTarget, onCancelEdit }) {
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editTarget) {
      const rawDate = editTarget.applicationDate
        ? new Date(editTarget.applicationDate).toISOString().split('T')[0]
        : '';

      setDraft({
        company: editTarget.company ?? '',
        position: editTarget.position ?? '',
        status: editTarget.status ?? 'Applied',
        applicationDate: rawDate,
        jobUrl: editTarget.jobUrl ?? '',
        notes: editTarget.notes ?? '',
      });
    } else {
      setDraft(EMPTY_DRAFT);
    }
    setErrors({});
  }, [editTarget]);

  function handleChange(e) {
    const { name, value } = e.target;
    setDraft((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }

  function validate() {
    const newErrors = {};

    if (!isNonBlank(draft.company)) {
      newErrors.company = 'Company name is required.';
    }

    if (!isNonBlank(draft.position)) {
      newErrors.position = 'Position is required.';
    }

    if (draft.jobUrl && !isValidUrl(draft.jobUrl)) {
      newErrors.jobUrl = 'Please enter a valid URL (e.g. https://example.com).';
    }

    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit({ ...draft });
  }

  const isEditing = Boolean(editTarget);

  return (
    <form
      className={`application-form ${isEditing ? 'application-form--editing' : ''}`}
      onSubmit={handleSubmit}
      noValidate
      aria-label={isEditing ? 'Edit application' : 'Add application'}
    >
      <div className="application-form__header">
        <div className="application-form__header-badge">
          {isEditing ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          )}
        </div>
        <div>
          <h2 className="application-form__title">
            {isEditing ? 'Edit Application' : 'Add Application'}
          </h2>
          <p className="application-form__subtitle">
            {isEditing ? 'Update the details for this application record' : 'Keep track of a new job or internship opportunity'}
          </p>
        </div>
      </div>

      <div className="application-form__grid">
        <div className="application-form__field">
          <label className="application-form__label" htmlFor="company">
            Company <span className="application-form__req" aria-hidden="true">*</span>
          </label>
          <input
            id="company"
            className={`application-form__input${errors.company ? ' application-form__input--error' : ''}`}
            type="text"
            name="company"
            value={draft.company}
            onChange={handleChange}
            placeholder="e.g. Google, Stripe, Microsoft"
            aria-required="true"
            aria-describedby={errors.company ? 'company-error' : undefined}
          />
          {errors.company && (
            <p id="company-error" className="application-form__error" role="alert">
              {errors.company}
            </p>
          )}
        </div>

        <div className="application-form__field">
          <label className="application-form__label" htmlFor="position">
            Position <span className="application-form__req" aria-hidden="true">*</span>
          </label>
          <input
            id="position"
            className={`application-form__input${errors.position ? ' application-form__input--error' : ''}`}
            type="text"
            name="position"
            value={draft.position}
            onChange={handleChange}
            placeholder="e.g. Software Engineer, Full Stack Dev"
            aria-required="true"
            aria-describedby={errors.position ? 'position-error' : undefined}
          />
          {errors.position && (
            <p id="position-error" className="application-form__error" role="alert">
              {errors.position}
            </p>
          )}
        </div>

        <div className="application-form__field">
          <label className="application-form__label" htmlFor="status">
            Status <span className="application-form__req" aria-hidden="true">*</span>
          </label>
          <div className="application-form__select-wrapper">
            <select
              id="status"
              className="application-form__select"
              name="status"
              value={draft.status}
              onChange={handleChange}
              aria-required="true"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="application-form__field">
          <label className="application-form__label" htmlFor="applicationDate">
            Application Date <span className="application-form__req" aria-hidden="true">*</span>
          </label>
          <input
            id="applicationDate"
            className="application-form__input"
            type="date"
            name="applicationDate"
            value={draft.applicationDate}
            onChange={handleChange}
            aria-required="true"
          />
        </div>
      </div>

      <div className="application-form__field">
        <label className="application-form__label" htmlFor="jobUrl">
          Job URL <span className="application-form__opt">(optional)</span>
        </label>
        <input
          id="jobUrl"
          className={`application-form__input${errors.jobUrl ? ' application-form__input--error' : ''}`}
          type="url"
          name="jobUrl"
          value={draft.jobUrl}
          onChange={handleChange}
          placeholder="https://example.com/job"
          aria-describedby={errors.jobUrl ? 'jobUrl-error' : undefined}
        />
        {errors.jobUrl && (
          <p id="jobUrl-error" className="application-form__error" role="alert">
            {errors.jobUrl}
          </p>
        )}
      </div>

      <div className="application-form__field">
        <label className="application-form__label" htmlFor="notes">
          Notes <span className="application-form__opt">(optional)</span>
        </label>
        <textarea
          id="notes"
          className="application-form__textarea"
          name="notes"
          value={draft.notes}
          onChange={handleChange}
          placeholder="Recruiter contact, interview dates, referral details, tech stack..."
          rows={3}
        />
      </div>

      <div className="application-form__actions">
        <button
          type="submit"
          className="application-form__btn application-form__btn--submit"
        >
          {isEditing ? 'Save Changes' : 'Add Application'}
        </button>
        {isEditing && onCancelEdit && (
          <button
            type="button"
            className="application-form__btn application-form__btn--cancel"
            onClick={onCancelEdit}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default Application_Form;
