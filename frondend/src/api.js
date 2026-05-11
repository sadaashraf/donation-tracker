const BASE_URL = import.meta.env.VITE_API_URL ?? '';

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(`${BASE_URL}/api${path}`, {
      ...options,
      signal: controller.signal,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message ?? `Request failed: ${res.status}`);
    }
    return res.status === 204 ? null : res.json();
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('Request timed out. Please try again.');
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

// ── Auth ─────────────────────────────────────────────────
export const registerUser = (data) => request('/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
export const loginUser = (data) => request('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
export const fetchUsers = () => request('/auth/users');

// ── Year Plans ────────────────────────────────────────────
export const fetchYearPlans = () => request('/year-plans');
export const createYearPlan = (data) => request('/year-plans', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
export const deleteYearPlan = (id) => request(`/year-plans/${id}`, { method: 'DELETE' });

// ── Dashboard ─────────────────────────────────────────────
export const fetchDashboardStats = (year) => request(`/dashboard/stats?year=${year}`);

// ── Members ───────────────────────────────────────────────
export const fetchMembers = (search = '', year = '', status = '') =>
  request(`/members?search=${encodeURIComponent(search)}&year=${encodeURIComponent(year)}&status=${encodeURIComponent(status)}`);
export const fetchMember = (id) => request(`/members/${id}`);
export const createMember = (data) => request('/members', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
export const updateMember = (id, data) => request(`/members/${id}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
export const deleteMember = (id) => request(`/members/${id}`, { method: 'DELETE' });
export const fetchMemberSummary = (id, year) => request(`/members/${id}/year/${year}/summary`);

// ── Payments ──────────────────────────────────────────────
export const fetchPayments = (search = '', year = '', memberId = '') =>
  request(`/payments?search=${encodeURIComponent(search)}&year=${encodeURIComponent(year)}&memberId=${encodeURIComponent(memberId)}`);
export const createPayment = (formData) => request('/payments', { method: 'POST', body: formData });
export const updatePayment = (id, data) => request(`/payments/${id}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
export const deletePayment = (id) => request(`/payments/${id}`, { method: 'DELETE' });

// ── Profile ───────────────────────────────────────────────
export const fetchProfile = () => request('/profile');
export const updateProfile = (data) => request('/profile', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});

// ── Helpers ───────────────────────────────────────────────
export const proofUrl = (filename) => filename ? `${BASE_URL}/uploads/${filename}` : null;
