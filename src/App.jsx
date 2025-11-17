import { useMemo, useState } from 'react'
import PersonaManager from './components/PersonaManager'
import RoomList from './components/RoomList'
import ChatWindow from './components/ChatWindow'

function App() {
  const [activePersonaId, setActivePersonaId] = useState(null)
  const [activeRoom, setActiveRoom] = useState(null)

  const sidebar = (
    <div className="w-full lg:w-80 p-4 space-y-6">
      <PersonaManager activePersonaId={activePersonaId} setActivePersonaId={setActivePersonaId} />
      <RoomList onEnter={(room)=> setActiveRoom(room)} />
    </div>
  )

  const main = (
    <div className="flex-1 min-h-[70vh]">
      {activeRoom ? (
        <ChatWindow room={activeRoom} personaId={activePersonaId} />
      ) : (
        <div className="h-full flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold mb-2">Durarara Realtime Radius Chat</h1>
            <p className="text-gray-600">Create a persona, pick a room, and start chatting. This MVP uses a simple API and stores data in a database for now. Radius alerts and realtime will be added next.</p>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-6xl mx-auto p-4 lg:p-6">
        <div className="bg-white/70 backdrop-blur rounded-xl shadow border overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {sidebar}
            <div className="w-px bg-gray-200 hidden lg:block" />
            {main}
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-gray-600">
          <a href="/test" className="underline">Backend & DB status</a>
        </div>
      </div>
    </div>
  )
}

export default App
