// background.js for SidekickAI
const DEFAULT_SETTINGS = { 
  provider: 'openai', 
  model: 'gpt-4o', 
  keys: { openai:'', huggingface:'', gemini:'' } 
};
let settings = DEFAULT_SETTINGS;
chrome.runtime.onInstalled.addListener(()=> {
  chrome.storage.local.get(['ai_settings'], (res)=> {
    if (!res.ai_settings) chrome.storage.local.set({ai_settings: DEFAULT_SETTINGS});
    else settings = res.ai_settings;
  });
});

// Track which tabs have content script ready
const readyTabs = new Set();

// Listen for all messages (content script ready, settings, API calls)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Handle content script ready signal
  if (message.type === 'contentScriptReady' && sender.tab) {
    readyTabs.add(sender.tab.id);
    console.log('[SidekickAI] Content script ready for tab:', sender.tab.id);
    sendResponse({ok: true});
    return true;
  }
  
  // Handle settings requests
  if (message.type === 'getSettings') { 
    chrome.storage.local.get(['ai_settings'], (res)=> sendResponse(res.ai_settings || DEFAULT_SETTINGS)); 
    return true; 
  }
  
  // Handle settings save
  if (message.type === 'saveSettings') { 
    // Merge with existing settings to preserve keys and other properties
    chrome.storage.local.get(['ai_settings'], (res) => {
      const existing = res.ai_settings || DEFAULT_SETTINGS;
      settings = {
        ...existing,
        ...message.payload,
        // Ensure keys object is preserved
        keys: {
          ...(existing.keys || DEFAULT_SETTINGS.keys),
          ...(message.payload.keys || {})
        }
      };
      chrome.storage.local.set({ai_settings: settings}, ()=> sendResponse({ok:true})); 
    });
    return true; 
  }
  
  // Handle list Gemini models request
  if (message.type === 'listGeminiModels') {
    (async ()=> {
      try {
        // Get latest settings from storage
        const currentSettings = await new Promise((resolve) => {
          chrome.storage.local.get(['ai_settings'], (res) => {
            resolve(res.ai_settings || settings);
          });
        });
        const activeSettings = currentSettings || settings;
        
        const key = activeSettings.keys?.gemini || settings.keys?.gemini;
        if (!key) {
          sendResponse({ok: false, error: 'Gemini API key not set'});
          return;
        }
        
        // Try v1 first, then v1beta as fallback
        let res = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${encodeURIComponent(key)}`);
        if (!res.ok && res.status === 404) {
          console.log('[SidekickAI] v1 endpoint not available, trying v1beta...');
          res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`);
        }
        if (!res.ok) {
          const errorText = await res.text().catch(() => '');
          sendResponse({ok: false, error: `Failed to list models: ${res.status} - ${errorText}`});
          return;
        }
        const data = await res.json();
        const allModels = data.models || [];
        
        // Filter models that support generateContent method
        const supportedModels = allModels.filter(model => {
          const supportedMethods = model.supportedGenerationMethods || [];
          return supportedMethods.includes('generateContent');
        });
        
        console.log('[SidekickAI] Found', supportedModels.length, 'models supporting generateContent');
        sendResponse({ok: true, models: supportedModels});
      } catch (err) {
        console.error('[SidekickAI] Error listing Gemini models:', err);
        sendResponse({ok: false, error: err.message || String(err)});
      }
    })();
    return true;
  }
  
  // Handle screenshot capture request
  if (message.type === 'captureScreenshot') {
    (async () => {
      try {
        // Get the active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab || !tab.id) {
          sendResponse({ ok: false, error: 'No active tab found' });
          return;
        }
        
        // Capture visible tab - returns data URL
        const dataUrl = await chrome.tabs.captureVisibleTab(null, {
          format: 'png',
          quality: 90
        });
        
        // Send the full screenshot data URL to content script for cropping
        // The content script will handle cropping since it has DOM access
        sendResponse({ ok: true, screenshotDataUrl: dataUrl });
      } catch (err) {
        console.error('[SidekickAI] Error capturing screenshot:', err);
        sendResponse({ ok: false, error: err.message || String(err) });
      }
    })();
    return true;
  }
  
  // Handle API calls
  if (message.type === 'callAPI') {
    (async ()=> {
      try {
        const result = await callProviderAPI(message.payload);
        sendResponse({ok:true, result});
      } catch (err) {
        sendResponse({ok:false, error: err.message || String(err)});
      }
    })();
    return true;
  }
});

// Handle extension icon click - inject content script and toggle sidebar
chrome.action.onClicked.addListener(async (tab) => {
  console.log('[SidekickAI] Extension icon clicked on tab:', tab.id, tab.url);
  
  // Don't try to inject on chrome:// or chrome-extension:// pages
  if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://'))) {
    console.log('[SidekickAI] Cannot inject on Chrome internal pages');
    chrome.action.setBadgeText({text: '⚠️', tabId: tab.id});
    setTimeout(() => chrome.action.setBadgeText({text: '', tabId: tab.id}), 2000);
    return;
  }
  
  // Check if content script is already ready
  if (readyTabs.has(tab.id)) {
    console.log('[SidekickAI] Content script already ready, toggling...');
    chrome.tabs.sendMessage(tab.id, 'toggleSidebar', (response) => {
      if (chrome.runtime.lastError) {
        console.error('[SidekickAI] Error sending toggle:', chrome.runtime.lastError.message);
        readyTabs.delete(tab.id); // Remove from ready set, will re-inject
        injectAndToggle(tab);
      } else {
        console.log('[SidekickAI] Toggle successful');
      }
    });
    return;
  }
  
  // Inject and toggle
  await injectAndToggle(tab);
});

async function injectAndToggle(tab) {
  try {
    console.log('[SidekickAI] Injecting content script...');
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['contentScript.js']
    });
    console.log('[SidekickAI] Content script injected, waiting for ready signal...');
    
    // Wait for content script to signal it's ready (max 2 seconds)
    let attempts = 0;
    const maxAttempts = 20;
    const checkReady = setInterval(() => {
      attempts++;
      if (readyTabs.has(tab.id)) {
        clearInterval(checkReady);
        console.log('[SidekickAI] Content script ready, toggling sidebar...');
        chrome.tabs.sendMessage(tab.id, 'toggleSidebar', (response) => {
          if (chrome.runtime.lastError) {
            console.error('[SidekickAI] Error toggling:', chrome.runtime.lastError.message);
          } else {
            console.log('[SidekickAI] Sidebar toggled successfully');
          }
        });
      } else if (attempts >= maxAttempts) {
        clearInterval(checkReady);
        console.error('[SidekickAI] Content script did not become ready in time');
        // Try sending message anyway
        chrome.tabs.sendMessage(tab.id, 'toggleSidebar', (response) => {
          if (chrome.runtime.lastError) {
            console.error('[SidekickAI] Final attempt failed:', chrome.runtime.lastError.message);
          }
        });
      }
    }, 100);
  } catch (err) {
    console.error('[SidekickAI] Error injecting content script:', err);
    chrome.action.setBadgeText({text: '❌', tabId: tab.id});
    setTimeout(() => chrome.action.setBadgeText({text: '', tabId: tab.id}), 2000);
  }
}

// Clean up when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  readyTabs.delete(tabId);
});

// Helper function for retry with exponential backoff
async function fetchWithRetry(url, options, maxRetries = 3) {
  let lastError;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const res = await fetch(url, options);
      
      // Handle rate limiting (429)
      if (res.status === 429) {
        const retryAfter = res.headers.get('Retry-After');
        let waitTime = 1000 * Math.pow(2, attempt); // Exponential backoff: 1s, 2s, 4s
        
        // Use Retry-After header if available
        if (retryAfter) {
          waitTime = parseInt(retryAfter) * 1000;
        }
        
        if (attempt < maxRetries - 1) {
          console.log(`[SidekickAI] Rate limited (429), retrying after ${waitTime}ms (attempt ${attempt + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        } else {
          throw new Error(`Rate limit exceeded. Please wait a moment and try again. ${retryAfter ? `Retry after ${retryAfter} seconds.` : ''}`);
        }
      }
      
      if (!res.ok) {
        const errorText = await res.text().catch(() => '');
        let errorMsg = `OpenAI error ${res.status}`;
        
        // Parse error response for detailed messages
        let errorData = null;
        if (errorText) {
          try {
            errorData = JSON.parse(errorText);
            if (errorData.error?.message) {
              errorMsg = errorData.error.message;
            }
          } catch (e) {}
        }
        
        // Handle specific error codes
        if (res.status === 401) {
          errorMsg = 'Invalid API key. Please check your OpenAI API key in settings.';
        } else if (res.status === 429) {
          errorMsg = 'Rate limit exceeded. Please wait a moment and try again.';
        } else if (res.status === 402 || res.status === 403) {
          // 402 Payment Required, 403 Forbidden (often quota-related)
          if (errorData?.error?.code === 'insufficient_quota' || 
              errorMsg.toLowerCase().includes('quota') ||
              errorMsg.toLowerCase().includes('billing') ||
              errorMsg.toLowerCase().includes('payment')) {
            errorMsg = '⚠️ Insufficient quota or billing issue. Please check your OpenAI account:\n\n' +
                      '• Verify your billing information at https://platform.openai.com/account/billing\n' +
                      '• Check your usage limits and current plan\n' +
                      '• Ensure you have available credits\n' +
                      '• Review error details: ' + (errorData?.error?.message || errorMsg);
          } else {
            errorMsg = 'Payment or permission error. Please check your OpenAI account billing and API access.';
          }
        } else if (res.status === 500) {
          errorMsg = 'OpenAI server error. Please try again later.';
        } else if (res.status === 503) {
          errorMsg = 'OpenAI service unavailable. Please try again later.';
        }
        
        throw new Error(errorMsg);
      }
      
      const data = await res.json();
      return { res, data };
    } catch (error) {
      lastError = error;
      // Don't retry on non-429 errors (except network errors)
      if (error.message && !error.message.includes('Rate limit') && !error.message.includes('fetch')) {
        throw error;
      }
      // For network errors, retry with exponential backoff
      if (attempt < maxRetries - 1 && error.message.includes('fetch')) {
        const waitTime = 1000 * Math.pow(2, attempt);
        console.log(`[SidekickAI] Network error, retrying after ${waitTime}ms (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  throw lastError || new Error('Request failed after retries');
}

// Default models for each provider
const DEFAULT_MODELS = {
  openai: 'gpt-4o',
  huggingface: 'google/flan-t5-xxl',
  gemini: 'gemini-pro',
  custom: ''
};

async function callProviderAPI({provider, model, input, imageData}) {
  // Ensure we have the latest settings from storage
  const currentSettings = await new Promise((resolve) => {
    chrome.storage.local.get(['ai_settings'], (res) => {
      resolve(res.ai_settings || settings);
    });
  });
  const activeSettings = currentSettings || settings;
  
  // Debug logging
  console.log('[SidekickAI] callProviderAPI - provider:', provider);
  console.log('[SidekickAI] callProviderAPI - activeSettings.keys:', activeSettings.keys);
  console.log('[SidekickAI] callProviderAPI - has image:', !!imageData);
  
  if (provider === 'openai') {
    const key = activeSettings.keys?.openai || settings.keys?.openai;
    console.log('[SidekickAI] OpenAI key present:', !!key);
    if (!key) throw new Error('OpenAI key not set');
    
    // Use default model if none specified
    const modelToUse = model || DEFAULT_MODELS.openai;
    
    try {
      // Use conversation history if available, otherwise use single message
      const messages = input.messages || [{role:'user', content: input.prompt}];
      
      console.log('[SidekickAI] OpenAI - Sending', messages.length, 'messages in conversation');
      
      const { res, data } = await fetchWithRetry('https://api.openai.com/v1/chat/completions', {
        method:'POST', 
        headers:{
          'Content-Type':'application/json',
          'Authorization':`Bearer ${key}`
        },
        body: JSON.stringify({ 
          model: modelToUse, 
          messages: messages
        })
      });
      
    const text = data.choices?.[0]?.message?.content ?? data.choices?.[0]?.text ?? JSON.stringify(data);
    return {text, raw: data};
    } catch (error) {
      throw error; // Re-throw with better error message
    }
  }
  if (provider === 'huggingface') {
    const key = activeSettings.keys?.huggingface || settings.keys?.huggingface;
    if (!key) throw new Error('HF key not set');
    const modelToUse = model || DEFAULT_MODELS.huggingface;
    
    // Hugging Face models typically don't support conversation history well
    // So we'll build a context string from the conversation history
    let promptText = '';
    if (input.messages && input.messages.length > 1) {
      // Build context from conversation history
      const contextParts = input.messages.map(msg => {
        const role = msg.role === 'user' ? 'User' : 'Assistant';
        return `${role}: ${msg.content}`;
      });
      promptText = contextParts.join('\n\n');
    } else {
      promptText = input.prompt || input.messages?.slice(-1)?.[0]?.content || '';
    }
    
    console.log('[SidekickAI] Hugging Face - Sending conversation context');
    
    const res = await fetch(`https://api-inference.huggingface.co/models/${modelToUse}`, {
      method:'POST', 
      headers:{
        'Authorization':`Bearer ${key}`,
        'Content-Type':'application/json'
      },
      body: JSON.stringify({ inputs: promptText })
    });
    if (!res.ok) throw new Error('HF error '+res.status);
    const data = await res.json();
    const text = Array.isArray(data)? (data[0].generated_text || JSON.stringify(data)) : (data.generated_text || JSON.stringify(data));
    return {text, raw: data};
  }
  if (provider === 'gemini') {
    const key = activeSettings.keys?.gemini || settings.keys?.gemini;
    console.log('[SidekickAI] Gemini key present:', !!key);
    if (!key) {
      console.error('[SidekickAI] Gemini key missing! activeSettings:', activeSettings);
      throw new Error('Gemini key not set');
    }
    // Normalize model name (remove 'models/' prefix if present)
    let modelToUse = model || DEFAULT_MODELS.gemini;
    if (modelToUse.startsWith('models/')) {
      modelToUse = modelToUse.replace('models/', '');
    }
    
    // Build conversation history for Gemini
    // Gemini uses a different format: array of contents, each with role and parts
    let contents = [];
    
    if (input.messages && input.messages.length > 0) {
      // Convert messages to Gemini format
      // Gemini uses 'user' and 'model' roles (not 'assistant')
      for (let i = 0; i < input.messages.length; i++) {
        const msg = input.messages[i];
        const role = msg.role === 'assistant' ? 'model' : 'user';
        
        // Build parts array for this message
        const parts = [];
        
        // Add text content
        if (msg.content) {
          parts.push({ text: msg.content });
        }
        
        // Add image if this is the last user message and imageData is provided
        if (i === input.messages.length - 1 && msg.role === 'user' && imageData) {
          parts.push({
            inline_data: {
              mime_type: 'image/png',
              data: imageData
            }
          });
          console.log('[SidekickAI] Including image in Gemini request');
        }
        
        if (parts.length > 0) {
          contents.push({
            role: role,
            parts: parts
          });
        }
      }
    } else {
      // Fallback to single message
      const promptText = input.prompt || '';
      const parts = [{ text: promptText }];
      
      // Add image if provided
      if (imageData) {
        parts.push({
          inline_data: {
            mime_type: 'image/png',
            data: imageData
          }
        });
        console.log('[SidekickAI] Including image in Gemini request');
      }
      
      contents.push({
        role: 'user',
        parts: parts
      });
    }
    
    console.log('[SidekickAI] Gemini - Sending', contents.length, 'messages in conversation');
    
    // Request body format per official docs: https://ai.google.dev/api/generate-content
    const requestBody = {
      contents: contents
    };
    
    // Try v1 (stable) first, then fallback to v1beta if needed
    let endpoint = `https://generativelanguage.googleapis.com/v1/models/${modelToUse}:generateContent?key=${encodeURIComponent(key)}`;
    let res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
    
    // If 404 with v1, try v1beta as fallback
    if (!res.ok && res.status === 404) {
      console.log('[SidekickAI] Model not found in v1, trying v1beta...');
      endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelToUse}:generateContent?key=${encodeURIComponent(key)}`;
      res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
    }
    
    if (!res.ok) {
      const errorText = await res.text().catch(() => '');
      let errorData = null;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {}
      
      let errorMsg = errorData?.error?.message || `Gemini error ${res.status}`;
      
      // Handle 404 - model not found
      if (res.status === 404 || errorData?.error?.code === 404) {
        errorMsg = `Model "${modelToUse}" not found or not supported.\n\n` +
                  `Please try:\n` +
                  `• Use "gemini-pro" (most compatible)\n` +
                  `• Use "gemini-1.5-flash" (faster)\n` +
                  `• Check available models: https://ai.google.dev/api/models\n` +
                  `• List models: GET https://generativelanguage.googleapis.com/v1/models?key=YOUR_KEY\n\n` +
                  `Original error: ${errorData?.error?.message || errorMsg}`;
      } else if (res.status === 400) {
        errorMsg = `Bad request. ${errorData?.error?.message || errorMsg}\n\n` +
                  `Please check:\n` +
                  `• Request format matches API documentation\n` +
                  `• Model name is correct\n` +
                  `• API documentation: https://ai.google.dev/api/generate-content`;
      } else if (res.status === 401 || res.status === 403) {
        errorMsg = `Authentication error. Please verify your Gemini API key is correct and has proper permissions.`;
      }
      
      throw new Error(errorMsg);
    }
    
    const data = await res.json();
    
    // Extract text from response - format per official docs
    // Response structure: { candidates: [{ content: { parts: [{ text: "..." }] } }] }
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      // Fallback parsing
      text = data.candidates?.[0]?.content?.text ||
             data.candidates?.[0]?.output ||
             JSON.stringify(data);
    }
    
    return { text, raw: data };
  }
  if (provider === 'custom') {
    const endpoint = activeSettings.customEndpoint || settings.customEndpoint;
    if (!endpoint) throw new Error('No custom endpoint');
    const res = await fetch(endpoint, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({model, input})});
    if (!res.ok) throw new Error('Custom endpoint error '+res.status);
    return await res.json();
  }
  throw new Error('Unsupported provider');
}
