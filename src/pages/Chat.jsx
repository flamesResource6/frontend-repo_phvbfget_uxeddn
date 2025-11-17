import { useEffect, useState } from 'react'
import { getBaseUrl } from '../lib/api'

export default function Chat() {
  const baseUrl = getBaseUrl()
  const [rooms, setRooms] = useState([])
  const [activeRoom, setActiveRoom] = useState(null)
  const [personas, setPersonas] = useState([])
  const [personaId, setPersonaId] = useState('')
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')

  useEffect(() => { loadRooms(); loadPersonas() }, [])

  const loadRooms = async () => {
    const data = await (await fetch(`${baseUrl}/api/rooms`)).json()
    setRooms(data)
    if (data.length) setActiveRoom(data[0])
  }
  const loadPersonas = async () => {
    const data = await (await fetch(`${baseUrl}/api/personas`)).json()
    setPersonas(data)
    if (data.length) setPersonaId(data[0].id)
  }
  const loadMessages = async (roomId) => {
    const data = await (await fetch(`${baseUrl}/api/messages?room_id=${roomId}`)).json()
    setMessages(data)
  }
  useEffect(()=>{ if(activeRoom) loadMessages(activeRoom.id) }, [activeRoom?.id])

  const send = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    await fetch(`${baseUrl}/api/messages`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ room_id: activeRoom.id, persona_id: personaId, content: text }) })
    setText('')
    await loadMessages(activeRoom.id)
  }

  return (
    <div className="max-w-5xl mx-auto p-4 grid md:grid-cols-3 gap-4">
      <div className="md:col-span-1 space-y-3">
        <div className="p-3 border rounded bg-white">
          <div className="text-sm text-gray-600 mb-1">Persona</div>
          <select value={personaId} onChange={e=>setPersonaId(e.target.value)} className="w-full border rounded px-2 py-1">
            {personas.map(p=> <option key={p.id} value={p.id}>@{p.handle}</option>)}
          </select>
        </div>
        <div className="p-3 border rounded bg-white space-y-2">
          <div className="font-semibold">Rooms</div>
          {rooms.map(r=> (
            <button key={r.id} onClick={()=>setActiveRoom(r)} className={`w-full text-left px-3 py-2 rounded border ${activeRoom?.id===r.id?'bg-blue-50 border-blue-300':'bg-white'}`}>
              <div className="font-medium">{r.name}</div>
              <div className="text-xs text-gray-500">{r.type} • {r.member_count} members</div>
            </button>
          ))}
        </div>
      </div>
      <div className="md:col-span-2 flex flex-col border rounded bg-white">
        <div className="px-4 py-2 border-b">
          <div className="font-semibold">{activeRoom?.name || 'Select a room'}</div>
        </div>
        <div className="flex-1 p-4 space-y-2 max-h-[60vh] overflow-y-auto">
          {messages.map(m=> (
            <div key={m.id} className="px-3 py-2 rounded border">
              <div className="text-xs text-gray-500">persona {m.persona_id.slice(-4)}</div>
              <div>{m.content}</div>
            </div>
          ))}
        </div>
        <form onSubmit={send} className="p-3 border-t flex gap-2">
          <input value={text} onChange={e=>setText(e.target.value)} placeholder="Write a message" className="flex-1 border rounded px-3 py-2" />
          <button className="px-4 py-2 rounded bg-blue-600 text-white">Send</button>
        </form>
      </div>
    </div>
  )
}
