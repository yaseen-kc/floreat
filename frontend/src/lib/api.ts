const API_URL = 'http://localhost:3000'

export async function apiFetch(path: string, token: string | null) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}
