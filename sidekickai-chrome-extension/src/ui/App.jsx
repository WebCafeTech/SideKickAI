import React, { useEffect, useState, useMemo, useCallback } from 'react'
import ChatPane from './ChatPane'
import Controls from './Controls'
import { getTheme, DEFAULT_THEME } from '../utils/themes'
import { ThemedButton } from '../components/Button'
import { SettingsIcon, PinIcon, CloseIcon } from '../components/Icons'

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
    // Optimized: Load all data in parallel using Promise.all
    const loadInitialData = async () => {
      try {
        // Check if chrome.runtime is available
        if (typeof chrome === 'undefined' || !chrome.runtime) {
          console.error('[SidekickAI] chrome.runtime is not available!')
          setIsLoading(false)
          return
        }
        
        // Load settings and storage in parallel
        const [settingsResult, storageResult] = await Promise.all([
          new Promise((resolve) => {
            chrome.runtime.sendMessage({type:'getSettings'}, (res)=> {
              if (chrome.runtime.lastError) {
                console.error('[SidekickAI] Error getting settings:', chrome.runtime.lastError.message)
                resolve(null)
              } else {
                resolve(res || null)
              }
            })
          }),
          new Promise((resolve) => {
            chrome.storage.local.get(['sidekickai_pinned', 'sidekickai_theme'], (result) => {
              if (chrome.runtime.lastError) {
                console.error('[SidekickAI] Error getting storage:', chrome.runtime.lastError.message)
                resolve({})
              } else {
                resolve(result || {})
              }
            })
          })
        ])
        
        // Update state once after all data is loaded
        if (settingsResult) {
          setSettings(settingsResult)
        }
        if (storageResult.sidekickai_pinned !== undefined) {
          setIsPinned(storageResult.sidekickai_pinned)
        }
        if (storageResult.sidekickai_theme) {
          setTheme(storageResult.sidekickai_theme)
        }
      } catch (err) {
        console.error('[SidekickAI] Error loading data:', err)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadInitialData()
    
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
  
  const handleTogglePin = useCallback(() => {
    try {
      window.parent.postMessage({type:'togglePin'}, '*')
    } catch (err) {
      console.error('[SidekickAI] Error toggling pin:', err)
    }
  }, [])
  
  // Memoize theme to prevent unnecessary recalculations
  const currentTheme = useMemo(() => getTheme(theme), [theme])
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
        <div style={{color: colors.text}}>Loading MysticKode SidePanel AI...</div>
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
            alt='MysticKode SidePanel AI' 
            style={{height:36, marginRight:8}}
            onError={(e) => {
              console.warn('[SidekickAI] Logo failed to load');
              e.target.style.display = 'none';
            }}
          />
          <h3 style={{margin:0, color: colors.text}}>MysticKode SidePanel AI</h3>
        </div>
        <div className='header-actions' style={{display:'flex', gap:'8px', alignItems:'center'}}>
          {/* <button 
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
          </button> */}
          <ThemedButton
            theme={currentTheme}
            variant="icon"
            size="small"
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
              width: '32px',
              height: '32px',
              padding: '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <SettingsIcon size={16} color={colors.text || '#e6eef6'} />
          </ThemedButton>
          <ThemedButton
            theme={currentTheme}
            variant="icon"
            size="small"
            onClick={handleTogglePin}
            title={isPinned ? 'Unpin sidebar' : 'Pin sidebar'}
            style={{
              width: '32px',
              height: '32px',
              padding: '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isPinned ? colors.accent : colors.panel,
              border: `1px solid ${isPinned ? colors.accentBorder : colors.panelBorder}`
            }}
          >
            <PinIcon size={16} color={colors.text || '#e6eef6'} filled={isPinned} />
          </ThemedButton>
          <ThemedButton
            theme={currentTheme}
            variant="icon"
            size="small"
            onClick={()=> {
              try {
                window.parent.postMessage({type:'removeSidebar'}, '*')
              } catch (err) {
                console.error('[SidekickAI] Error closing sidebar:', err)
              }
            }}
            title="Close sidebar"
            style={{
              width: '32px',
              height: '32px',
              padding: '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CloseIcon size={16} color={colors.text || '#e6eef6'} />
          </ThemedButton>
        </div>
      </div>
      <Controls theme={currentTheme} />
      <ChatPane settings={settings} theme={currentTheme} key={`chat-${settings.provider}-${settings.model}`} />
    </div>
  )
}
