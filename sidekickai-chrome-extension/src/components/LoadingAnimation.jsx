import React from 'react'

/**
 * Loading animation component - animated dots
 */
export default function LoadingAnimation({ theme, size = 'medium' }) {
  const colors = theme?.colors || {}
  
  const sizeStyles = {
    small: { width: '6px', height: '6px', gap: '3px' },
    medium: { width: '8px', height: '8px', gap: '4px' },
    large: { width: '10px', height: '10px', gap: '5px' }
  }

  const dotSize = sizeStyles[size]

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: dotSize.gap,
      padding: '8px 0'
    }}>
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          style={{
            width: dotSize.width,
            height: dotSize.height,
            borderRadius: '50%',
            background: colors.text || '#e6eef6',
            opacity: 0.4,
            animation: 'typing 1.4s infinite ease-in-out',
            animationDelay: `${index * 0.2}s`
          }}
        />
      ))}
    </div>
  )
}

