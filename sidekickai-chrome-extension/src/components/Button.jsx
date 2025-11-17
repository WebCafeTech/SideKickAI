import React from 'react'

/**
 * Reusable Button component with theme support
 */
export default function Button({
  children,
  onClick,
  disabled = false,
  variant = 'default', // 'default', 'primary', 'secondary', 'icon'
  size = 'medium', // 'small', 'medium', 'large'
  title,
  style = {},
  className = '',
  ...props
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={className}
      style={{
        ...getButtonStyles(variant, size),
        ...style,
        ...(disabled && { opacity: 0.5, cursor: 'not-allowed' })
      }}
      onMouseEnter={(e) => {
        if (!disabled && variant !== 'icon') {
          e.target.style.transform = 'scale(1.02)'
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && variant !== 'icon') {
          e.target.style.transform = 'scale(1)'
        }
      }}
      {...props}
    >
      {children}
    </button>
  )
}

/**
 * Get button styles based on variant and size
 */
function getButtonStyles(variant, size) {
  const baseStyles = {
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }

  const sizeStyles = {
    small: {
      padding: '4px 8px',
      fontSize: '11px',
      borderRadius: '4px'
    },
    medium: {
      padding: '6px 12px',
      fontSize: '12px',
      borderRadius: '6px'
    },
    large: {
      padding: '8px 16px',
      fontSize: '14px',
      borderRadius: '8px'
    }
  }

  return {
    ...baseStyles,
    ...sizeStyles[size]
  }
}

/**
 * Themed Button - applies theme colors
 */
export function ThemedButton({ theme, children, onClick, disabled, variant = 'default', size = 'medium', title, style = {}, ...props }) {
  const colors = theme?.colors || {}
  
  const variantStyles = {
    default: {
      background: colors.button || 'linear-gradient(90deg, rgba(45,212,191,0.2), rgba(96,165,250,0.2))',
      border: `1px solid ${colors.accentBorder || 'rgba(45,212,191,0.3)'}`,
      color: colors.text || '#e6eef6',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)'
    },
    primary: {
      background: colors.button || 'linear-gradient(90deg, rgba(45,212,191,0.3), rgba(96,165,250,0.3))',
      border: `1px solid ${colors.accentBorder || 'rgba(45,212,191,0.5)'}`,
      color: colors.text || '#e6eef6',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)'
    },
    secondary: {
      background: colors.panel || 'rgba(255,255,255,0.05)',
      border: `1px solid ${colors.panelBorder || 'rgba(255,255,255,0.1)'}`,
      color: colors.text || '#e6eef6',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)'
    },
    icon: {
      background: 'transparent',
      border: 'none',
      color: colors.text || '#e6eef6',
      padding: '4px',
      borderRadius: '50%',
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }

  const hoverStyles = {
    default: colors.buttonHover || 'linear-gradient(90deg, rgba(45,212,191,0.3), rgba(96,165,250,0.3))',
    primary: colors.buttonHover || 'linear-gradient(90deg, rgba(45,212,191,0.4), rgba(96,165,250,0.4))',
    secondary: colors.buttonHover || 'rgba(255,255,255,0.1)',
    icon: 'rgba(255,255,255,0.1)'
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        ...getButtonStyles(variant, size),
        ...variantStyles[variant],
        ...style,
        ...(disabled && { opacity: 0.5, cursor: 'not-allowed' })
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.target.style.background = hoverStyles[variant]
          if (variant !== 'icon') {
            e.target.style.transform = 'scale(1.02)'
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.target.style.background = variantStyles[variant].background
          if (variant !== 'icon') {
            e.target.style.transform = 'scale(1)'
          }
        }
      }}
      {...props}
    >
      {children}
    </button>
  )
}

