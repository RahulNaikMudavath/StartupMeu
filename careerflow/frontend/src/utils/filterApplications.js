/**
 * Filters an array of applications by status and/or search text.
 *
 * @param {Array} applications - The full list of application objects.
 * @param {string} searchText - Substring to match against `company` or `position` (case-insensitive).
 * @param {string} statusFilter - Status value to filter by, or `'All'` to skip status filtering.
 * @returns {Array} The filtered array of applications.
 */
export function filterApplications(applications, searchText, statusFilter) {
  let result = applications;

  // Filter by status (skip if 'All')
  if (statusFilter && statusFilter !== 'All') {
    result = result.filter((app) => app.status === statusFilter);
  }

  // Filter by case-insensitive substring match on company or position
  if (searchText && searchText.trim().length > 0) {
    const lowerSearch = searchText.toLowerCase();
    result = result.filter(
      (app) =>
        app.company.toLowerCase().includes(lowerSearch) ||
        app.position.toLowerCase().includes(lowerSearch)
    );
  }

  return result;
}
