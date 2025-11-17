import { useEffect, useRef, useState } from 'react'

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function ChatWindow({ room, personaId }) {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  const load = async () => {
    if (!room) return
    const res = await fetch(`${baseUrl}/api/messages?room_id=${room.id}`)
    const data = await res.json()
    setMessages(data)
    setTimeout(()=> bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  useEffect(()=>{ load() }, [room?.id])

  const send = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setLoading(true)
    await fetch(`${baseUrl}/api/messages`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ room_id: room.id, persona_id: personaId, content: text })
    })
    setText('')
    setLoading(false)
    await load()
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b px-4 py-2 bg-white">
        <div className="font-semibold">{room?.name || 'Room'}</div>
        <div className="text-xs text-gray-500">Message stream</div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gradient-to-b from-white to-gray-50">
        {messages.map(m => (
          <div key={m.id} className="px-3 py-2 rounded-lg bg-white border">
            <div className="text-sm text-gray-500">persona {m.persona_id.slice(-4)}</div>
            <div className="text-gray-800">{m.content}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={send} className="border-t p-3 bg-white flex gap-2">
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="Write a message" className="flex-1 px-3 py-2 border rounded" />
        <button disabled={loading || !personaId} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Send</button>
      </form>
    </div>
  )
}
