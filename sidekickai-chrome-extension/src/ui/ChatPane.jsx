import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import MessageBubble from '../components/MessageBubble'
import { SendButton } from '../components/IconButton'
export default function ChatPane({settings, theme}) {
  const colors = theme?.colors || {}
  const [messages, setMessages] = useState([
    {role: 'assistant', text: '👋 Welcome to MysticKode SidePanel AI!\n\n**Transform your browsing into action.**\n\nI can help you with:\n• Reading content from the left side of the page\n• Analyzing screenshots\n• General questions and assistance\n\n💡 **Tip:** Don\'t have an API key? Click the "💬 ChatGPT" button in the header to use ChatGPT\'s web interface instead!\n\nTry clicking "Read Left" or "📷 Take Screenshot" buttons, or ask me anything!'}
  ])
  const [input, setInput] = useState('')
  const [pendingScreenshot, setPendingScreenshot] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const chatRef = useRef()
  const lastRequestTime = useRef(0)
  const messagesEndRef = useRef(null)
  
  // Note: Animations moved to styles.css for better performance
  
  // Apply custom scrollbar styles based on theme
  useEffect(() => {
    const styleId = 'chat-scrollbar-theme-style'
    let styleEl = document.getElementById(styleId)
    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = styleId
      document.head.appendChild(styleEl)
    }
    styleEl.textContent = `
      .chat::-webkit-scrollbar { width: 6px; }
      .chat::-webkit-scrollbar-track { background: ${colors.panel || 'rgba(255,255,255,0.02)'}; border-radius: 3px; }
      .chat::-webkit-scrollbar-thumb { background: ${colors.scrollbar || 'rgba(45,212,191,0.3)'}; border-radius: 3px; }
      .chat::-webkit-scrollbar-thumb:hover { background: ${colors.scrollbarHover || 'rgba(45,212,191,0.5)'}; }
    `
    return () => {
      // Cleanup on unmount
      if (styleEl && styleEl.parentNode) {
        styleEl.parentNode.removeChild(styleEl)
      }
    }
  }, [colors])
  
  // Optimized auto-scroll - only scroll when new messages are added
  useEffect(() => {
    if (chatRef.current && messages.length > 0) {
      // Use requestAnimationFrame for smooth, performant scrolling
      requestAnimationFrame(() => {
        if (chatRef.current) {
          chatRef.current.scrollTop = chatRef.current.scrollHeight
        }
      })
    }
  }, [messages.length]) // Only depend on message count, not the entire messages array
  useEffect(()=> {
    const handler = (ev) => {
      const m = ev.data
      if (!m || !m.type) return
      
      // Handle "Read Left" - send content to AI model
      if (m.type === 'leftText') {
        const content = m.text || '';
        const imageData = m.image || null;
        
        if (content.trim() || imageData) {
          // Show what was read with image thumbnail if available
          let previewText = '📖 Read left-side content';
          if (imageData) {
            previewText += ' (with screenshot)';
          }
          previewText += ':\n' + (content.slice(0, 500) + (content.length > 500 ? '...' : ''));
          addMessage({role:'system', text: previewText, image: imageData})
          
          // Create a prompt to analyze the content
          let prompt = '';
          if (imageData) {
            // If we have an image, ask AI to analyze both text and image
            prompt = `Please analyze the following content and screenshot from the left side of the page. Provide a helpful response, summary, or answer any questions found in it. The screenshot may contain images, charts, diagrams, or other visual content that is not in the text:\n\n${content.slice(0, 15000)}`;
          } else {
            prompt = `Please analyze the following content and provide a helpful response, summary, or answer any questions found in it:\n\n${content.slice(0, 15000)}`;
          }
          
          // Send to AI model with image data
          callModel(prompt, imageData).then(res => {
            if (res && res.text) {
              addMessage({role:'assistant', text: res.text})
            }
          })
        } else {
          addMessage({role:'assistant', text: 'No content found on the left side of the page. Please make sure there is visible text content.'})
        }
      }
      
      // Handle screenshot capture (for Answer/Describe)
      if (m.type === 'screenshotCaptured') {
        const imageData = m.image || null;
        if (imageData) {
          // Show screenshot thumbnail and confirmation
          addMessage({
            role:'system', 
            text:'📷 Full screen screenshot captured\n\nSending to AI for analysis...',
            image: imageData
          })
          
          // Create a prompt to analyze the full screenshot
          const prompt = `Please analyze this full screen screenshot of the webpage. Provide a detailed description, identify any text, images, charts, diagrams, questions, or other visual elements. Answer any questions you see, or provide a comprehensive summary of what's displayed in the image. Pay attention to all parts of the screen including the left and right sides. Negative: Don't describe about the right panel of sidekickAI plugin. You need to answer or describe the left panel only.`;
          
          // Send to AI model with image data
          callModel(prompt, imageData).then(res => {
            if (res && res.text) {
              addMessage({role:'assistant', text: res.text})
            }
          })
        } else {
          const errorMsg = m.error || 'Failed to capture screenshot';
          addMessage({role:'assistant', text: `❌ Error: ${errorMsg}`})
        }
      }
      
      // Handle screenshot added to input (for Take Screenshot)
      if (m.type === 'screenshotToInput') {
        const imageData = m.image || null;
        if (imageData) {
          setPendingScreenshot(imageData);
          // Screenshot preview will be shown in the input area
        } else {
          const errorMsg = m.error || 'Failed to capture screenshot';
          addMessage({role:'assistant', text: `❌ Error: ${errorMsg}`})
        }
      }
      
      // Handle quiz detection
      if (m.type === 'quizFound') {
        const q = m.quiz
        addMessage({role:'system', text:'📝 Quiz found: '+ q.question})
        if (q.options && q.options.length > 0) {
        addMessage({role:'system', text:'Options: '+ (q.options.join(' | ') || 'None')})
        }
        const prompt = q.options && q.options.length ? `Question: ${q.question}\nOptions:\n${q.options.map((o,i)=>`${i+1}. ${o}`).join('\n')}\nAnswer with the index and short reason.` : `Please answer: ${q.question}`
        callModel(prompt).then(res=> {
          if (res && res.text) {
            addMessage({role:'assistant', text: res.text})
            const m = res.text.match(/(\d+)/)
            if (m && q.options && q.options[parseInt(m[1],10)-1]) {
              const chosen = q.options[parseInt(m[1],10)-1]
              window.parent.postMessage({type:'highlight', payload: chosen}, '*')
            }
          }
        })
      }
    }
    window.addEventListener('message', handler)
    return ()=> window.removeEventListener('message', handler)
  },[])
  function addMessage(msg) {
    setMessages(prev=> [...prev, {...msg, id: msg.id || Date.now() + Math.random()}])
    // Scroll will be handled by useEffect when messages change
  }
  
  const handleResend = (messageIndex) => {
    const messageToResend = messages[messageIndex]
    if (!messageToResend || messageToResend.role !== 'user') return
    
    // Remove the old assistant response if it exists (next message)
    const newMessages = messages.slice(0, messageIndex + 1)
    setMessages(newMessages)
    
    // Resend the message
    callModel(messageToResend.text, messageToResend.image)
  }
  
  async function callModel(prompt, imageData = null) {
    // Throttle requests - prevent sending requests too quickly
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime.current;
    const minDelay = 1000; // Minimum 1 second between requests
    
    if (timeSinceLastRequest < minDelay && lastRequestTime.current > 0) {
      const waitTime = minDelay - timeSinceLastRequest;
      addMessage({role:'assistant', text: `⏳ Please wait ${Math.ceil(waitTime/1000)} second(s) before sending another request to avoid rate limits.`});
      return Promise.resolve(null);
    }
    
    if (isLoading) {
      addMessage({role:'assistant', text: '⏳ Please wait for the current request to complete.'});
      return Promise.resolve(null);
    }
    
    setIsLoading(true);
    lastRequestTime.current = now;
    
    // Show loading message with animation first
    const loadingId = Date.now();
    addMessage({role:'assistant', text: '', id: loadingId, isLoading: true})
    
    // Build conversation history BEFORE adding user message (to avoid async state issues)
    // Include all previous messages + current prompt
    const conversationHistory = [
      ...messages
        .filter(m => 
          (m.role === 'user' || m.role === 'assistant') && 
          !m.isLoading && 
          m.text && 
          m.text.trim() !== ''
        )
        .map(m => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.text
        })),
      // Add current user message
      {
        role: 'user',
        content: prompt
      }
    ];
    
    // Show user message with screenshot if available (after building history)
    if (imageData) {
      addMessage({role:'user', text: prompt, image: imageData})
    } else {
    addMessage({role:'user', text: prompt})
    }
    
    return new Promise((resolve) => {
      // Get current settings from storage to ensure we have the latest
      chrome.storage.local.get(['ai_settings'], (storageRes) => {
        const currentSettings = storageRes.ai_settings || settings;
        
        // Use default model if none specified
        const defaultModels = {
          openai: 'gpt-4o',
          huggingface: 'google/flan-t5-xxl',
          gemini: 'gemini-pro',
          custom: ''
        }
        
        const providerToUse = currentSettings.provider || 'openai';
        const modelToUse = currentSettings.model || defaultModels[providerToUse] || 'gpt-4o';
        
        console.log('[SidekickAI] Using provider:', providerToUse, 'model:', modelToUse);
        console.log('[SidekickAI] Conversation history length:', conversationHistory.length);
        
        // Send API call with conversation history
        chrome.runtime.sendMessage({
          type:'callAPI', 
          payload: {
            provider: providerToUse, 
            model: modelToUse, 
            input: {
              prompt: prompt,
              messages: conversationHistory
            },
            imageData: imageData
          }
        }, (res) => {
          setIsLoading(false);
          // Remove loading message
          setMessages(prev => prev.filter(m => m.id !== loadingId))
          
          if (!res || !res.ok) { 
            let errorMsg = res?.error || 'No response';
            // Make error messages more user-friendly
            if (errorMsg.toLowerCase().includes('quota') || errorMsg.toLowerCase().includes('billing') || errorMsg.toLowerCase().includes('insufficient')) {
              errorMsg = '⚠️ Insufficient Quota Error\n\n' +
                        'Your OpenAI account has exceeded its quota or has a billing issue.\n\n' +
                        'Please:\n' +
                        '1. Check your billing at https://platform.openai.com/account/billing\n' +
                        '2. Verify you have available credits\n' +
                        '3. Review your usage limits\n' +
                        '4. Update your payment method if needed\n\n' +
                        'Error details: ' + errorMsg;
            } else if (errorMsg.includes('Rate limit') || errorMsg.includes('429')) {
              errorMsg = '⚠️ Rate limit exceeded. Please wait a moment and try again. The request will be retried automatically.';
            } else if (errorMsg.includes('API key') || errorMsg.includes('401') || errorMsg.includes('Invalid') || 
                       errorMsg.includes('key not set') || errorMsg.includes('not set')) {
              const providerName = providerToUse === 'openai' ? 'OpenAI' : 
                                  providerToUse === 'gemini' ? 'Gemini' : 
                                  providerToUse === 'huggingface' ? 'Hugging Face' : 
                                  providerToUse || 'API';
              errorMsg = `🔑 ${providerName} API key error. Please check your ${providerName} API key in the settings.\n\n` +
                        `Click the ⚙️ Settings button in the header to configure your API keys.`;
            } else if (errorMsg.includes('402') || errorMsg.includes('403')) {
              errorMsg = '💳 Payment or permission error. Please check your OpenAI account billing and API access.';
            }
            // Remove loading message and add error message
            setMessages(prev => {
              const filtered = prev.filter(m => m.id !== loadingId)
              return [...filtered, {role:'assistant', text: '❌ Error: ' + errorMsg, id: Date.now()}]
            })
            resolve(null) 
          }
          else { 
            const text = res.result.text || (typeof res.result === 'string' ? res.result : JSON.stringify(res.result)); 
            // Remove loading message and add actual response
            setMessages(prev => {
              const filtered = prev.filter(m => m.id !== loadingId)
              return [...filtered, {role:'assistant', text, id: Date.now()}]
            })
            resolve({text, raw: res.result.raw}) 
          }
        });
      });
    })
  }
  const onSend = () => { 
    if ((!input.trim() && !pendingScreenshot) || isLoading) return;
    
    const messageText = input.trim() || 'Please analyze this screenshot';
    const screenshotToSend = pendingScreenshot;
    
    // Clear input and pending screenshot
    setInput('');
    setPendingScreenshot(null);
    
    // Send message with screenshot if available
    callModel(messageText, screenshotToSend);
  }
  
  const removePendingScreenshot = () => {
    setPendingScreenshot(null);
  }
  return (
    <div className='chat-wrapper' style={{ padding: '12px 16px' }}>
      <div 
        className='chat' 
        ref={chatRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          paddingRight: '6px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          scrollBehavior: 'smooth'
        }}
      >
        {messages.map((m,i)=> (
          <MessageBubble
            key={m.id || i}
            message={m}
            theme={theme}
            onResend={handleResend}
            messageIndex={i}
          />
        ))}
        <div ref={messagesEndRef} style={{height: '1px'}} />
      </div>
      <div 
        className='composer'
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          padding: '12px 16px',
          borderTop: `1px solid ${colors.panelBorder || 'rgba(255,255,255,0.03)'}`,
          background: colors.panel || 'rgba(255,255,255,0.02)',
          backdropFilter: colors.backdrop || 'blur(10px)',
          WebkitBackdropFilter: colors.backdrop || 'blur(10px)'
        }}
      >
        {/* Screenshot Preview */}
        {pendingScreenshot && (
          <div style={{
            position: 'relative',
            borderRadius: '8px',
            overflow: 'hidden',
            border: `1px solid ${colors.panelBorder || 'rgba(255,255,255,0.1)'}`,
            maxWidth: '100%',
            background: colors.panel || 'rgba(255,255,255,0.05)'
          }}>
            <img 
              src={`data:image/png;base64,${pendingScreenshot}`}
              alt="Screenshot preview"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '150px',
                objectFit: 'contain',
                display: 'block'
              }}
            />
            <button
              onClick={removePendingScreenshot}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: 'rgba(0,0,0,0.6)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
              title="Remove screenshot"
            >
              ×
            </button>
            <div style={{
              padding: '4px 8px',
              fontSize: '11px',
              color: colors.textSecondary || 'rgba(255,255,255,0.6)',
              background: 'rgba(0,0,0,0.3)',
              textAlign: 'center'
            }}>
              📷 Screenshot ready • Type a message and click Send
            </div>
          </div>
        )}
        
        {/* Input and Send Button Row */}
        <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
          <textarea 
            value={input} 
            onChange={(e)=> setInput(e.target.value)} 
            placeholder={isLoading ? 'Processing request...' : pendingScreenshot ? 'Type a message with the screenshot...' : 'Type a message...'}
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
                e.preventDefault();
                onSend();
              }
            }}
            style={{
              flex: 1,
              minHeight: '56px',
              resize: 'none',
              padding: '10px 12px',
              borderRadius: '10px',
              border: `1px solid ${colors.inputBorder || 'rgba(255,255,255,0.1)'}`,
              background: colors.input || 'rgba(255,255,255,0.05)',
              color: colors.text || '#e6eef6',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              fontSize: '14px',
              fontFamily: 'inherit'
            }}
          ></textarea>
          <SendButton
            theme={theme}
            onClick={onSend}
            disabled={!input.trim() && !pendingScreenshot}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}
