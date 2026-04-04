let accessToken: string | null = null

export function setAccessToken(token: string | null) {
  accessToken = token
}

export function getAccessToken() {
  return accessToken
}

async function refreshToken() {
  try {
    const res = await fetch('/api/auth/refresh', { method: 'POST' })
    if (!res.ok) throw new Error('Refresh failed')
    const data = await res.json()
    setAccessToken(data.accessToken)
    return data.accessToken
  } catch (err) {
    setAccessToken(null)
    throw err
  }
}

const isClient = typeof window !== 'undefined'

export async function apiFetch(url: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {})
  
  if (accessToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  try {
    const response = await fetch(url, { ...options, headers })

    const isAuthRoute = url.includes('/api/auth/login') || url.includes('/api/auth/signup')

    if (response.status === 401 && !isAuthRoute) {
      try {
        const newToken = await refreshToken()
        headers.set('Authorization', `Bearer ${newToken}`)
        return await fetch(url, { ...options, headers })
      } catch (err) {
        if (isClient) {
          window.dispatchEvent(new CustomEvent('auth:logout'))
        }
        return response
      }
    }

    return response
  } catch (err: any) {
    console.error('API Fetch error:', err)
    return new Response(JSON.stringify({ error: 'Network error or server unreachable' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
