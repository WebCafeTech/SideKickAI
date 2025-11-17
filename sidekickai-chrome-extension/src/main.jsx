import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './ui/App'
import './ui/styles.css'

// Error handling for React app
try {
  const rootElement = document.getElementById('root')
  if (!rootElement) {
    console.error('[SidekickAI] Root element not found!')
    document.body.innerHTML = '<div style="padding:20px;color:#fff">Error: Root element not found</div>'
  } else {
    const root = createRoot(rootElement)
    root.render(<App />)
    console.log('[SidekickAI] React app rendered successfully')
  }
} catch (error) {
  console.error('[SidekickAI] Failed to render React app:', error)
  document.body.innerHTML = `
    <div style="padding:20px;color:#fff;font-family:system-ui">
      <h3>SidekickAI Loading Error</h3>
      <p>${error.message}</p>
      <button onclick="window.location.reload()" style="padding:8px 16px;margin-top:10px;cursor:pointer">Reload</button>
    </div>
  `
}
