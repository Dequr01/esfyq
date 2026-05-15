import React from 'react'

export default function GlassyCard({ children, style = {}, className = "" }) {
  const baseStyle = {
    padding: 'clamp(1rem, 3vw, 1.5rem)',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '1.25rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    position: 'relative',
    zIndex: 1,
    overflow: 'hidden',
    isolation: 'isolate',
    ...style,
  }

  return (
    <div style={baseStyle}>
      {children}
    </div>
  )
}
