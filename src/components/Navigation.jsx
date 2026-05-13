import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'

const navLinks = [
  { id: 'genesis', label: 'THE GENESIS', chapter: 'I' },
  { id: 'craft', label: 'THE CRAFT', chapter: 'II' },
  { id: 'projects', label: 'THE ARTIFACTS', chapter: 'III' },
  { id: 'contact', label: 'THE CONNECTION', chapter: 'IV' },
]

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeChapter, setActiveChapter] = useState(navLinks[0])
  const { isDark, toggleTheme } = useTheme()

  useEffect(() => {
    const container = document.querySelector('.scroll-container')
    if (!container) return

    const handleScroll = () => {
      const scrollPos = container.scrollTop
      setIsScrolled(scrollPos > 50)
      const idx = Math.round(
        (scrollPos / (container.scrollHeight - container.clientHeight)) *
        (navLinks.length - 1)
      )
      if (navLinks[idx]) setActiveChapter(navLinks[idx])
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (index) => {
    const container = document.querySelector('.scroll-container')
    if (!container) return
    const total = container.scrollHeight - container.clientHeight
    container.scrollTo({ top: (index / (navLinks.length - 1)) * total, behavior: 'smooth' })
  }

  const pillExpanded = !isScrolled || isExpanded

  return (
    <nav
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      style={{
        position: 'fixed',
        top: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,

        /* sizing — only maxWidth animates */
        height: '48px',
        maxWidth: pillExpanded ? '820px' : '300px',
        width: 'max-content',

        /* layout */
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '0',
        padding: '0 1.25rem',
        overflow: 'hidden',
        whiteSpace: 'nowrap',

        /* look */
        background: 'var(--pill-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid var(--pill-border)',
        borderRadius: '999px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',

        /* spring transition on width only */
        transition: [
          'max-width 0.55s cubic-bezier(0.34,1.56,0.64,1)',
          'padding   0.4s  ease',
          'box-shadow 0.3s ease',
        ].join(', '),
      }}
    >
      {/* ── Logo ── */}
      <span style={{
        fontWeight: 900,
        fontSize: '1.1rem',
        letterSpacing: '-0.04em',
        color: 'var(--text)',
        flexShrink: 0,
        userSelect: 'none',
      }}>
        ESFYQ
      </span>

      {/* ── Chapter indicator (only when scrolled) ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginLeft: '0.75rem',
        paddingLeft: '0.75rem',
        borderLeft: '1px solid var(--border)',
        height: '16px',
        flexShrink: 0,
        opacity: isScrolled ? 1 : 0,
        width: isScrolled ? 'auto' : 0,
        overflow: 'hidden',
        transition: 'opacity 0.3s ease, width 0.3s ease',
      }}>
        <span style={{ fontSize: '0.6rem', fontFamily: 'monospace', color: 'var(--accent)', flexShrink: 0 }}>
          {activeChapter.chapter}
        </span>
        <span style={{ fontSize: '0.6rem', fontFamily: 'monospace', color: 'var(--text-muted)', flexShrink: 0 }}>
          {activeChapter.label}
        </span>
      </div>

      {/* ── Nav links (visible when expanded) ── */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '2rem',
        marginLeft: pillExpanded ? '2rem' : '0',
        maxWidth: pillExpanded ? '600px' : '0',
        opacity: pillExpanded ? 1 : 0,
        overflow: 'hidden',
        pointerEvents: pillExpanded ? 'auto' : 'none',
        flexShrink: 0,
        transition: 'max-width 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease, margin 0.4s ease',
      }}>
        {navLinks.map((link, index) => (
          <button
            key={link.id}
            onClick={() => scrollToSection(index)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.25rem 0',
              fontSize: '0.6rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              color: activeChapter.id === link.id ? 'var(--text)' : 'var(--text-muted)',
              flexShrink: 0,
              whiteSpace: 'nowrap',
              transition: 'color 0.2s ease',
              textDecoration: activeChapter.id === link.id ? 'underline' : 'none',
              textUnderlineOffset: '4px',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
            onMouseLeave={e => e.currentTarget.style.color = activeChapter.id === link.id ? 'var(--text)' : 'var(--text-muted)'}
          >
            {link.label}
          </button>
        ))}
      </div>

      {/* ── Theme toggle — always last, never clipped ── */}
      <button
        onClick={toggleTheme}
        style={{
          marginLeft: 'auto',
          paddingLeft: '0.75rem',
          flexShrink: 0,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '2rem',
          height: '2rem',
          borderRadius: '50%',
          transition: 'background 0.2s ease, transform 0.4s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'var(--surface)'
          e.currentTarget.style.transform = 'rotate(180deg)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'none'
          e.currentTarget.style.transform = 'rotate(0deg)'
        }}
        aria-label="Toggle theme"
      >
        {isDark ? (
          /* Sun */
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          /* Moon */
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </button>
    </nav>
  )
}