import React from 'react'
import { ThemedButton } from '../components/Button'

export default function Controls({ theme }) {
  const colors = theme?.colors || {}
  
  // Handle "Answer/Describe Screenshot" - captures and immediately sends to AI
  const handleAnswerScreenshot = () => {
    chrome.runtime.sendMessage({
      type: 'captureScreenshot',
      includeImage: true
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('[SidekickAI] Error capturing screenshot:', chrome.runtime.lastError);
        window.parent.postMessage({
          type: 'screenshotCaptured',
          image: null,
          error: chrome.runtime.lastError.message
        }, '*');
      } else if (response?.ok && response?.screenshotDataUrl) {
        window.parent.postMessage({
          type: 'cropAndSendScreenshot',
          screenshotDataUrl: response.screenshotDataUrl
        }, '*');
      } else {
        window.parent.postMessage({
          type: 'screenshotCaptured',
          image: null,
          error: 'Failed to capture screenshot'
        }, '*');
      }
    });
  }
  
  // Handle "Take Screenshot" - captures and adds to chat input
  const handleTakeScreenshot = () => {
    chrome.runtime.sendMessage({
      type: 'captureScreenshot',
      includeImage: true
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('[SidekickAI] Error capturing screenshot:', chrome.runtime.lastError);
        window.parent.postMessage({
          type: 'screenshotToInput',
          image: null,
          error: chrome.runtime.lastError.message
        }, '*');
      } else if (response?.ok && response?.screenshotDataUrl) {
        // Send to content script for cropping, then to chat input
        window.parent.postMessage({
          type: 'cropAndAddToInput',
          screenshotDataUrl: response.screenshotDataUrl
        }, '*');
      } else {
        window.parent.postMessage({
          type: 'screenshotToInput',
          image: null,
          error: 'Failed to capture screenshot'
        }, '*');
      }
    });
  }

  return (
    <div 
      className='controls' 
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '6px', 
        padding: '10px 12px',
        background: colors.panel || 'rgba(255,255,255,0.05)',
        backdropFilter: colors.backdrop || 'blur(10px)',
        WebkitBackdropFilter: colors.backdrop || 'blur(10px)',
        borderBottom: `1px solid ${colors.panelBorder || 'rgba(255,255,255,0.1)'}`
      }}
    >
      <ThemedButton
        theme={theme}
        variant="default"
        size="small"
        onClick={()=> window.parent.postMessage({type:'readLeft'}, '*')}
        style={{ width: '100%' }}
      >
        Read Left
      </ThemedButton>
      <ThemedButton
        theme={theme}
        variant="default"
        size="small"
        onClick={handleTakeScreenshot}
        style={{ width: '100%' }}
      >
        📷 Take Screenshot
      </ThemedButton>
      <ThemedButton
        theme={theme}
        variant="default"
        size="small"
        onClick={handleAnswerScreenshot}
        style={{ width: '100%' }}
      >
        🔍 Describe
      </ThemedButton>
      <ThemedButton
        theme={theme}
        variant="default"
        size="small"
        onClick={()=> window.parent.postMessage({type:'findQuiz'}, '*')}
        style={{ width: '100%' }}
      >
        Answer Quiz
      </ThemedButton>
    </div>
  )
}
