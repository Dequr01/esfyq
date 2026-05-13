import { useEffect, useRef, useState } from 'react'

export default function Hero() {
  const [hasAnimated, setHasAnimated] = useState(false)
  const heroRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.3 }
    )
    if (heroRef.current) observer.observe(heroRef.current)
    return () => { if (heroRef.current) observer.unobserve(heroRef.current) }
  }, [hasAnimated])

  const scrollToProjects = () => {
    const container = document.querySelector('.scroll-container')
    if (container) container.scrollTo({ top: window.innerHeight * 2, behavior: 'smooth' })
  }

  const fadeUp = (delay) => ({
    opacity: hasAnimated ? 1 : 0,
    transform: hasAnimated ? 'translateY(0px)' : 'translateY(40px)',
    transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
  })

  /*
    mix-blend-mode: difference rules:
    - text color must be pure #ffffff
    - NO overflow:hidden on any ancestor (creates stacking context, breaks blend)
    - NO numeric z-index on any ancestor (same problem)
    - NO background on any ancestor between text and canvas
    The section and wrapper both use overflow:visible and zIndex:auto intentionally.
  */
  const blend = {
    color: '#ffffff',
    mixBlendMode: 'difference',
    background: 'transparent',
    display: 'block',
  }

  return (
    <section
      id="hero"
      ref={heroRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        background: 'transparent',
        position: 'relative',
        overflow: 'visible',  /* MUST be visible — hidden kills blend mode */
        zIndex: 'auto',     /* MUST be auto — any number creates stacking context */
      }}
    >
      <div style={{
        maxWidth: '1200px',
        width: '100%',
        textAlign: 'center',
        padding: '0 1rem',
        background: 'transparent',
        overflow: 'visible',      /* MUST be visible */
        zIndex: 'auto',         /* MUST be auto */
      }}>

        <h1 style={{
          ...fadeUp(0),
          ...blend,
          fontSize: 'clamp(2.5rem, 8vw, 6.5rem)',
          fontWeight: 800,
          lineHeight: 1.1,
          marginBottom: '1.5rem',
          letterSpacing: '-0.04em',
        }}>
          Bringing ideas to life
        </h1>

        <h2 style={{
          ...fadeUp(150),
          ...blend,
          fontSize: 'clamp(0.9rem, 2.5vw, 1.5rem)',
          fontWeight: 300,
          marginBottom: '2rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}>
          Good code is like poetry...
        </h2>

        <p style={{
          ...fadeUp(250),
          ...blend,
          fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)',
          lineHeight: 1.6,
          maxWidth: '560px',
          margin: '0 auto 3rem',
        }}>
          Architecting high-performance digital experiences with precision and passion.
        </p>

        {/* CTA button — intentionally NO blend mode */}
        <div style={{ ...fadeUp(350), display: 'inline-block' }}>
          <button
            onClick={scrollToProjects}
            style={{
              padding: '1rem 2.5rem',
              fontSize: '0.85rem',
              fontWeight: 500,
              color: 'var(--text)',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '999px',
              backdropFilter: 'blur(10px)',
              cursor: 'pointer',
              transition: 'background 0.4s ease, color 0.4s ease',
              letterSpacing: '0.05em',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--text)'
              e.currentTarget.style.color = 'var(--bg)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--surface)'
              e.currentTarget.style.color = 'var(--text)'
            }}
          >
            View My Work
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute',
        bottom: '1.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        opacity: hasAnimated ? 0.4 : 0,
        transition: 'opacity 1s ease 1.2s',
        pointerEvents: 'none',
        zIndex: 5,
      }}>
        <span style={{
          fontSize: '0.6rem',
          letterSpacing: '0.3em',
          color: 'var(--text-muted)',
          fontFamily: 'monospace',
        }}>
          SCROLL
        </span>
        <div style={{
          width: '1px',
          height: '3rem',
          background: 'linear-gradient(to bottom, var(--text), transparent)',
        }} />
      </div>
    </section>
  )
}