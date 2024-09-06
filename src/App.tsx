import { useCallback, useEffect, useState } from 'react'
import './App.css'

function App() {
  const [pat, setPat] = useState('')

  const getPat = useCallback(async () => {
    const pat = (await chrome.storage.local.get('pat'))['pat']
    setPat(pat)
  }, [])

  const updatePat = useCallback(async (pat: string) => {
    await chrome.storage.local.set({ pat })
  }, [])

  useEffect(() => {
    getPat()
  }, [getPat])

  return (
    <div>
      <h1>Gitthub Extension</h1>
      <div className="card">
        <h2>Personal Access Token</h2>
        <button onClick={() => updatePat(pat)}>Update</button>
        <br />
        <input type="text" value={pat} onChange={(e) => setPat(e.target.value)} />
      </div>
    </div>
  )
}

export default App
