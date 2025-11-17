import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import App from './App'
import Test from './Test'
import Profile from './pages/Profile'
import Chat from './pages/Chat'
import Alerts from './pages/Alerts'
import TopNav from './components/TopNav'
import './index.css'

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <TopNav />
      <div className="pt-2">{children}</div>
      <div className="py-6 text-center text-sm text-gray-600">
        <div className="space-x-4">
          <Link to="/" className="underline">Home</Link>
          <Link to="/profile" className="underline">Profile</Link>
          <Link to="/chat" className="underline">Chat</Link>
          <Link to="/alerts" className="underline">Alerts</Link>
          <Link to="/test" className="underline">Status</Link>
        </div>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/test" element={<Test />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/alerts" element={<Alerts />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </React.StrictMode>,
)
