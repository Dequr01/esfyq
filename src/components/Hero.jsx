import { useEffect, useRef } from 'react'
import anime from 'animejs'
import MarqueeText from './MarqueeText'
import GlassyCard from './GlassyCard'

export default function Hero() {
  const heroRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const descriptionRef = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    if (typeof anime === 'undefined') {
      if (titleRef.current) titleRef.current.style.opacity = '1'
      if (subtitleRef.current) subtitleRef.current.style.opacity = '1'
      if (descriptionRef.current) descriptionRef.current.style.opacity = '1'
      if (buttonRef.current) buttonRef.current.style.opacity = '1'
      return
    }

    // Set initial state for subtitle to be more hidden before animation
    if (subtitleRef.current) {
      subtitleRef.current.style.opacity = '0'
      subtitleRef.current.style.transform = 'translateY(40px)'
    }
    // Animate subtitle independently with precision and delay
    const subtitleAnim = () => {
      if (!subtitleRef.current) return
      anime({
        targets: subtitleRef.current,
        opacity: [0, 1],
        translateY: [40, 0],
        duration: 1200,
        easing: 'easeOutExpo',
        delay: 500
      })
    }

    // Use IntersectionObserver to trigger animation only once when in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            try {
              const timeline = anime.timeline({
                easing: 'easeOutExpo',
                duration: 1000,
              })

              timeline
                .add({
                  targets: titleRef.current,
                  opacity: [0, 1],
                  translateY: [50, 0],
                  duration: 1200,
                }, '-=800')
                // Replace subtitle animation in timeline with separate controlled anim
                // .add({
                //   targets: subtitleRef.current,
                //   opacity: [0, 1],
                //   translateY: [30, 0],
                //   duration: 1000,
                // }, '-=800')
                .add({
                  targets: descriptionRef.current,
                  opacity: [0, 1],
                  translateY: [30, 0],
                  duration: 1000,
                }, '-=700')
                .add({
                  targets: buttonRef.current,
                  opacity: [0, 1],
                  scale: [0.8, 1],
                  duration: 800,
                }, '-=600')

              subtitleAnim()

              // Continuous background animation
              if (heroRef.current) {
                anime({
                  targets: heroRef.current,
                  backgroundPosition: ['0% 0%', '100% 100%'],
                  duration: 15000,
                  easing: 'linear',
                  loop: true,
                  direction: 'alternate',
                })
              }
            } catch (error) {
              if (titleRef.current) titleRef.current.style.opacity = '1'
              if (subtitleRef.current) subtitleRef.current.style.opacity = '1'
              if (descriptionRef.current) descriptionRef.current.style.opacity = '1'
              if (buttonRef.current) buttonRef.current.style.opacity = '1'
            }
            
            // Unobserve after animation triggers once
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    if (heroRef.current) {
      observer.observe(heroRef.current)
    }

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current)
      }
    }
  }, [])

  const scrollToId = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id="hero"
      ref={heroRef}
      style={{
        height: '100vh',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 'clamp(1rem, 4vw, 4rem)',
        background: 'transparent',
        backgroundSize: '200% 200%',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 1,
        boxSizing: 'border-box',
        // ADJUST THIS: Initial opacity (will be controlled by scroll hook)
        opacity: 1,
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}
    >
      {/* Glass morphism card - true glass effect with light refraction */}
      {/* ADJUST THIS FROM HERE: Card transparency and refraction effects */}
      <GlassyCard
        style={{
          maxWidth: '1200px',
          width: '100%',
          textAlign: 'center',
          borderRadius: '24px',
          padding: 'clamp(2rem, 5vw, 4rem)',
        }}
      >
        {/* ===== DESKTOP TITLE: "Senior Software Engineer" ===== */}
        {/* Mobile version uses word-wrapping, desktop stays single line */}
        <h1
          ref={titleRef}
          style={{
            fontSize: 'clamp(2rem, 8vw, 6rem)',
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: '1.5rem',
            letterSpacing: '-0.04em',
            background: 'linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            whiteSpace: 'normal',
            maxWidth: '100%',
          }}
        >
          Front End Software Engineer
        </h1>
        {/* ===== SUBTITLE: "Building digital experiences with code" ===== */}
        {/* Removed MarqueeText wrapper - now displays as normal text with word wrapping on mobile */}
        <h2
          ref={subtitleRef}
          style={{
            fontSize: 'clamp(1.25rem, 4vw, 2.5rem)',
            fontWeight: 400,
            marginBottom: '2rem',
            color: '#cccccc',
            letterSpacing: '-0.02em',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            whiteSpace: 'normal',
            maxWidth: '100%',
          }}
        >
          Building digital experiences with code
        </h2>
        <p
          ref={descriptionRef}
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.1rem)',
            lineHeight: 1.6,
            maxWidth: '600px',
            margin: '0 auto 3rem',
            color: '#aaaaaa',
          }}
        >
          AI & Python Developer | Building intelligent solutions with ML, OSINT tools, and automation
        </p>
        <button
          ref={buttonRef}
          onClick={() => scrollToId('projects')}
          style={{
            padding: 'clamp(0.875rem, 2vw, 1rem) clamp(2rem, 4vw, 2.5rem)',
            fontSize: 'clamp(0.9rem, 2vw, 1rem)',
            fontWeight: 500,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: '#ffffff',
            borderRadius: '50px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            letterSpacing: '0.02em',
          }}
          onMouseEnter={(e) => {
            if (typeof anime !== 'undefined') {
              anime({
                targets: e.target,
                scale: 1.05,
                background: 'rgba(255, 255, 255, 0.15)',
                borderColor: 'rgba(255,255,255,0.5)',
                duration: 300,
                easing: 'easeOutQuad',
              })
            }
          }}
          onMouseLeave={(e) => {
            if (typeof anime !== 'undefined') {
              anime({
                targets: e.target,
                scale: 1,
                background: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255,255,255,0.3)',
                duration: 300,
                easing: 'easeOutQuad',
              })
            }
          }}
        >
          View My Work
        </button>
      </GlassyCard>

      {/* Scroll indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          opacity: 0.5,
          zIndex: 2,
        }}
      >
        <span style={{ fontSize: '0.8rem', letterSpacing: '0.1em' }}>SCROLL</span>
        <div
          style={{
            width: '1px',
            height: '30px',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)',
          }}
        />
      </div>
    </section>
  )
}
