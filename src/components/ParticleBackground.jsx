import { useEffect, useRef, useState } from 'react'

/**
 * ParticleBackground
 * - Creates floating particles that respond to mouse movement
 * - Lightweight and performant
 */
export default function ParticleBackground() {
  const containerRef = useRef(null)
  const [particles, setParticles] = useState([])
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const rafRef = useRef(0)

  useEffect(() => {
    const particleCount = 25
    const newParticles = []

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.2,
        color: Math.random() > 0.5 ? 'rgba(255,0,0,0.6)' : 'rgba(255,255,255,0.4)',
      })
    }

    setParticles(newParticles)

    // Mouse tracking
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    // Animation loop
    const animate = () => {
      setParticles((prevParticles) => {
        return prevParticles.map((particle) => {
          let { x, y, speedX, speedY } = particle

          // Update position
          x += speedX
          y += speedY

          // Mouse attraction
          const dx = mouseRef.current.x - x
          const dy = mouseRef.current.y - y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const maxDistance = 150

          if (distance < maxDistance && distance > 0) {
            const force = (maxDistance - distance) / maxDistance
            x += (dx / distance) * force * 0.3
            y += (dy / distance) * force * 0.3
          }

          // Boundary wrapping
          if (x < 0) x = window.innerWidth
          if (x > window.innerWidth) x = 0
          if (y < 0) y = window.innerHeight
          if (y > window.innerHeight) y = 0

          return { ...particle, x, y }
        })
      })

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    // Handle resize
    const handleResize = () => {
      setParticles((prevParticles) =>
        prevParticles.map((p) => ({
          ...p,
          x: Math.min(p.x, window.innerWidth),
          y: Math.min(p.y, window.innerHeight),
        }))
      )
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-5 pointer-events-none"
      aria-hidden="true"
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full pointer-events-none transition-transform duration-75 ease-linear"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `radial-gradient(circle, ${particle.color}, transparent)`,
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            transform: `translate(${particle.x}px, ${particle.y}px)`,
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  )
}

