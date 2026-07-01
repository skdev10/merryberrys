/** Client-side admin API helpers — sends adminToken from localStorage. */
export function adminAuthHeaders() {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function adminFetch(url, options = {}) {
  const headers = {
    ...(options.headers || {}),
    ...adminAuthHeaders(),
  };
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  if (options.body && !isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  return fetch(url, { ...options, headers });
}
