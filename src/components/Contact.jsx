import { useEffect, useRef, useState } from 'react'
import anime from 'animejs'
import GlassyCard from './GlassyCard'

export default function Contact() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const formRef = useRef(null)
  const formCardRef = useRef(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

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
                translateY: [30, 0],
                duration: 800,
              })
              .add(
                {
                  targets: formCardRef.current,
                  opacity: [0, 1],
                  translateY: [20, 0],
                  duration: 600,
                },
                '-=400'
              )
            
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

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setSubmitted(true)
    
    // Animate success
    if (formRef.current) {
      anime({
        targets: formRef.current,
        scale: [1, 1.02, 1],
        duration: 400,
        easing: 'easeOutElastic(1, .6)',
      })
    }

    // Reset form after 2 seconds
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' })
      setSubmitted(false)
    }, 2000)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com' },
    { name: 'LinkedIn', url: 'https://linkedin.com' },
    { name: 'Twitter', url: 'https://twitter.com' },
  ]

  return (
    <section
      id="contact"
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        padding: '2rem 1.5rem',
        maxWidth: '520px',
        margin: '0 auto',
        background: 'transparent',
        position: 'relative',
        zIndex: 1,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {/* ===== CARD BEHIND TITLE & SUBTITLE ===== */}
      {/* Glassmorphic background card for Get In Touch header */}
      <div
        ref={titleRef}
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '20px',
          padding: 'clamp(2rem, 4vw, 3rem) clamp(1.5rem, 3vw, 2rem)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
          marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)',
          position: 'relative',
          zIndex: 1,
          opacity: 0,
          textAlign: 'center',
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
          }}
        />
        <h2
          style={{
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            fontWeight: 700,
            marginBottom: '0.75rem',
            letterSpacing: '-0.03em',
            color: '#ffffff',
          }}
        >
          Get In Touch
        </h2>
        <p
          style={{
            fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
            color: '#aaaaaa',
            lineHeight: 1.5,
          }}
        >
          Have an AI, automation, or OSINT project? Let's build something intelligent together.
        </p>
      </div>

      {/* Contact Form */}
      <div 
        ref={formCardRef}
        style={{ 
          width: '100%',
          opacity: 0,
        }}
      >
        <form ref={formRef} onSubmit={handleSubmit} style={{ width: '100%' }}>
          {/* ===== GET IN TOUCH CARD ===== */}
          {/* Using GlassyCard component for proper blur rendering on all devices */}
          <GlassyCard
            style={{
              padding: '1.2rem',
              minHeight: 'auto',
            }}
          >
            {/* Name Input */}
            <div style={{ marginBottom: '0.8rem' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.25rem',
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  color: '#ffffff',
                  opacity: 0.7,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
                style={{
                  width: '100%',
                  padding: '0.55rem 0.8rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  anime({
                    targets: e.target,
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    duration: 300,
                  })
                }}
                onBlur={(e) => {
                  anime({
                    targets: e.target,
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    duration: 300,
                  })
                }}
              />
            </div>

            {/* Email Input */}
            <div style={{ marginBottom: '0.8rem' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.25rem',
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  color: '#ffffff',
                  opacity: 0.7,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                style={{
                  width: '100%',
                  padding: '0.55rem 0.8rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  anime({
                    targets: e.target,
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    duration: 300,
                  })
                }}
                onBlur={(e) => {
                  anime({
                    targets: e.target,
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    duration: 300,
                  })
                }}
              />
            </div>

            {/* Message Input */}
            <div style={{ marginBottom: '0.9rem' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.25rem',
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  color: '#ffffff',
                  opacity: 0.7,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me about your project..."
                required
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.8rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  outline: 'none',
                  resize: 'vertical',
                  minHeight: '60px',
                  fontFamily: 'inherit',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  anime({
                    targets: e.target,
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    duration: 300,
                  })
                }}
                onBlur={(e) => {
                  anime({
                    targets: e.target,
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    duration: 300,
                  })
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.65rem 1.2rem',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                letterSpacing: '0.01em',
                textTransform: 'uppercase',
                fontSize: '0.7rem',
                fontWeight: 600,
              }}
              onMouseEnter={(e) => {
                anime({
                  targets: e.target,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))',
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                  duration: 300,
                })
              }}
              onMouseLeave={(e) => {
                anime({
                  targets: e.target,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  duration: 300,
                })
              }}
            >
              {submitted ? '✓ Sent!' : 'Send Message'}
            </button>
          </GlassyCard>
        </form>
      </div>

      {/* Social Links */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1.2rem',
          flexWrap: 'wrap',
          marginTop: '1.2rem',
          paddingTop: '1rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(20, 20, 30, 0.4)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          padding: '1rem',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        }}
      >
        {socialLinks.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '0.8rem',
              opacity: 0.6,
              textDecoration: 'none',
              color: '#ffffff',
              fontWeight: 500,
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
            onMouseEnter={(e) => {
              anime({
                targets: e.target,
                opacity: 1,
                translateY: -2,
                duration: 200,
              })
            }}
            onMouseLeave={(e) => {
              anime({
                targets: e.target,
                opacity: 0.6,
                translateY: 0,
                duration: 200,
              })
            }}
          >
            {link.name}
          </a>
        ))}
      </div>
    </section>
  )
}
