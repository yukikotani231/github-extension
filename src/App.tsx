import { useState } from 'react'
import './App.css'
import { BGMessage } from './background'
import { CSMessage } from './contentScript/script'

function App() {
  const [message, setMessage] = useState('')

  const handleConnectToContentScript = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
    const currentTab = tabs[0]
    if (currentTab.id === undefined) {
      setMessage('No active tab found')
      return
    }

    const response = await chrome.tabs.sendMessage<CSMessage, string>(currentTab.id, { action: 'hello' })
    setMessage(response)
  }

  const handleConntectToBackgroundScript = async () => {
    const response = await chrome.runtime.sendMessage<BGMessage, string>({ action: 'hello' })
    setMessage(response)
  }

  return (
    <div>
      <h1>Chrome Extention Template</h1>
      <div className="card">
        <button onClick={handleConnectToContentScript}>
          connect to content script
        </button>
        <br />
        <br />
        <button onClick={handleConntectToBackgroundScript}>
          connect to background script
        </button>
        <br />
        <br />
        {message && <p>{message}</p>}
      </div>
    </div>
  )
}

export default App
