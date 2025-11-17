import { useEffect, useState } from 'react'

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function RoomList({ onEnter }) {
  const [rooms, setRooms] = useState([])
  const [name, setName] = useState('')
  const [creating, setCreating] = useState(false)

  const load = async () => {
    const res = await fetch(`${baseUrl}/api/rooms`)
    const data = await res.json()
    setRooms(data)
  }
  useEffect(()=>{ load() }, [])

  const createRoom = async (e) => {
    e.preventDefault()
    setCreating(true)
    const res = await fetch(`${baseUrl}/api/rooms`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, type: 'topic' })
    })
    setCreating(false)
    setName('')
    await load()
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Rooms</h2>
      <div className="space-y-2">
        {rooms.map(r => (
          <div key={r.id} className="flex items-center justify-between px-3 py-2 rounded border bg-white">
            <div>
              <div className="font-medium">{r.name}</div>
              <div className="text-xs text-gray-500 capitalize">{r.type} • {r.member_count} members</div>
            </div>
            <button onClick={()=>onEnter(r)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">Enter</button>
          </div>
        ))}
        {rooms.length === 0 && <p className="text-sm text-gray-500">No rooms yet.</p>}
      </div>

      <form onSubmit={createRoom} className="flex gap-2">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="New room name" className="flex-1 px-3 py-2 border rounded" />
        <button disabled={creating} className="bg-gray-800 text-white px-3 py-2 rounded">{creating? '...' : 'Create'}</button>
      </form>
    </div>
  )
}
