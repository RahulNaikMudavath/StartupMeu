const BASE_URL = '/api/applications';

async function handleResponse(res) {
  const body = await res.json();
  if (!res.ok) throw new Error(body.message || 'Unexpected error');
  return body;
}

export const fetchAll = () =>
  fetch(BASE_URL).then(handleResponse);

export const fetchStats = () =>
  fetch(`${BASE_URL}/stats`).then(handleResponse);

export const fetchById = (id) =>
  fetch(`${BASE_URL}/${id}`).then(handleResponse);

export const createApplication = (data) =>
  fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse);

export const updateApplication = (id, data) =>
  fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse);

export const deleteApplication = (id) =>
  fetch(`${BASE_URL}/${id}`, { method: 'DELETE' }).then(handleResponse);
