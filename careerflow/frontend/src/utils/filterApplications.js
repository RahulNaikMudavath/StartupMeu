export function filterApplications(applications, searchText, statusFilter) {
  let result = applications;

  if (statusFilter && statusFilter !== 'All') {
    result = result.filter((app) => app.status === statusFilter);
  }

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
