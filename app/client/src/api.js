// src/api.js
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export async function fetchMessages(course) {
  const res = await fetch(`${API_BASE}/messages/${encodeURIComponent(course)}`);
  if (!res.ok) throw new Error('Failed to fetch messages');
  return res.json();
}

export async function postMessage({ user_name, text, course }) {
  const res = await fetch(`${API_BASE}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_name, text, course })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to post message');
  }
  return res.json();
}
