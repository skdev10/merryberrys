/** Client-side admin API helpers — sends adminToken from localStorage. */

export function adminAuthHeaders() {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function clearAdminSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
}

export function redirectToAdminLogin(expired = false) {
  if (typeof window === 'undefined') return;
  if (window.location.pathname.startsWith('/admin/login')) return;
  const query = expired ? '?expired=1' : '';
  window.location.href = `/admin/login${query}`;
}

export async function adminFetch(url, options = {}) {
  const headers = new Headers(options.headers || undefined);
  const auth = adminAuthHeaders();
  if (auth.Authorization && !headers.has('Authorization')) {
    headers.set('Authorization', auth.Authorization);
  }

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  if (options.body && !isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: 'same-origin',
  });

  if (res.status === 401 && typeof window !== 'undefined') {
    clearAdminSession();
    redirectToAdminLogin(true);
  }

  return res;
}
