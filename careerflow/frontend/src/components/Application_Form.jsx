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

function Application_Form({ onSubmit, editTarget }) {
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
      className="application-form"
      onSubmit={handleSubmit}
      noValidate
      aria-label={isEditing ? 'Edit application' : 'Add application'}
    >
      <h2 className="application-form__title">
        {isEditing ? 'Edit Application' : 'Add Application'}
      </h2>

      <div className="application-form__field">
        <label className="application-form__label" htmlFor="company">
          Company <span aria-hidden="true">*</span>
        </label>
        <input
          id="company"
          className={`application-form__input${errors.company ? ' application-form__input--error' : ''}`}
          type="text"
          name="company"
          value={draft.company}
          onChange={handleChange}
          placeholder="e.g. Acme Corp"
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
          Position <span aria-hidden="true">*</span>
        </label>
        <input
          id="position"
          className={`application-form__input${errors.position ? ' application-form__input--error' : ''}`}
          type="text"
          name="position"
          value={draft.position}
          onChange={handleChange}
          placeholder="e.g. Software Engineer Intern"
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
          Status <span aria-hidden="true">*</span>
        </label>
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

      <div className="application-form__field">
        <label className="application-form__label" htmlFor="applicationDate">
          Application Date <span aria-hidden="true">*</span>
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

      <div className="application-form__field">
        <label className="application-form__label" htmlFor="jobUrl">
          Job URL
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
          Notes
        </label>
        <textarea
          id="notes"
          className="application-form__textarea"
          name="notes"
          value={draft.notes}
          onChange={handleChange}
          placeholder="Any additional notes…"
          rows={4}
        />
      </div>

      <div className="application-form__actions">
        <button
          type="submit"
          className="application-form__btn application-form__btn--submit"
        >
          {isEditing ? 'Save Changes' : 'Add Application'}
        </button>
      </div>
    </form>
  );
}

export default Application_Form;
