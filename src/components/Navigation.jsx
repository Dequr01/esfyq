import { useEffect, useRef, useState } from 'react'
import anime from 'animejs'
import { useTheme } from '../context/ThemeContext'

export default function Navigation() {
  const navRef = useRef(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { isDark, toggleTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    
    // Animate nav on mount
    if (navRef.current && navRef.current.children && typeof anime !== 'undefined') {
      try {
        // Set initial state
        Array.from(navRef.current.children).forEach((child) => {
          if (child.style) {
            child.style.opacity = '0'
            child.style.transform = 'translateY(-20px)'
          }
        })
        
        // Animate in
        anime({
          targets: navRef.current.children,
          opacity: [0, 1],
          translateY: [-20, 0],
          delay: anime.stagger(100),
          duration: 800,
          easing: 'easeOutExpo',
        })
      } catch (error) {
        // Fallback: make visible if animation fails
        Array.from(navRef.current.children).forEach((child) => {
          if (child.style) {
            child.style.opacity = '1'
            child.style.transform = 'translateY(0)'
          }
        })
      }
    }

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      ref={navRef}
      className={`nav ${isScrolled ? 'nav-scrolled' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: 'clamp(0.8rem, 2vw, 1.5rem) clamp(1rem, 3vw, 3rem)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'all 0.3s ease',
        background: isScrolled ? 'rgba(10, 10, 10, 0.8)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(20px)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
      }}
    >
      <div
        className="nav-logo"
        onClick={() => scrollTo('hero')}
        style={{
          fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
          fontWeight: 700,
          cursor: 'pointer',
          letterSpacing: '-0.02em',
          color: '#ffffff',
          opacity: 1,
        }}
      >
        ESFYQ
      </div>

      {/* Desktop Navigation */}
      <div
        className="nav-links"
        style={{
          display: 'flex',
          gap: 'clamp(1.5rem, 3vw, 3rem)',
          listStyle: 'none',
          alignItems: 'center',
          '@media (max-width: 768px)': {
            display: 'none',
          },
        }}
      >
        {['About', 'Projects', 'Contact'].map((item) => (
          <li
            key={item}
            onClick={() => scrollTo(item.toLowerCase())}
            className="nav-link"
            style={{
              cursor: 'pointer',
              fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
              fontWeight: 400,
              color: '#cccccc',
              transition: 'color 0.3s ease',
              opacity: 1,
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              anime({
                targets: e.target,
                color: '#ffffff',
                scale: 1.05,
                duration: 200,
              })
            }}
            onMouseLeave={(e) => {
              anime({
                targets: e.target,
                color: '#cccccc',
                scale: 1,
                duration: 200,
              })
            }}
          >
            {item}
          </li>
        ))}
        
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          style={{
            cursor: 'pointer',
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            anime({
              targets: e.target,
              scale: 1.1,
              duration: 200,
            })
          }}
          onMouseLeave={(e) => {
            anime({
              targets: e.target,
              scale: 1,
              duration: 200,
            })
          }}
          aria-label="Toggle theme"
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Mobile Menu Button & Theme Toggle */}
      <div
        style={{
          display: 'none',
          gap: '1rem',
          alignItems: 'center',
          '@media (max-width: 768px)': {
            display: 'flex',
          },
        }}
      >
        {/* Mobile Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            cursor: 'pointer',
            fontSize: '1.2rem',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
          }}
          onTouchStart={(e) => {
            anime({
              targets: e.target,
              scale: 0.95,
              duration: 100,
            })
          }}
          onTouchEnd={(e) => {
            anime({
              targets: e.target,
              scale: 1,
              duration: 100,
            })
          }}
          aria-label="Toggle theme"
        >
          {isDark ? '☀️' : '🌙'}
        </button>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          style={{
            cursor: 'pointer',
            fontSize: '1.5rem',
            width: '36px',
            height: '36px',
            borderRadius: '6px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
          }}
        >
          ☰
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileOpen && (
        <div
          style={{
            position: 'absolute',
            top: '60px',
            left: 0,
            right: 0,
            background: 'rgba(10, 10, 10, 0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            borderRadius: '0 0 12px 12px',
            zIndex: 999,
          }}
        >
          {['About', 'Projects', 'Contact'].map((item) => (
            <button
              key={item}
              onClick={() => {
                scrollTo(item.toLowerCase())
                setIsMobileOpen(false)
              }}
              style={{
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 400,
                color: '#cccccc',
                background: 'none',
                border: 'none',
                padding: '0.75rem',
                textAlign: 'left',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#ffffff'
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#cccccc'
              }}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}

