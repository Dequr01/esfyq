import { useEffect, useRef } from 'react'
import anime from 'animejs'
import GlassyCard from './GlassyCard'

export default function About() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const contentRef = useRef(null)
  const skillsRef = useRef(null)

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
                  targets: contentRef.current?.children,
                  opacity: [0, 1],
                  translateX: [-30, 0],
                  delay: anime.stagger(100),
                  duration: 800,
                },
                '-=500'
              )
              .add(
                {
                  targets: skillsRef.current?.children,
                  opacity: [0, 1],
                  scale: [0.8, 1],
                  delay: anime.stagger(50),
                  duration: 600,
                },
                '-=400'
              )
            
            // Unobserve after animation triggers once
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 }
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

  const skills = [
    'Python',
    'React',
    'TensorFlow Lite',
    'OpenCV',
    'TailwindCSS',
    'PostgreSQL',
    'Hugging Face',
    'OSINT',
    'AI Prompt Engineering',
    'Vite',
    'Git',
    'Automation',
  ]

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        minHeight: 'auto',
        padding: 'clamp(1rem, 4vw, 2rem) clamp(1.5rem, 4vw, 4rem)',
        maxWidth: '1200px',
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
          opacity: 0,
        }}
      >
        About
      </h2>

      <div
        ref={contentRef}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
          gap: 'clamp(1.5rem, 3vw, 2.5rem)',
          marginBottom: '0',
        }}
      >
        {/* ===== ABOUT CARD #1: WHO I AM ===== */}
        {/* Edit this card for mobile - GlassyCard component in this div */}
        <GlassyCard style={{ opacity: 0 }}>
          <h3
            style={{
              fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
              fontWeight: 600,
              marginBottom: '1.5rem',
              letterSpacing: '-0.02em',
              color: '#ffffff',
            }}
          >
            Who I Am
          </h3>
          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.1rem)',
              lineHeight: 1.8,
              color: '#e8e8e8',
            }}
          >
            I'm IamCodebreaker, an AI and Python developer passionate about building intelligent
            solutions. Specialized in machine learning, OSINT automation, and offline AI systems.
            I transform complex problems into elegant, efficient code.
          </p>
        </GlassyCard>

        {/* ===== ABOUT CARD #2: WHAT I DO ===== */}
        {/* Edit this card for mobile - GlassyCard component in this div */}
        <GlassyCard style={{ opacity: 0 }}>
          <h3
            style={{
              fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
              fontWeight: 600,
              marginBottom: '1.5rem',
              letterSpacing: '-0.02em',
              color: '#ffffff',
            }}
          >
            What I Do
          </h3>
          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.1rem)',
              lineHeight: 1.8,
              color: '#e8e8e8',
            }}
          >
            I specialize in AI model fine-tuning, OSINT automation, offline ML systems, and
            full-stack development. From custom AI assistants to reverse image search tools,
            I deliver privacy-first, intelligent applications.
          </p>
        </GlassyCard>

        {/* ===== ABOUT CARD #3: MY APPROACH ===== */}
        {/* Edit this card for mobile - GlassyCard component in this div */}
        <GlassyCard style={{ opacity: 0 }}>
          <h3
            style={{
              fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
              fontWeight: 600,
              marginBottom: '1.5rem',
              letterSpacing: '-0.02em',
              color: '#ffffff',
            }}
          >
            My Approach
          </h3>
          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.1rem)',
              lineHeight: 1.8,
              color: '#e8e8e8',
            }}
          >
            I focus on clean, maintainable code with performance-first architecture. Every
            project combines cutting-edge AI capabilities with practical automation, delivering
            solutions that are both intelligent and reliable.
          </p>
        </GlassyCard>
      </div>

      <div style={{ opacity: 0, marginTop: '0.5rem' }}>
        <h3
          style={{
            fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
            fontWeight: 600,
            marginBottom: '1rem',
            letterSpacing: '-0.02em',
            color: '#ffffff',
          }}
        >
          Skills & Technologies
        </h3>
        <div
          ref={skillsRef}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          {skills.map((skill, index) => (
            <div
              key={index}
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '50px',
              }}
              onMouseEnter={(e) => {
                anime({
                  targets: e.currentTarget,
                  scale: 1.08,
                  duration: 200,
                })
              }}
              onMouseLeave={(e) => {
                anime({
                  targets: e.currentTarget,
                  scale: 1,
                  duration: 200,
                })
              }}
            >
              <span
                style={{
                  padding: '0.65rem 1.25rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(30px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '50px',
                  fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)',
                  color: '#f5f5f5',
                  fontWeight: 500,
                  opacity: 0,
                  cursor: 'default',
                  display: 'block',
                  whiteSpace: 'nowrap',
                  position: 'relative',
                  zIndex: 1,
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                }}
              >
                {skill}
              </span>
              {/* Apple reflection effect */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: 'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0) 100%)',
                  pointerEvents: 'none',
                  zIndex: 2,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

