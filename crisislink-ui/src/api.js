// Points at your deployed FastAPI backend (fast_api_app.py — /health, /sos).
// Set VITE_API_URL in a .env file for local dev, and as an environment
// variable in Vercel for production. Falls back to localhost for dev.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_URL}/health`, { method: 'GET' })
    if (!res.ok) throw new Error('offline')
    const data = await res.json()
    return { online: true, model: data.model }
  } catch {
    return { online: false, model: null }
  }
}

// Submits the emergency report to /sos and returns the parsed pipeline result.
export async function submitEmergency(reportText, userId) {
  const res = await fetch(`${API_URL}/sos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ report_text: reportText, user_id: userId || undefined }),
  })
  if (!res.ok) {
    const detail = await res.json().catch(() => null)
    throw new Error(detail?.detail || `Request failed (${res.status})`)
  }
  return res.json()
}

export { API_URL }
