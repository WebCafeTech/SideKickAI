import React from 'react'
import { formatMessage } from '../utils/formatMessage.jsx'
import LoadingAnimation from './LoadingAnimation'

/**
 * Message Bubble component for chat messages
 */
export default function MessageBubble({ message, theme, onResend, messageIndex }) {
  const colors = theme?.colors || {}
  const isUser = message.role === 'user'
  const isSystem = message.role === 'system'
  
  return (
    <div
      className="message-enter"
      style={{
        padding: '12px 14px',
        borderRadius: '12px',
        maxWidth: '85%',
        boxShadow: colors.panelShadow || '0 2px 10px rgba(2,6,23,0.4)',
        transition: 'all 0.2s ease',
        backdropFilter: colors.backdrop || 'blur(10px)',
        WebkitBackdropFilter: colors.backdrop || 'blur(10px)',
        position: 'relative',
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        ...(isUser ? {
          background: colors.messageUser || 'linear-gradient(135deg, rgba(45,212,191,0.15), rgba(96,165,250,0.1))',
          border: `1px solid ${colors.accentBorder || 'rgba(45,212,191,0.2)'}`
        } : {
          background: colors.messageAssistant || 'rgba(255,255,255,0.03)',
          border: `1px solid ${colors.panelBorder || 'rgba(255,255,255,0.04)'}`
        })
      }}
    >
      {/* Resend button for user messages */}
      {isUser && !message.isLoading && onResend && (
        <button
          onClick={() => onResend(messageIndex)}
          title="Resend message"
          style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            background: 'rgba(0,0,0,0.3)',
            border: 'none',
            borderRadius: '4px',
            color: colors.text || '#e6eef6',
            cursor: 'pointer',
            padding: '4px 6px',
            fontSize: '10px',
            opacity: 0.6,
            transition: 'opacity 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '2px'
          }}
          onMouseEnter={(e) => {
            e.target.style.opacity = '1'
            e.target.style.background = 'rgba(0,0,0,0.5)'
          }}
          onMouseLeave={(e) => {
            e.target.style.opacity = '0.6'
            e.target.style.background = 'rgba(0,0,0,0.3)'
          }}
        >
          ↻ Resend
        </button>
      )}

      {/* Screenshot preview */}
      {message.image && (
        <div style={{
          marginBottom: '8px',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.1)',
          maxWidth: '100%'
        }}>
          <img
            src={`data:image/png;base64,${message.image}`}
            alt="Screenshot"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '300px',
              objectFit: 'contain',
              display: 'block',
              cursor: 'pointer'
            }}
            onClick={() => {
              const newWindow = window.open();
              if (newWindow) {
                newWindow.document.write(`
                  <html>
                    <head><title>Screenshot</title></head>
                    <body style="margin:0; padding:20px; background:#000; display:flex; justify-content:center; align-items:center; min-height:100vh;">
                      <img src="data:image/png;base64,${message.image}" style="max-width:100%; max-height:100vh; border:1px solid #333;" />
                    </body>
                  </html>
                `);
              }
            }}
            title="Click to view full size"
          />
          <div style={{
            padding: '4px 8px',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.6)',
            background: 'rgba(0,0,0,0.3)',
            textAlign: 'center'
          }}>
            📷 Screenshot • Click to view full size
          </div>
        </div>
      )}

      {/* Message content */}
      {message.isLoading ? (
        <LoadingAnimation theme={theme} />
      ) : (
        <div style={{
          whiteSpace: 'pre-wrap',
          margin: 0,
          wordBreak: 'break-word',
          lineHeight: '1.6',
          color: colors.text || '#e6eef6',
          paddingRight: isUser ? '50px' : '0'
        }}>
          {formatMessage(message.text)}
        </div>
      )}
    </div>
  )
}

