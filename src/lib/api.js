export function getBaseUrl() {
  const stored = localStorage.getItem('backend_url')
  const envUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  return stored || envUrl
}

export function setBaseUrl(url) {
  if (!url) return
  localStorage.setItem('backend_url', url)
}
