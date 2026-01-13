import React from 'react'

export default function GlassyCard({ children, style = {} }) {
  const baseStyle = {
    padding: 'clamp(1.5rem, 4vw, 2rem)',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(30px)',
    WebkitBackdropFilter: 'blur(30px)',
    position: 'relative',
    zIndex: 1,
    minHeight: 'clamp(250px, 50vh, 400px)',
    overflow: 'hidden',
    ...style,
  }

  return (
    <div style={baseStyle}>
      {/* Apple-style reflection border effect */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0) 100%)',
          pointerEvents: 'none',
        }}
      />
      {children}
    </div>
  )
}
