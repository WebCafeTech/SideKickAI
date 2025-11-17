/**
 * Theme system for SidekickAI
 * Provides multiple modern, advanced UI themes
 */

export const THEMES = {
  glassmorphism: {
    name: 'Glassmorphism',
    description: 'Frosted glass effect with blur and transparency',
    colors: {
      background: 'linear-gradient(135deg, rgba(15, 23, 36, 0.9), rgba(8, 18, 38, 0.95))',
      panel: 'rgba(255, 255, 255, 0.05)',
      panelBorder: 'rgba(255, 255, 255, 0.1)',
      panelShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      backdrop: 'blur(10px)',
      text: '#e6eef6',
      textSecondary: 'rgba(230, 238, 246, 0.7)',
      accent: 'rgba(45, 212, 191, 0.3)',
      accentBorder: 'rgba(45, 212, 191, 0.5)',
      button: 'linear-gradient(135deg, rgba(45, 212, 191, 0.2), rgba(96, 165, 250, 0.2))',
      buttonHover: 'linear-gradient(135deg, rgba(45, 212, 191, 0.3), rgba(96, 165, 250, 0.3))',
      messageUser: 'linear-gradient(135deg, rgba(45, 212, 191, 0.15), rgba(96, 165, 250, 0.1))',
      messageAssistant: 'rgba(255, 255, 255, 0.03)',
      input: 'rgba(255, 255, 255, 0.05)',
      inputBorder: 'rgba(255, 255, 255, 0.1)',
      scrollbar: 'rgba(45, 212, 191, 0.2)',
      scrollbarHover: 'rgba(45, 212, 191, 0.4)'
    }
  },
  liquidGlass: {
    name: 'Liquid Glass',
    description: 'Smooth, flowing glass with vibrant colors',
    colors: {
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1))',
      panel: 'rgba(255, 255, 255, 0.15)',
      panelBorder: 'rgba(255, 255, 255, 0.25)',
      panelShadow: '0 8px 32px 0 rgba(99, 102, 241, 0.3)',
      backdrop: 'blur(12px)',
      text: '#1a1a1a',
      textSecondary: 'rgba(0, 0, 0, 0.7)',
      accent: 'rgba(99, 102, 241, 0.4)',
      accentBorder: 'rgba(168, 85, 247, 0.6)',
      button: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(168, 85, 247, 0.3))',
      buttonHover: 'linear-gradient(135deg, rgba(99, 102, 241, 0.5), rgba(168, 85, 247, 0.5))',
      messageUser: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.15))',
      messageAssistant: 'rgba(255, 255, 255, 0.1)',
      input: 'rgba(255, 255, 255, 0.15)',
      inputBorder: 'rgba(168, 85, 247, 0.3)',
      scrollbar: 'rgba(168, 85, 247, 0.3)',
      scrollbarHover: 'rgba(168, 85, 247, 0.5)'
    }
  },
  neonCyber: {
    name: 'Neon Cyber',
    description: 'Cyberpunk-inspired with neon accents',
    colors: {
      background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(20, 0, 40, 0.98))',
      panel: 'rgba(0, 255, 255, 0.05)',
      panelBorder: 'rgba(0, 255, 255, 0.3)',
      panelShadow: '0 8px 32px 0 rgba(0, 255, 255, 0.2), 0 0 20px rgba(255, 0, 255, 0.1)',
      backdrop: 'blur(8px)',
      text: '#00ffff',
      textSecondary: 'rgba(0, 255, 255, 0.7)',
      accent: 'rgba(0, 255, 255, 0.3)',
      accentBorder: 'rgba(255, 0, 255, 0.5)',
      button: 'linear-gradient(135deg, rgba(0, 255, 255, 0.2), rgba(255, 0, 255, 0.2))',
      buttonHover: 'linear-gradient(135deg, rgba(0, 255, 255, 0.4), rgba(255, 0, 255, 0.4))',
      messageUser: 'linear-gradient(135deg, rgba(0, 255, 255, 0.15), rgba(255, 0, 255, 0.1))',
      messageAssistant: 'rgba(0, 0, 0, 0.5)',
      input: 'rgba(0, 0, 0, 0.6)',
      inputBorder: 'rgba(0, 255, 255, 0.4)',
      scrollbar: 'rgba(0, 255, 255, 0.3)',
      scrollbarHover: 'rgba(255, 0, 255, 0.5)'
    }
  },
  aurora: {
    name: 'Aurora',
    description: 'Northern lights inspired with flowing gradients',
    colors: {
      background: 'linear-gradient(135deg, rgba(5, 15, 30, 0.95), rgba(15, 5, 30, 0.95), rgba(5, 25, 45, 0.95))',
      panel: 'rgba(34, 197, 94, 0.05)',
      panelBorder: 'rgba(59, 130, 246, 0.2)',
      panelShadow: '0 8px 32px 0 rgba(34, 197, 94, 0.2), 0 0 30px rgba(59, 130, 246, 0.15)',
      backdrop: 'blur(10px)',
      text: '#e0f2fe',
      textSecondary: 'rgba(224, 242, 254, 0.75)',
      accent: 'rgba(34, 197, 94, 0.3)',
      accentBorder: 'rgba(59, 130, 246, 0.5)',
      button: 'linear-gradient(135deg, rgba(34, 197, 94, 0.25), rgba(59, 130, 246, 0.25))',
      buttonHover: 'linear-gradient(135deg, rgba(34, 197, 94, 0.4), rgba(59, 130, 246, 0.4))',
      messageUser: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(59, 130, 246, 0.1))',
      messageAssistant: 'rgba(255, 255, 255, 0.04)',
      input: 'rgba(255, 255, 255, 0.06)',
      inputBorder: 'rgba(59, 130, 246, 0.3)',
      scrollbar: 'rgba(34, 197, 94, 0.3)',
      scrollbarHover: 'rgba(59, 130, 246, 0.5)'
    }
  },
  minimalDark: {
    name: 'Minimal Dark',
    description: 'Clean, minimal dark theme with subtle accents',
    colors: {
      background: 'linear-gradient(135deg, rgba(15, 23, 36, 0.98), rgba(8, 18, 38, 0.98))',
      panel: 'rgba(255, 255, 255, 0.03)',
      panelBorder: 'rgba(255, 255, 255, 0.08)',
      panelShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
      backdrop: 'blur(6px)',
      text: '#f1f5f9',
      textSecondary: 'rgba(241, 245, 249, 0.65)',
      accent: 'rgba(148, 163, 184, 0.2)',
      accentBorder: 'rgba(148, 163, 184, 0.4)',
      button: 'linear-gradient(135deg, rgba(148, 163, 184, 0.15), rgba(100, 116, 139, 0.15))',
      buttonHover: 'linear-gradient(135deg, rgba(148, 163, 184, 0.25), rgba(100, 116, 139, 0.25))',
      messageUser: 'rgba(148, 163, 184, 0.1)',
      messageAssistant: 'rgba(255, 255, 255, 0.02)',
      input: 'rgba(255, 255, 255, 0.04)',
      inputBorder: 'rgba(255, 255, 255, 0.08)',
      scrollbar: 'rgba(148, 163, 184, 0.2)',
      scrollbarHover: 'rgba(148, 163, 184, 0.35)'
    }
  }
}

export const DEFAULT_THEME = 'glassmorphism'

/**
 * Get theme by name
 */
export function getTheme(themeName) {
  return THEMES[themeName] || THEMES[DEFAULT_THEME]
}

/**
 * Apply theme styles to an element
 */
export function applyThemeStyles(element, theme) {
  if (!element || !theme) return
  
  const t = typeof theme === 'string' ? getTheme(theme) : theme
  const colors = t.colors
  
  element.style.background = colors.background
  element.style.backdropFilter = colors.backdrop
  element.style.webkitBackdropFilter = colors.backdrop
}

