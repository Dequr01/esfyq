import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import TiltCard from '../molecules/TiltCard'

export default function Hero() {
  const [mobile, setMobile] = useState(false)
  const heroRef = useRef(null)

  useEffect(() => {
    const checkMobile = () => setMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const scrollToProjects = () => {
    const container = document.querySelector('.scroll-container')
    if (container) container.scrollTo({ top: window.innerHeight * 2, behavior: 'smooth' })
  }

  const blend = {
    color: '#ffffff',
    mixBlendMode: 'difference',
    background: 'transparent',
    display: 'block',
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20,
      },
    },
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
      <motion.div
        style={{
          maxWidth: '1200px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          background: 'transparent',
          overflow: 'visible',
          zIndex: 'auto',
        }}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <TiltCard style={{ 
          textAlign: 'center', 
          width: mobile ? '100%' : 'auto',
          maxWidth: mobile ? '100%' : '1200px',
          background: 'rgba(0, 0, 0, 0.2)',
        }}>
          <motion.h1 
            variants={itemVariants}
            style={{
              ...blend,
              fontSize: 'clamp(2.5rem, 8vw, 6.5rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              letterSpacing: '-0.04em',
              transform: 'translateZ(60px)', // Depth layer
            }}
          >
            Bringing ideas to life
          </motion.h1>

          <motion.h2 
            variants={itemVariants}
            style={{
              ...blend,
              fontSize: 'clamp(0.9rem, 2.5vw, 1.5rem)',
              fontWeight: 300,
              marginBottom: '2rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              transform: 'translateZ(40px)', // Middle depth
            }}
          >
            Good code is like poetry...
          </motion.h2>

          <motion.p 
            variants={itemVariants}
            style={{
              ...blend,
              fontSize: 'clamp(0.85rem, 4vw, 1.1rem)',
              lineHeight: 1.6,
              maxWidth: '560px',
              margin: '0 auto 2rem',
              transform: 'translateZ(20px)', // Shallow depth
            }}
          >
            Architecting high-performance digital experiences with precision and passion.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            style={{ display: 'inline-block', marginBottom: '1rem', transform: 'translateZ(50px)' }}
          >
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
          </motion.div>
        </TiltCard>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.4 }}
        transition={{ delay: 1.2, duration: 1 }}
        viewport={{ once: true }}
        style={{
          position: 'absolute',
          bottom: '1.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      >
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
      </motion.div>
    </section>
  )
}