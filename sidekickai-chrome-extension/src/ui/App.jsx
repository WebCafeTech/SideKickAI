import React, { useEffect, useState } from 'react'
import ChatPane from './ChatPane'
import Controls from './Controls'
import { getTheme, DEFAULT_THEME } from '../utils/themes'

export default function App(){
  const [settings, setSettings] = useState({provider:'openai', model:'gpt-4o'})
  const [theme, setTheme] = useState(DEFAULT_THEME)
  const [isPinned, setIsPinned] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(420)
  const [isLoading, setIsLoading] = useState(true)
  
  // Ensure model is set when settings load
  useEffect(() => {
    if (settings.provider && !settings.model) {
      const defaultModels = {
        openai: 'gpt-4o',
        huggingface: 'google/flan-t5-xxl',
        gemini: 'gemini-pro',
        custom: ''
      }
      const defaultModel = defaultModels[settings.provider] || 'gpt-4o'
      setSettings(prev => ({...prev, model: defaultModel}))
    }
  }, [settings.provider, settings.model])
  
  useEffect(()=> {
    console.log('[SidekickAI] App component mounted, loading settings...')
    try {
      // Check if chrome.runtime is available
      if (typeof chrome === 'undefined' || !chrome.runtime) {
        console.error('[SidekickAI] chrome.runtime is not available!')
        setIsLoading(false)
        return
      }
      
      chrome.runtime.sendMessage({type:'getSettings'}, (res)=> { 
        if (chrome.runtime.lastError) {
          console.error('[SidekickAI] Error getting settings:', chrome.runtime.lastError.message)
        } else if (res) {
          console.log('[SidekickAI] Settings loaded:', res)
          setSettings(res)
        } else {
          console.warn('[SidekickAI] No settings received, using defaults')
        }
        setIsLoading(false)
      })
      
      // Load theme and pin state
      chrome.storage.local.get(['sidekickai_pinned', 'sidekickai_theme'], (result) => {
        if (chrome.runtime.lastError) {
          console.error('[SidekickAI] Error getting storage:', chrome.runtime.lastError.message)
        } else {
          if (result.sidekickai_pinned !== undefined) {
            setIsPinned(result.sidekickai_pinned)
          }
          if (result.sidekickai_theme) {
            setTheme(result.sidekickai_theme)
          }
        }
        setIsLoading(false)
      })
    } catch (err) {
      console.error('[SidekickAI] Error getting settings:', err)
      setIsLoading(false)
    }
    
    // Listen for messages from content script
    const handleMessage = (event) => {
      if (!event.data || !event.data.type) return
      const msg = event.data
      if (msg.type === 'sidebarState') {
        setSidebarWidth(msg.width || 420)
        setIsPinned(msg.pinned || false)
      } else if (msg.type === 'sidebarResize') {
        setSidebarWidth(msg.width || 420)
      } else if (msg.type === 'sidebarPin') {
        setIsPinned(msg.pinned || false)
      }
    }
    
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  },[])
  
  const handleTogglePin = () => {
    try {
      window.parent.postMessage({type:'togglePin'}, '*')
    } catch (err) {
      console.error('[SidekickAI] Error toggling pin:', err)
    }
  }
  
  const currentTheme = getTheme(theme)
  const colors = currentTheme.colors
  
  // Show loading state
  if (isLoading) {
    return (
      <div 
        className='sidepanel' 
        style={{
          width: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          flexDirection: 'column',
          background: colors.background,
          color: colors.text
        }}
      >
        <div style={{color: colors.text}}>Loading SidekickAI...</div>
      </div>
    )
  }
  
  return (
    <div 
      className='sidepanel' 
      style={{
        width: '100%',
        background: colors.background,
        backdropFilter: colors.backdrop,
        WebkitBackdropFilter: colors.backdrop,
        color: colors.text,
        boxShadow: colors.panelShadow
      }}
    >
      <div 
        className='header'
        style={{
          background: colors.panel,
          borderBottom: `1px solid ${colors.panelBorder}`,
          backdropFilter: colors.backdrop,
          WebkitBackdropFilter: colors.backdrop
        }}
      >
        <div style={{display:'flex', alignItems:'center'}}>
          <img 
            src='assets/logo.svg' 
            alt='SidekickAI' 
            style={{height:36, marginRight:8}}
            onError={(e) => {
              console.warn('[SidekickAI] Logo failed to load');
              e.target.style.display = 'none';
            }}
          />
          <h3 style={{margin:0, color: colors.text}}>SidekickAI</h3>
        </div>
        <div className='header-actions' style={{display:'flex', gap:'8px', alignItems:'center'}}>
          <button 
            onClick={() => {
              // Open ChatGPT web interface in new tab
              if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
                chrome.tabs.create({ url: 'https://chat.openai.com' })
              } else {
                window.open('https://chat.openai.com', '_blank', 'noopener,noreferrer')
              }
            }}
            title="Open ChatGPT Web Interface (No API key needed)"
            style={{
              background: colors.panel,
              border: `1px solid ${colors.panelBorder}`,
              color: colors.text,
              padding: '4px 8px',
              fontSize: '12px',
              cursor: 'pointer',
              borderRadius: '6px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = colors.buttonHover
            }}
            onMouseLeave={(e) => {
              e.target.style.background = colors.panel
            }}
          >
            💬 ChatGPT
          </button>
          <button 
            onClick={() => {
              try {
                chrome.runtime.openOptionsPage()
              } catch (err) {
                console.error('[SidekickAI] Error opening options:', err)
                window.open(chrome.runtime.getURL('options.html'), '_blank')
              }
            }}
            title="Open Settings"
            style={{
              background: colors.panel,
              border: `1px solid ${colors.panelBorder}`,
              color: colors.text,
              padding: '4px 8px',
              fontSize: '12px',
              cursor: 'pointer',
              borderRadius: '6px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = colors.buttonHover
            }}
            onMouseLeave={(e) => {
              e.target.style.background = colors.panel
            }}
          >
            ⚙️ Settings
          </button>
          <button 
            onClick={handleTogglePin}
            title={isPinned ? 'Unpin sidebar' : 'Pin sidebar'}
            style={{
              background: isPinned ? colors.accent : colors.panel,
              border: `1px solid ${isPinned ? colors.accentBorder : colors.panelBorder}`,
              color: colors.text,
              padding: '4px 8px',
              fontSize: '12px',
              borderRadius: '6px',
              transition: 'all 0.2s'
            }}
          >
            {isPinned ? '📌 Pinned' : '📌 Pin'}
          </button>
          <button 
            onClick={()=> {
              try {
                window.parent.postMessage({type:'removeSidebar'}, '*')
              } catch (err) {
                console.error('[SidekickAI] Error closing sidebar:', err)
              }
            }}
            style={{
              background: colors.panel,
              border: `1px solid ${colors.panelBorder}`,
              color: colors.text,
              padding: '4px 8px',
              fontSize: '12px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
      <Controls theme={currentTheme} />
      <ChatPane settings={settings} theme={currentTheme} />
    </div>
  )
}
