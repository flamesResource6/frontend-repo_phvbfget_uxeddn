import { useEffect, useState } from 'react'
import { getBaseUrl, setBaseUrl } from '../lib/api'

export default function TopNav() {
  const [url, setUrl] = useState('')
  const [ok, setOk] = useState(null)

  useEffect(() => {
    setUrl(getBaseUrl())
  }, [])

  const test = async () => {
    try {
      const res = await fetch(`${url}`)
      setOk(res.ok)
      if (res.ok) setBaseUrl(url)
    } catch (e) {
      setOk(false)
    }
  }

  return (
    <div className="w-full bg-white/70 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-3 text-sm">
        <div className="font-semibold">Durarara</div>
        <div className="flex items-center gap-2 ml-auto">
          <input value={url} onChange={(e)=>setUrl(e.target.value)} placeholder="Backend URL" className="px-2 py-1 border rounded w-64" />
          <button onClick={test} className="px-3 py-1 rounded bg-gray-800 text-white">Save</button>
          {ok===true && <span className="text-green-600">Saved ✓</span>}
          {ok===false && <span className="text-red-600">Failed</span>}
        </div>
      </div>
    </div>
  )
}
