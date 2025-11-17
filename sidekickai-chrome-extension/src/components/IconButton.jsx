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
 * Send Button - Up arrow in circle
 */
export function SendButton({ theme, onClick, disabled, isLoading }) {
  const colors = theme?.colors || {}
  
  return (
    <IconButton
      theme={theme}
      icon={
        isLoading ? (
          <span style={{ fontSize: '16px' }}>⏳</span>
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
        transition: 'all 0.2s'
      }}
    />
  )
}

