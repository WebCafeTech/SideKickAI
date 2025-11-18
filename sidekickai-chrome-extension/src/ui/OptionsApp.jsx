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
      <h2>MysticKode SidePanel AI — Options</h2>
      <p style={{color: '#666', fontSize: '14px', marginBottom: '20px'}}>
        Configure your API keys and select the AI model to use for all chat operations.
      </p>
      

      {/* Gemini Setup Instructions */}
      <div style={{
        marginBottom: '24px',
        padding: '20px',
        background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(234, 179, 8, 0.1))',
        border: '2px solid rgba(251, 191, 36, 0.4)',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(251, 191, 36, 0.1)'
      }}>
        <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px'}}>
          <h3 style={{margin: 0, fontSize: '18px', color: '#111', fontWeight: 'bold'}}>✨ Gemini AI Setup Guide</h3>
          <span style={{
            padding: '4px 10px',
            background: 'rgba(34, 197, 94, 0.2)',
            color: '#16a34a',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 'bold'
          }}>
            ✓ WORKING
          </span>
        </div>
        
        <div style={{
          padding: '12px',
          background: 'rgba(34, 197, 94, 0.1)',
          borderRadius: '6px',
          marginBottom: '16px',
          border: '1px solid rgba(34, 197, 94, 0.3)'
        }}>
          <p style={{margin: 0, fontSize: '14px', color: '#166534', lineHeight: '1.6', fontWeight: '500'}}>
            🎉 <strong>Gemini models are currently working properly!</strong> Follow the steps below to get your API key and start using Gemini AI.
          </p>
        </div>

        <div style={{marginBottom: '16px'}}>
          <h4 style={{margin: '0 0 12px 0', fontSize: '15px', color: '#111', fontWeight: '600'}}>📋 Step-by-Step Instructions:</h4>
          <ol style={{margin: 0, paddingLeft: '20px', color: '#333', lineHeight: '1.8', fontSize: '14px'}}>
            <li style={{marginBottom: '10px'}}>
              <strong>Visit Google AI Studio:</strong>
              <br />
              <a 
                href="https://aistudio.google.com/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault()
                  if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
                    chrome.tabs.create({ url: 'https://aistudio.google.com/apikey' })
                  } else {
                    window.open('https://aistudio.google.com/apikey', '_blank', 'noopener,noreferrer')
                  }
                }}
                style={{
                  color: '#2563eb',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                https://aistudio.google.com/apikey
              </a>
            </li>
            <li style={{marginBottom: '10px'}}>
              <strong>Sign in with your Google account</strong> (if not already signed in)
            </li>
            <li style={{marginBottom: '10px'}}>
              <strong>Click "Create API Key"</strong> button
            </li>
            <li style={{marginBottom: '10px'}}>
              <strong>Select or create a Google Cloud project</strong> (you can use the default project)
            </li>
            <li style={{marginBottom: '10px'}}>
              <strong>Copy your API key</strong> - It will start with "AIza..." and look like: <code style={{
                background: 'rgba(0,0,0,0.05)',
                padding: '2px 6px',
                borderRadius: '3px',
                fontSize: '12px',
                fontFamily: 'monospace'
              }}>AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz</code>
            </li>
            <li style={{marginBottom: '10px'}}>
              <strong>Paste the API key</strong> in the "Gemini Key" field below
            </li>
            <li style={{marginBottom: '10px'}}>
              <strong>Select "Gemini" as your AI Provider</strong> from the dropdown
            </li>
            <li>
              <strong>Click "Save Settings"</strong> and you're ready to use Gemini AI!
            </li>
          </ol>
        </div>

        <div style={{
          padding: '12px',
          background: 'rgba(59, 130, 246, 0.1)',
          borderRadius: '6px',
          border: '1px solid rgba(59, 130, 246, 0.3)'
        }}>
          <p style={{margin: '0 0 8px 0', fontSize: '13px', color: '#1e40af', fontWeight: '600'}}>
            💡 <strong>Pro Tips:</strong>
          </p>
          <ul style={{margin: 0, paddingLeft: '20px', color: '#1e40af', lineHeight: '1.6', fontSize: '13px'}}>
            <li>Gemini API is <strong>free to use</strong> with generous rate limits</li>
            <li>Your API key is stored locally in your browser - it never leaves your device</li>
            <li>You can create multiple API keys for different projects</li>
            <li>Gemini models support both text and image analysis</li>
          </ul>
        </div>

        <div style={{marginTop: '16px', display: 'flex', gap: '8px'}}>
          <button
            onClick={() => {
              if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
                chrome.tabs.create({ url: 'https://aistudio.google.com/apikey' })
              } else {
                window.open('https://aistudio.google.com/apikey', '_blank', 'noopener,noreferrer')
              }
            }}
            style={{
              padding: '8px 16px',
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              color: '#111',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
              transition: 'all 0.2s',
              flex: 1
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.02)'
              e.target.style.boxShadow = '0 4px 12px rgba(251, 191, 36, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)'
              e.target.style.boxShadow = 'none'
            }}
          >
            🔑 Get Gemini API Key
          </button>
          <button
            onClick={() => {
              if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
                chrome.tabs.create({ url: 'https://ai.google.dev/docs' })
              } else {
                window.open('https://ai.google.dev/docs', '_blank', 'noopener,noreferrer')
              }
            }}
            style={{
              padding: '8px 16px',
              background: 'rgba(59, 130, 246, 0.1)',
              color: '#2563eb',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
              transition: 'all 0.2s',
              flex: 1
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(59, 130, 246, 0.2)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(59, 130, 246, 0.1)'
            }}
          >
            📚 View Docs
          </button>
        </div>
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
        <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px'}}>
          <label style={{fontWeight: 'bold', color: '#111'}}>Gemini Key</label>
          {gemini && (
            <span style={{
              padding: '2px 8px',
              background: 'rgba(34, 197, 94, 0.2)',
              color: '#16a34a',
              borderRadius: '10px',
              fontSize: '10px',
              fontWeight: 'bold'
            }}>
              ✓ Configured
            </span>
          )}
        </div>
        <input 
          value={gemini} 
          onChange={e=>setGemini(e.target.value)} 
          type="password"
          style={{
            width:'100%', 
            padding: '10px', 
            border: provider === 'gemini' ? '2px solid rgba(251, 191, 36, 0.5)' : '1px solid #ddd', 
            borderRadius: '6px',
            background: provider === 'gemini' ? 'rgba(251, 191, 36, 0.05)' : '#fff',
            transition: 'all 0.2s'
          }} 
          placeholder="AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz..."
        />
        {provider === 'gemini' && !gemini && (
          <p style={{
            margin: '6px 0 0 0',
            fontSize: '12px',
            color: '#f59e0b',
            fontStyle: 'italic'
          }}>
            💡 Paste your Gemini API key here (get it from the instructions above)
          </p>
        )}
        {provider === 'gemini' && gemini && (
          <p style={{
            margin: '6px 0 0 0',
            fontSize: '12px',
            color: '#16a34a',
            fontWeight: '500'
          }}>
            ✅ Gemini API key is configured! Don't forget to select "Gemini" as your AI Provider below.
          </p>
        )}
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
