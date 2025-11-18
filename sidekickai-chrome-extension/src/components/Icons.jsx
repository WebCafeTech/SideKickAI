import React from 'react'

/**
 * Icon components for the application
 */

export function SettingsIcon({ size = 16, color = 'currentColor' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  )
}

export function PinIcon({ size = 16, color = 'currentColor', filled = false }) {
  return (
    <svg
      width={size}
      height={size}
      // viewBox="0 0 24 24"
      viewBox="-0.075 -0.075 0.72 0.72"
      // fill={filled ? color : '#000000'}
      fill="#000000"
      // stroke={color}
      // strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      preserveAspectRatio="xMinYMin"
    >
      {/* Location pin / map marker - commonly used for pinning in modern UIs */}
      <path 
        d="m0.379 0.34 -0.006 -0.031 0.135 -0.135 -0.086 -0.086 -0.135 0.135 -0.031 -0.006a0.151 0.151 0 0 0 -0.082 0.008l0.196 0.196a0.151 0.151 0 0 0 0.008 -0.082m-0.128 0.048L0.08 0.56a0.03 0.03 0 0 1 -0.043 -0.043l0.171 -0.171L0.08 0.217a0.211 0.211 0 0 1 0.187 -0.059l0.112 -0.112a0.061 0.061 0 0 1 0.086 0l0.086 0.086a0.061 0.061 0 0 1 0 0.086l-0.112 0.112a0.211 0.211 0 0 1 -0.059 0.187z"
        // fill={filled ? color : '#000000'}
        // fill="none"
        // stroke={color}
        // strokeWidth="2"
      />
    </svg>
  )
}

export function CloseIcon({ size = 16, color = 'currentColor' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  )
}

export function UpArrowIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="19" x2="12" y2="5"></line>
      <polyline points="5 12 12 5 19 12"></polyline>
    </svg>
  )
}

