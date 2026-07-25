import { useState, useEffect, useRef } from 'react'
import anime from 'animejs'

/**
 * Theme Toggle with smooth transitions
 * Can be enhanced with Rive animation later
 */
export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)
  const toggleRef = useRef(null)

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    
    if (typeof anime !== 'undefined' && toggleRef.current) {
      anime({
        targets: document.body,
        backgroundColor: isDark ? '#0f0f0f' : '#fafafa',
        color: isDark ? '#ffffff' : '#0f0f0f',
        duration: 1000,
        easing: 'easeInOutQuad',
      })
    }
  }, [isDark])

  const toggleTheme = () => {
    setIsDark(!isDark)
    
    if (typeof anime !== 'undefined' && toggleRef.current) {
      anime({
        targets: toggleRef.current,
        rotate: [0, 360],
        scale: [1, 1.2, 1],
        duration: 600,
        easing: 'easeOutElastic(1, .8)',
      })
    }
  }

  return (
    <button
      ref={toggleRef}
      onClick={toggleTheme}
      style={{
        position: 'fixed',
        top: '2rem',
        right: '2rem',
        zIndex: 1000,
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: '#ffffff',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        if (typeof anime !== 'undefined') {
          anime({
            targets: e.target,
            scale: 1.1,
            background: 'rgba(255, 255, 255, 0.15)',
            duration: 200,
          })
        }
      }}
      onMouseLeave={(e) => {
        if (typeof anime !== 'undefined') {
          anime({
            targets: e.target,
            scale: 1,
            background: 'rgba(255, 255, 255, 0.1)',
            duration: 200,
          })
        }
      }}
      aria-label="Toggle theme"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}

