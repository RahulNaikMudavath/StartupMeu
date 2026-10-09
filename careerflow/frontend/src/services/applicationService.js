const BASE_URL = '/api/applications';

/**
 * Parses the JSON response body. Throws an Error for non-2xx responses
 * using the API's error message, or a generic fallback.
 *
 * @param {Response} res - The Fetch API Response object
 * @returns {Promise<any>} Parsed response body
 */
async function handleResponse(res) {
  const body = await res.json();
  if (!res.ok) throw new Error(body.message || 'Unexpected error');
  return body;
}

/**
 * Fetch all applications.
 * GET /api/applications
 *
 * @returns {Promise<Application[]>}
 */
export const fetchAll = () =>
  fetch(BASE_URL).then(handleResponse);

/**
 * Fetch aggregate statistics.
 * GET /api/applications/stats
 *
 * @returns {Promise<Stats>}
 */
export const fetchStats = () =>
  fetch(`${BASE_URL}/stats`).then(handleResponse);

/**
 * Fetch a single application by ID.
 * GET /api/applications/:id
 *
 * @param {string} id - MongoDB ObjectId string
 * @returns {Promise<Application>}
 */
export const fetchById = (id) =>
  fetch(`${BASE_URL}/${id}`).then(handleResponse);

/**
 * Create a new application.
 * POST /api/applications
 *
 * @param {object} data - Application fields
 * @returns {Promise<Application>}
 */
export const createApplication = (data) =>
  fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse);

/**
 * Update an existing application.
 * PUT /api/applications/:id
 *
 * @param {string} id - MongoDB ObjectId string
 * @param {object} data - Fields to update
 * @returns {Promise<Application>}
 */
export const updateApplication = (id, data) =>
  fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse);

/**
 * Delete an application by ID.
 * DELETE /api/applications/:id
 *
 * @param {string} id - MongoDB ObjectId string
 * @returns {Promise<{ message: string }>}
 */
export const deleteApplication = (id) =>
  fetch(`${BASE_URL}/${id}`, { method: 'DELETE' }).then(handleResponse);
