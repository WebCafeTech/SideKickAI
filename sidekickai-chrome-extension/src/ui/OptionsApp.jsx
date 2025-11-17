import React, { useEffect, useState } from 'react'
import { THEMES, DEFAULT_THEME } from '../utils/themes'

// Model lists for each provider
const MODEL_LISTS = {
  openai: [
    { value: 'gpt-4o', label: 'GPT-4o (Default)' },
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
    { value: 'gpt-4-turbo-preview', label: 'GPT-4 Turbo Preview' },
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
    { value: 'gpt-3.5-turbo-16k', label: 'GPT-3.5 Turbo 16k' },
  ],
  huggingface: [
    { value: 'google/flan-t5-xxl', label: 'FLAN-T5 XXL (Default)' },
    { value: 'google/flan-ul2', label: 'FLAN-UL2' },
    { value: 'mistralai/Mistral-7B-Instruct-v0.2', label: 'Mistral 7B Instruct' },
    { value: 'meta-llama/Llama-2-7b-chat-hf', label: 'Llama 2 7B Chat' },
    { value: 'tiiuae/falcon-7b-instruct', label: 'Falcon 7B Instruct' },
  ],
  gemini: [
    { value: 'gemini-pro', label: 'Gemini Pro (Default - Recommended)' },
    { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
    { value: 'gemini-1.5-flash-latest', label: 'Gemini 1.5 Flash Latest' },
    { value: 'gemini-1.5-pro-latest', label: 'Gemini 1.5 Pro Latest' },
    { value: 'gemini-pro-vision', label: 'Gemini Pro Vision' },
  ],
  custom: []
}

// Default models for each provider
const DEFAULT_MODELS = {
  openai: 'gpt-4o',
  huggingface: 'google/flan-t5-xxl',
  gemini: 'gemini-pro',
  custom: ''
}

export default function OptionsApp(){
  const [openai, setOpenai] = useState('')
  const [hf, setHf] = useState('')
  const [gemini, setGemini] = useState('')
  const [provider, setProvider] = useState('openai')
  const [model, setModel] = useState('')
  const [customEndpoint, setCustomEndpoint] = useState('')
  const [theme, setTheme] = useState(DEFAULT_THEME)
  const [geminiModels, setGeminiModels] = useState([])
  const [loadingGeminiModels, setLoadingGeminiModels] = useState(false)
  
  useEffect(() => {
    chrome.storage.local.get(['ai_settings', 'sidekickai_theme'], (res) => {
      const s = res.ai_settings || {}
      setOpenai(s.keys?.openai || '')
      setHf(s.keys?.huggingface || '')
      setGemini(s.keys?.gemini || '')
      setProvider(s.provider || 'openai')
      setModel(s.model || DEFAULT_MODELS[s.provider || 'openai'])
      setCustomEndpoint(s.customEndpoint || '')
      setTheme(res.sidekickai_theme || DEFAULT_THEME)
    })
  }, [])
  
  // Fetch Gemini models when provider is Gemini and key is available
  useEffect(() => {
    if (provider === 'gemini' && gemini) {
      setLoadingGeminiModels(true)
      chrome.runtime.sendMessage({type: 'listGeminiModels'}, (response) => {
        setLoadingGeminiModels(false)
        if (response && response.ok && response.models) {
          const models = response.models.map(m => {
            const modelName = m.name.startsWith('models/') 
              ? m.name.replace('models/', '') 
              : m.name;
            return {
              value: modelName,
              label: m.displayName || modelName,
              description: m.description || ''
            };
          });
          setGeminiModels(models)
          
          // Auto-select first model if current model is not in the list
          if (models.length > 0 && !models.some(m => m.value === model)) {
            const preferred = models.find(m => 
              m.value.includes('gemini-pro') || 
              m.value.includes('gemini-1.5-flash') ||
              m.value.includes('gemini-1.5-pro')
            ) || models[0]
            setModel(preferred.value)
          }
        } else {
          setGeminiModels(MODEL_LISTS.gemini)
        }
      })
    } else if (provider === 'gemini' && !gemini) {
      setGeminiModels(MODEL_LISTS.gemini)
    }
  }, [provider, gemini])
  
  // Update model when provider changes
  useEffect(() => {
    if (provider && !model) {
      setModel(DEFAULT_MODELS[provider] || '')
    }
  }, [provider])
  
  const handleProviderChange = (e) => {
    const newProvider = e.target.value
    setProvider(newProvider)
    setModel(DEFAULT_MODELS[newProvider] || '')
  }
  
  const save = () => {
    const s = {
      provider,
      model: model || DEFAULT_MODELS[provider],
      customEndpoint,
      keys: { openai, huggingface: hf, gemini }
    }
    chrome.storage.local.set({ 
      ai_settings: s,
      sidekickai_theme: theme
    }, () => alert('Settings saved successfully!'))
  }
  
  const getModels = () => {
    if (provider === 'gemini' && geminiModels.length > 0) {
      return geminiModels
    }
    return MODEL_LISTS[provider] || []
  }
  
  const models = getModels()
  const showModelSelect = provider !== 'custom'
  
  return (
    <div style={{padding:12, fontFamily:'sans-serif', maxWidth: '600px'}}>
      <h2>SidekickAI — Options</h2>
      <p style={{color: '#666', fontSize: '14px', marginBottom: '20px'}}>
        Configure your API keys and select the AI model to use for all chat operations.
      </p>
      
      {/* ChatGPT Web Interface Option */}
      <div style={{
        marginBottom: '24px',
        padding: '16px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1))',
        border: '2px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '8px'
      }}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px'}}>
          <h3 style={{margin: 0, fontSize: '16px', color: '#111'}}>💬 Use ChatGPT Web Interface</h3>
          <button
            onClick={() => {
              if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
                chrome.tabs.create({ url: 'https://chat.openai.com' })
              } else {
                window.open('https://chat.openai.com', '_blank', 'noopener,noreferrer')
              }
            }}
            style={{
              padding: '6px 12px',
              background: 'linear-gradient(135deg, #10b981, #3b82f6)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)'
              e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)'
              e.target.style.boxShadow = 'none'
            }}
          >
            Open ChatGPT
          </button>
        </div>
        <p style={{margin: 0, fontSize: '13px', color: '#555', lineHeight: '1.5'}}>
          <strong>No API key needed!</strong> Click the button above or use the "💬 ChatGPT" button in the sidebar header to open ChatGPT's web interface. 
          This allows you to use ChatGPT directly without setting up an API key. Perfect for users who prefer the official web interface.
        </p>
      </div>
      
      <div style={{marginBottom: '16px'}}>
        <label style={{display: 'block', marginBottom: '4px', fontWeight: 'bold'}}>OpenAI Key</label>
        <input 
          value={openai} 
          onChange={e=>setOpenai(e.target.value)} 
          type="password"
          style={{width:'100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px'}} 
          placeholder="sk-..."
        />
      </div>
      
      <div style={{marginBottom: '16px'}}>
        <label style={{display: 'block', marginBottom: '4px', fontWeight: 'bold'}}>HuggingFace Key</label>
        <input 
          value={hf} 
          onChange={e=>setHf(e.target.value)} 
          type="password"
          style={{width:'100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px'}} 
          placeholder="hf_..."
        />
      </div>
      
      <div style={{marginBottom: '16px'}}>
        <label style={{display: 'block', marginBottom: '4px', fontWeight: 'bold'}}>Gemini Key</label>
        <input 
          value={gemini} 
          onChange={e=>setGemini(e.target.value)} 
          type="password"
          style={{width:'100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px'}} 
          placeholder="AIza..."
        />
      </div>
      
      <div style={{marginBottom: '16px'}}>
        <label style={{display: 'block', marginBottom: '4px', fontWeight: 'bold'}}>AI Provider</label>
        <select 
          value={provider} 
          onChange={handleProviderChange} 
          style={{width:'100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px'}}
        >
          <option value='openai'>OpenAI</option>
          <option value='huggingface'>Hugging Face</option>
          <option value='gemini'>Gemini</option>
          <option value='custom'>Custom</option>
        </select>
      </div>
      
      {showModelSelect ? (
        <div style={{marginBottom: '16px'}}>
          <label style={{display: 'block', marginBottom: '4px', fontWeight: 'bold'}}>Model</label>
          <select 
            value={model} 
            onChange={(e)=> setModel(e.target.value)} 
            style={{width:'100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px'}}
            disabled={provider === 'gemini' && loadingGeminiModels}
          >
            {provider === 'gemini' && loadingGeminiModels ? (
              <option>Loading models...</option>
            ) : models.length === 0 ? (
              <option>No models available</option>
            ) : (
              models.map(m => (
                <option key={m.value} value={m.value} title={m.description || ''}>
                  {m.label}
                </option>
              ))
            )}
          </select>
        </div>
      ) : (
        <div style={{marginBottom: '16px'}}>
          <label style={{display: 'block', marginBottom: '4px', fontWeight: 'bold'}}>Custom Model Name</label>
          <input 
            value={model} 
            onChange={(e)=> setModel(e.target.value)}
            style={{width:'100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px'}}
            placeholder="Enter custom model name"
          />
        </div>
      )}
      
      {provider === 'custom' && (
        <div style={{marginBottom: '16px'}}>
          <label style={{display: 'block', marginBottom: '4px', fontWeight: 'bold'}}>Custom Endpoint</label>
          <input 
            value={customEndpoint} 
            onChange={e=>setCustomEndpoint(e.target.value)} 
            style={{width:'100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px'}} 
            placeholder="https://api.example.com/endpoint"
          />
        </div>
      )}
      
      <div style={{marginBottom: '16px', marginTop: '24px', paddingTop: '24px', borderTop: '2px solid #e5e7eb'}}>
        <label style={{display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '16px'}}>🎨 Chat Theme</label>
        <p style={{color: '#666', fontSize: '13px', marginBottom: '12px'}}>
          Choose a theme for the chat interface. Glassmorphism is the default.
        </p>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px'}}>
          {Object.entries(THEMES).map(([key, themeData]) => (
            <div
              key={key}
              onClick={() => setTheme(key)}
              style={{
                padding: '16px',
                borderRadius: '8px',
                border: `2px solid ${theme === key ? '#6366f1' : '#e5e7eb'}`,
                background: theme === key ? 'rgba(99, 102, 241, 0.1)' : '#f9fafb',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                if (theme !== key) {
                  e.currentTarget.style.background = '#f3f4f6'
                  e.currentTarget.style.borderColor = '#d1d5db'
                }
              }}
              onMouseLeave={(e) => {
                if (theme !== key) {
                  e.currentTarget.style.background = '#f9fafb'
                  e.currentTarget.style.borderColor = '#e5e7eb'
                }
              }}
            >
              {theme === key && (
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: '#6366f1',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px'
                }}>
                  ✓
                </div>
              )}
              <div style={{fontWeight: 'bold', marginBottom: '4px', color: theme === key ? '#6366f1' : '#111'}}>
                {themeData.name}
              </div>
              <div style={{fontSize: '12px', color: '#666', marginTop: '4px'}}>
                {themeData.description}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div style={{marginTop: '20px'}}>
        <button 
          onClick={save}
          style={{
            padding: '10px 20px',
            background: 'linear-gradient(90deg, #2dd4bf, #60a5fa)',
            color: '#07203a',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px'
          }}
        >
          Save Settings
        </button>
      </div>
    </div>
  )
}
