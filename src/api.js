const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

function buildQuery(params = {}){
  const esc = encodeURIComponent;
  return Object.keys(params)
    .filter(k => params[k] !== undefined && params[k] !== null && params[k] !== '')
    .map(k => `${esc(k)}=${esc(params[k])}`)
    .join('&');
}

export async function getLeaderboard(opts = {}){
  const params = { ...opts };
  // map `date` to the correct param name based on period
  if (params.period === 'monthly' && params.date){ params.month = params.date; delete params.date; }
  if (params.period === 'weekly' && params.date){ params.week = params.date; delete params.date; }
  const q = buildQuery(params);
  const url = `${API_BASE}/leaderboard${q ? `?${q}` : ''}`;
  const res = await fetch(url);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw body;
  return body;
}

export async function getMyRank(opts = {}){
  const params = { ...opts };
  if (params.period === 'monthly' && params.date){ params.month = params.date; delete params.date; }
  if (params.period === 'weekly' && params.date){ params.week = params.date; delete params.date; }
  const q = buildQuery(params);
  const url = `${API_BASE}/leaderboard/me${q ? `?${q}` : ''}`;
  const res = await fetch(url);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw body;
  return body;
}

export async function postEvent(event){
  const res = await fetch(`${API_BASE}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw body;
  return body;
}

export async function putPointsConfig(cfg){
  const res = await fetch(`${API_BASE}/admin/points-config`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cfg),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw body;
  return body;
}

export async function postRollover(payload = {}){
  const res = await fetch(`${API_BASE}/admin/rollover`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw body;
  return body;
}

export default { getLeaderboard, getMyRank, postEvent, putPointsConfig, postRollover };

// Auth endpoints
export async function signup(payload = {}){
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw body;
  return body;
}

export async function login(payload = {}){
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw body;
  return body;
}
