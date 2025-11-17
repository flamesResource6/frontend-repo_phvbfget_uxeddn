import { useEffect, useState } from 'react'

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function PersonaManager({ activePersonaId, setActivePersonaId }) {
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
      if (!activePersonaId && data.length) setActivePersonaId(data[0].id)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => { load() }, [])

  const createPersona = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${baseUrl}/api/personas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle, color, bio }),
      })
      if (!res.ok) {
        const t = await res.text()
        throw new Error(t || 'Failed to create')
      }
      setHandle('')
      setBio('')
      await load()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Personas</h2>
        <div className="mt-2 space-y-2">
          {personas.map(p => (
            <button
              key={p.id}
              onClick={() => setActivePersonaId(p.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded border ${activePersonaId===p.id? 'bg-purple-50 border-purple-300':'bg-white border-gray-200'}`}
            >
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="font-medium">@{p.handle}</span>
              </div>
              {activePersonaId===p.id && <span className="text-xs text-purple-600">active</span>}
            </button>
          ))}
          {personas.length === 0 && (
            <p className="text-sm text-gray-500">No personas yet. Create your first one.</p>
          )}
        </div>
      </div>

      <form onSubmit={createPersona} className="p-3 rounded border border-gray-200 space-y-3 bg-white">
        <h3 className="text-sm font-semibold">Create Persona</h3>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-2">
          <input value={handle} onChange={e=>setHandle(e.target.value)} required placeholder="handle"
            className="flex-1 px-3 py-2 border rounded" />
          <input type="color" value={color} onChange={e=>setColor(e.target.value)} className="w-12 h-10 border rounded" />
        </div>
        <textarea value={bio} onChange={e=>setBio(e.target.value)} placeholder="short bio" className="w-full px-3 py-2 border rounded" />
        <button disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded">
          {loading? 'Creating...':'Create Persona'}
        </button>
      </form>
    </div>
  )
}
