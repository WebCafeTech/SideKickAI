import React from 'react'
import { ThemedButton } from './Button'
import { UpArrowIcon } from './Icons'

/**
 * Icon Button component - circular button with icon
 */
export default function IconButton({ theme, icon, onClick, disabled, title, size = 'medium', style = {} }) {
  const colors = theme?.colors || {}
  
  const sizeStyles = {
    small: { width: '28px', height: '28px', fontSize: '14px' },
    medium: { width: '40px', height: '40px', fontSize: '18px' },
    large: { width: '56px', height: '56px', fontSize: '24px' }
  }

  return (
    <ThemedButton
      theme={theme}
      variant="icon"
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        ...sizeStyles[size],
        background: disabled 
          ? colors.panel || 'rgba(255,255,255,0.05)'
          : colors.button || 'linear-gradient(90deg, rgba(45,212,191,0.3), rgba(96,165,250,0.3))',
        border: `1px solid ${colors.accentBorder || 'rgba(45,212,191,0.3)'}`,
        color: colors.text || '#e6eef6',
        ...style
      }}
    >
      {icon}
    </ThemedButton>
  )
}

/**
 * Send Button - Up arrow in circle with loading animation
 */
export function SendButton({ theme, onClick, disabled, isLoading }) {
  const colors = theme?.colors || {}
  
  // Loading spinner component
  const LoadingSpinner = () => (
    <div style={{
      width: '20px',
      height: '20px',
      border: `2px solid ${colors.textSecondary || 'rgba(255,255,255,0.3)'}`,
      borderTop: `2px solid ${colors.text || '#e6eef6'}`,
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
      display: 'inline-block'
    }} />
  )
  
  return (
    <>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
      <IconButton
        theme={theme}
        icon={
          isLoading ? (
            <LoadingSpinner />
          ) : (
            <UpArrowIcon size={20} color="currentColor" />
          )
        }
        onClick={onClick}
        disabled={disabled || isLoading}
        title={isLoading ? 'Sending...' : 'Send message'}
        size="large"
        style={{
          borderRadius: '50%',
          background: disabled || isLoading
            ? colors.panel || 'rgba(255,255,255,0.05)'
            : colors.button || 'linear-gradient(135deg, rgba(45,212,191,0.4), rgba(96,165,250,0.4))',
          border: `2px solid ${colors.accentBorder || 'rgba(45,212,191,0.5)'}`,
          boxShadow: disabled || isLoading
            ? 'none'
            : `0 2px 8px ${colors.accentBorder || 'rgba(45,212,191,0.3)'}`,
          transition: 'all 0.2s',
          animation: isLoading ? 'pulse 2s ease-in-out infinite' : 'none',
          cursor: disabled || isLoading ? 'not-allowed' : 'pointer'
        }}
      />
    </>
  )
}

