import { useEffect, useState } from 'react'
import { getBaseUrl } from '../lib/api'

export default function Profile() {
  const baseUrl = getBaseUrl()
  const [personas, setPersonas] = useState([])
  const [handle, setHandle] = useState('')
  const [color, setColor] = useState('#7c3aed')
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/personas`)
      const data = await res.json()
      setPersonas(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(()=>{ load() }, [])

  const createPersona = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${baseUrl}/api/personas`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle, color, bio })
      })
      if (!res.ok) throw new Error(await res.text())
      setHandle(''); setBio('')
      await load()
    } catch (e) {
      setError(e.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h2 className="font-semibold">Your Personas</h2>
          <div className="space-y-2">
            {personas.map(p => (
              <div key={p.id} className="flex items-center justify-between px-3 py-2 border rounded bg-white">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                  <div>
                    <div className="font-medium">@{p.handle}</div>
                    {p.bio && <div className="text-xs text-gray-500">{p.bio}</div>}
                  </div>
                </div>
                <span className="text-xs text-gray-500">trust {p.trust_level || 1}</span>
              </div>
            ))}
            {personas.length===0 && <p className="text-sm text-gray-500">No personas yet.</p>}
          </div>
        </div>
        <form onSubmit={createPersona} className="space-y-3 p-4 border rounded bg-white">
          <h2 className="font-semibold">Create Persona</h2>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <input className="w-full border rounded px-3 py-2" placeholder="handle" value={handle} onChange={e=>setHandle(e.target.value)} required />
          <textarea className="w-full border rounded px-3 py-2" placeholder="bio" value={bio} onChange={e=>setBio(e.target.value)} />
          <div className="flex items-center gap-2">
            <label className="text-sm">Color</label>
            <input type="color" value={color} onChange={e=>setColor(e.target.value)} />
          </div>
          <button disabled={loading} className="px-4 py-2 bg-purple-600 text-white rounded">{loading? 'Creating...' : 'Create'}</button>
        </form>
      </div>
    </div>
  )
}
