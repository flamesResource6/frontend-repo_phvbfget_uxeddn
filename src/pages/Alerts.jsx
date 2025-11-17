import { useEffect, useState } from 'react'
import { getBaseUrl } from '../lib/api'

export default function Alerts() {
  const baseUrl = getBaseUrl()
  const [personas, setPersonas] = useState([])
  const [personaId, setPersonaId] = useState('')
  const [type, setType] = useState('Help')
  const [text, setText] = useState('')
  const [radius, setRadius] = useState(500)
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [nearby, setNearby] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(()=>{ loadPersonas(); detectLocation() }, [])

  const loadPersonas = async () => {
    const data = await (await fetch(`${baseUrl}/api/personas`)).json()
    setPersonas(data)
    if (data.length) setPersonaId(data[0].id)
  }

  const detectLocation = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition((pos)=>{
      setLat(pos.coords.latitude.toFixed(6))
      setLng(pos.coords.longitude.toFixed(6))
      refreshNearby(pos.coords.latitude, pos.coords.longitude, radius)
    })
  }

  const refreshNearby = async (la, lo, rad) => {
    const qlat = la ?? parseFloat(lat)
    const qlng = lo ?? parseFloat(lng)
    const rr = rad ?? radius
    if (!qlat || !qlng) return
    const data = await (await fetch(`${baseUrl}/api/alerts/nearby?lat=${qlat}&lng=${qlng}&radius_m=${rr}`)).json()
    setNearby(data)
  }

  const createAlert = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const body = { persona_id: personaId, type, text, radius_m: parseInt(radius), lat: parseFloat(lat), lng: parseFloat(lng) }
      const res = await fetch(`${baseUrl}/api/alerts`, { method:'POST', headers:{'Content-Type': 'application/json'}, body: JSON.stringify(body) })
      if (!res.ok) throw new Error(await res.text())
      setText('')
      await refreshNearby()
    } catch (e) {
      setError(e.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Alerts</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <form onSubmit={createAlert} className="space-y-3 p-4 border rounded bg-white">
          <div className="font-semibold">Create Alert</div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <div>
            <label className="text-sm text-gray-600">Persona</label>
            <select value={personaId} onChange={e=>setPersonaId(e.target.value)} className="w-full border rounded px-2 py-1">
              {personas.map(p=> <option key={p.id} value={p.id}>@{p.handle}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm text-gray-600">Type</label>
              <select value={type} onChange={e=>setType(e.target.value)} className="w-full border rounded px-2 py-1">
                <option>Help</option>
                <option>Event</option>
                <option>News</option>
                <option>Safety</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600">Radius (m)</label>
              <input type="number" value={radius} onChange={e=>setRadius(e.target.value)} className="w-full border rounded px-2 py-1" />
            </div>
          </div>
          <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="What's happening?" className="w-full border rounded px-3 py-2" />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm text-gray-600">Latitude</label>
              <input value={lat} onChange={e=>setLat(e.target.value)} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Longitude</label>
              <input value={lng} onChange={e=>setLng(e.target.value)} className="w-full border rounded px-2 py-1" />
            </div>
          </div>
          <div className="flex gap-2">
            <button disabled={loading} className="px-4 py-2 rounded bg-emerald-600 text-white">{loading? 'Posting...' : 'Post Alert'}</button>
            <button type="button" onClick={()=>refreshNearby()} className="px-3 py-2 rounded border">Refresh Nearby</button>
            <button type="button" onClick={detectLocation} className="px-3 py-2 rounded border">Use My Location</button>
          </div>
        </form>
        <div className="space-y-3">
          <div className="p-3 border rounded bg-white font-semibold">Nearby Alerts</div>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {nearby.map(a => (
              <div key={a.id} className="p-3 border rounded bg-white">
                <div className="text-xs text-gray-500">{a.type} • {a.distance_m} m away</div>
                <div className="font-medium">{a.text}</div>
                <div className="text-xs text-gray-500">r={a.radius_m}m • {a.lat.toFixed? a.lat.toFixed(4): a.lat}, {a.lng.toFixed? a.lng.toFixed(4): a.lng}</div>
              </div>
            ))}
            {nearby.length===0 && <p className="text-sm text-gray-500">No alerts found in range.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
