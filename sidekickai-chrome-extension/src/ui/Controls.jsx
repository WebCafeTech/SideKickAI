import React from 'react'

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
      <button 
        onClick={()=> window.parent.postMessage({type:'readLeft'}, '*')}
        style={{
          background: colors.button || 'linear-gradient(90deg, rgba(45,212,191,0.2), rgba(96,165,250,0.2))',
          border: `1px solid ${colors.accentBorder || 'rgba(45,212,191,0.3)'}`,
          color: colors.text || '#e6eef6',
          padding: '6px 8px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '12px',
          transition: 'all 0.2s',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = colors.buttonHover || 'linear-gradient(90deg, rgba(45,212,191,0.3), rgba(96,165,250,0.3))'
          e.target.style.transform = 'scale(1.02)'
        }}
        onMouseLeave={(e) => {
          e.target.style.background = colors.button || 'linear-gradient(90deg, rgba(45,212,191,0.2), rgba(96,165,250,0.2))'
          e.target.style.transform = 'scale(1)'
        }}
      >
        Read Left
      </button>
      <button 
        onClick={handleTakeScreenshot}
        style={{
          background: colors.button || 'linear-gradient(90deg, rgba(45,212,191,0.2), rgba(96,165,250,0.2))',
          border: `1px solid ${colors.accentBorder || 'rgba(45,212,191,0.3)'}`,
          color: colors.text || '#e6eef6',
          padding: '6px 8px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '12px',
          transition: 'all 0.2s',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = colors.buttonHover || 'linear-gradient(90deg, rgba(45,212,191,0.3), rgba(96,165,250,0.3))'
          e.target.style.transform = 'scale(1.02)'
        }}
        onMouseLeave={(e) => {
          e.target.style.background = colors.button || 'linear-gradient(90deg, rgba(45,212,191,0.2), rgba(96,165,250,0.2))'
          e.target.style.transform = 'scale(1)'
        }}
      >
        📷 Take Screenshot
      </button>
      <button 
        onClick={handleAnswerScreenshot}
        style={{
          background: colors.button || 'linear-gradient(90deg, rgba(45,212,191,0.2), rgba(96,165,250,0.2))',
          border: `1px solid ${colors.accentBorder || 'rgba(45,212,191,0.3)'}`,
          color: colors.text || '#e6eef6',
          padding: '6px 8px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '12px',
          transition: 'all 0.2s',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = colors.buttonHover || 'linear-gradient(90deg, rgba(45,212,191,0.3), rgba(96,165,250,0.3))'
          e.target.style.transform = 'scale(1.02)'
        }}
        onMouseLeave={(e) => {
          e.target.style.background = colors.button || 'linear-gradient(90deg, rgba(45,212,191,0.2), rgba(96,165,250,0.2))'
          e.target.style.transform = 'scale(1)'
        }}
      >
        🔍 Describe
      </button>
      <button 
        onClick={()=> window.parent.postMessage({type:'findQuiz'}, '*')}
        style={{
          background: colors.button || 'linear-gradient(90deg, rgba(45,212,191,0.2), rgba(96,165,250,0.2))',
          border: `1px solid ${colors.accentBorder || 'rgba(45,212,191,0.3)'}`,
          color: colors.text || '#e6eef6',
          padding: '6px 8px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '12px',
          transition: 'all 0.2s',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = colors.buttonHover || 'linear-gradient(90deg, rgba(45,212,191,0.3), rgba(96,165,250,0.3))'
          e.target.style.transform = 'scale(1.02)'
        }}
        onMouseLeave={(e) => {
          e.target.style.background = colors.button || 'linear-gradient(90deg, rgba(45,212,191,0.2), rgba(96,165,250,0.2))'
          e.target.style.transform = 'scale(1)'
        }}
      >
        Answer Quiz
      </button>
    </div>
  )
}
