import { useEffect, useRef, useState } from 'react'
import GlassyCard from './GlassyCard'

export default function Hero() {
  const [hasAnimated, setHasAnimated] = useState(false)
  const [mobile, setMobile] = useState(false)
  const heroRef = useRef(null)

  useEffect(() => {
    const checkMobile = () => setMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
        padding: mobile ? '6rem 1.5rem 2rem' : '2rem',
        background: 'transparent',
        position: 'relative',
        overflow: 'visible',
        zIndex: 'auto',
      }}
    >
      <div style={{
        maxWidth: '1200px',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        background: 'transparent',
        overflow: 'visible',
        zIndex: 'auto',
      }}>
        <GlassyCard style={{ 
          textAlign: 'center', 
          width: mobile ? '100%' : 'auto',
          maxWidth: '800px',
          background: 'rgba(0, 0, 0, 0.2)', /* Ultra-subtle to maintain blend mode */
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
            fontSize: 'clamp(0.85rem, 4vw, 1.1rem)',
            lineHeight: 1.6,
            maxWidth: '560px',
            margin: '0 auto 2rem',
          }}>
            Architecting high-performance digital experiences with precision and passion.
          </p>

          <div style={{ ...fadeUp(350), display: 'inline-block', marginBottom: '1rem' }}>
            <button
              onClick={scrollToProjects}
              style={{
                padding: '0.8rem 2rem',
                fontSize: '0.8rem',
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
        </GlassyCard>
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