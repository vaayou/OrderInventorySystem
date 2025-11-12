const BASE = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL.replace(/\/$/, '') : '';
function buildUrl(url) {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url; // absolute URL passed
  if (!BASE) return url;
  // ensure leading slash
  return url.startsWith('/') ? `${BASE}${url}` : `${BASE}/${url}`;
}

const api = {
  async get(url) {
    const res = await fetch(buildUrl(url));
    if (!res.ok) throw new Error(await res.text());
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  },
  async post(url, data) {
    const res = await fetch(buildUrl(url), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  },
  async put(url, data) {
    const res = await fetch(buildUrl(url), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  },
  async delete(url) {
    const res = await fetch(buildUrl(url), { method: 'DELETE' });
    if (!res.ok) throw new Error(await res.text());
    return res.text();
  },
};
export default api;
