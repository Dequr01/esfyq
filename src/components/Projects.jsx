import { useEffect, useRef } from 'react'
import anime from 'animejs'
import { useTheme } from '../context/ThemeContext'
import GlassyCard from './GlassyCard'

export default function Projects() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const projectsRef = useRef(null)
  const { isDark } = useTheme()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const timeline = anime.timeline({
              easing: 'easeOutExpo',
            })

            timeline
              .add({
                targets: titleRef.current,
                opacity: [0, 1],
                translateY: [50, 0],
                duration: 1000,
              })
              .add(
                {
                  targets: projectsRef.current?.children,
                  opacity: [0, 1],
                  translateY: [40, 0],
                  scale: [0.8, 1],
                  delay: anime.stagger(100),
                  duration: 700,
                },
                '-=600'
              )
            
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  // Skills grouped by category with SVG icons - Apple-like glassmorphic design
  const skills = [
    {
      name: 'Python',
      category: 'Language',
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="18" fill="rgba(255, 255, 255, 0.05)" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2"/>
          <path d="M20 12C16.7 12 14 13.8 14 16V24C14 26.2 16.7 28 20 28C23.3 28 26 26.2 26 24V16C26 13.8 23.3 12 20 12Z" fill="rgba(255, 255, 255, 0.2)"/>
          <path d="M16 15H24" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      name: 'JavaScript',
      category: 'Language',
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="20" height="20" rx="2" fill="rgba(255, 255, 255, 0.1)" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2"/>
          <text x="20" y="27" textAnchor="middle" fill="rgba(255, 255, 255, 0.6)" fontSize="14" fontWeight="bold">JS</text>
        </svg>
      ),
    },
    {
      name: 'React',
      category: 'Framework',
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="5" fill="rgba(255, 255, 255, 0.4)"/>
          <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.5" strokeDasharray="1 3"/>
          <circle cx="20" cy="20" r="10" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.5" transform="rotate(0 20 20)"/>
          <circle cx="20" cy="20" r="10" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.5" transform="rotate(60 20 20)"/>
          <circle cx="20" cy="20" r="10" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.5" transform="rotate(120 20 20)"/>
        </svg>
      ),
    },
    {
      name: 'TensorFlow Lite',
      category: 'AI/ML',
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 18L20 10L28 18M20 10V28M12 28H28" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="2"/>
        </svg>
      ),
    },
    {
      name: 'OpenCV',
      category: 'AI/ML',
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="10" fill="none" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="2"/>
          <circle cx="20" cy="20" r="5" fill="rgba(255, 255, 255, 0.3)"/>
          <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1.5"/>
          <path d="M15 20H25M20 15V25" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1"/>
        </svg>
      ),
    },
    {
      name: 'Hugging Face',
      category: 'AI/ML',
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 16C11 16 10 18 10 20C10 22 11 24 13 24M27 16C29 16 30 18 30 20C30 22 29 24 27 24" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="2" strokeLinecap="round"/>
          <path d="M15 18H25M15 22H25" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="2"/>
        </svg>
      ),
    },
    {
      name: 'PostgreSQL',
      category: 'Database',
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 12C16 12 13 14 13 17V27C13 29 16 31 20 31C24 31 27 29 27 27V17C27 14 24 12 20 12Z" fill="rgba(255, 255, 255, 0.1)" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="2"/>
          <path d="M13 17C13 19 16 21 20 21C24 21 27 19 27 17" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.5"/>
          <path d="M15 22L15 26M20 22V26M25 22V26" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      name: 'TailwindCSS',
      category: 'Styling',
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="2"/>
          <path d="M12 24C12 22 14 20 16 20C18 20 19 22 20 24C21 22 22 20 24 20C26 20 28 22 28 24" fill="none" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 16L24 16" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      name: 'Vite',
      category: 'Build Tool',
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="20,12 28,28 12,28" fill="rgba(255, 255, 255, 0.1)" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="2"/>
          <path d="M18 20L22 20M20 18V22" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1.5"/>
        </svg>
      ),
    },
    {
      name: 'Git',
      category: 'Version Control',
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="2"/>
          <circle cx="14" cy="13" r="2.5" fill="rgba(255, 255, 255, 0.5)"/>
          <circle cx="28" cy="20" r="2.5" fill="rgba(255, 255, 255, 0.5)"/>
          <circle cx="14" cy="27" r="2.5" fill="rgba(255, 255, 255, 0.5)"/>
          <path d="M16 13L26 20M16 13L26 27" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.5"/>
        </svg>
      ),
    },
    {
      name: 'OSINT',
      category: 'Specialization',
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="8" fill="none" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="2"/>
          <path d="M20 14V12M20 28V26M14 20H12M28 20H26M15 15L13.5 13.5M26 26L24.5 24.5M25 15L26.5 13.5M14 26L12.5 24.5" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1.5"/>
        </svg>
      ),
    },
    {
      name: 'AI Prompt Engineering',
      category: 'Specialization',
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 20C12 15.6 15.6 12 20 12C24.4 12 28 15.6 28 20C28 22.2 27 24.2 25.5 25.5L26 28L22 26C21.3 26.1 20.7 26.1 20 26.1C15.6 26.1 12 22.4 12 20Z" fill="rgba(255, 255, 255, 0.1)" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5"/>
          <path d="M16 20H24" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
    },
  ]

  return (
    <section
      id="projects"
      ref={sectionRef}
      style={{
        minHeight: 'auto',
        padding: 'clamp(2rem, 6vw, 4rem) clamp(1.5rem, 4vw, 4rem)',
        maxWidth: '1400px',
        margin: '0 auto',
        background: 'transparent',
        position: 'relative',
        zIndex: 1,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        opacity: 1,
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}
    >
      <h2
        ref={titleRef}
        style={{
          fontSize: 'clamp(2.5rem, 6vw, 4rem)',
          fontWeight: 700,
          marginBottom: 'clamp(2rem, 4vw, 3rem)',
          letterSpacing: '-0.03em',
          color: '#ffffff',
          opacity: 0,
        }}
      >
        Languages & Technologies
      </h2>

      <div
        ref={projectsRef}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
          gap: 'clamp(1rem, 2vw, 1.5rem)',
        }}
      >
        {/* Skills grid with entry animation */}
        {skills.map((skill, index) => (
          <div
            key={index}
            style={{
              opacity: 0,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              if (typeof anime !== 'undefined') {
                anime({
                  targets: e.currentTarget,
                  translateY: -12,
                  scale: 1.08,
                  duration: 400,
                  easing: 'easeOutQuad',
                })
              }
            }}
            onMouseLeave={(e) => {
              if (typeof anime !== 'undefined') {
                anime({
                  targets: e.currentTarget,
                  translateY: 0,
                  scale: 1,
                  duration: 400,
                  easing: 'easeOutQuad',
                })
              }
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '20px',
                padding: 'clamp(1.5rem, 4vw, 2rem)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                position: 'relative',
                zIndex: 1,
                minHeight: '160px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                overflow: 'hidden',
              }}
            >
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
                  zIndex: 2,
                }}
              />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div
                  style={{
                    marginBottom: '0.75rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '40px',
                  }}
                >
                  {skill.icon}
                </div>
                <h3
                  style={{
                    fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: '#ffffff',
                    marginBottom: '0.5rem',
                  }}
                >
                  {skill.name}
                </h3>
                <p
                  style={{
                    fontSize: '0.7rem',
                    color: '#aaaaaa',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontWeight: 500,
                  }}
                >
                  {skill.category}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

