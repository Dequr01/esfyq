import { useEffect, useState, useRef } from 'react'

// Ring class to manage each ring's properties and movement
class Ring {
  constructor(x, y, size, speed, color, maxWidth, maxHeight) {
    this.x = x
    this.y = y
    this.size = size
    this.originalSize = size
    this.speed = {
      x: (Math.random() - 0.5) * speed,
      y: (Math.random() - 0.5) * speed
    }
    this.color = color
    this.maxWidth = maxWidth
    this.maxHeight = maxHeight
    this.opacity = Math.random() * 0.06 + 0.04 // Softer opacity between 0.04 and 0.10
  }

  update(mouseX, mouseY) {
    // Move the ring
    this.x += this.speed.x
    this.y += this.speed.y

    // Bounce off the edges
    if (this.x - this.size < 0 || this.x + this.size > this.maxWidth) {
      this.speed.x = -this.speed.x
    }
    if (this.y - this.size < 0 || this.y + this.size > this.maxHeight) {
      this.speed.y = -this.speed.y
    }

    // Move away from cursor
    const dx = mouseX - this.x
    const dy = mouseY - this.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    const repelRange = 220
    if (distance < repelRange) {
      const repelFactor = (1 - distance / repelRange) * 2
      this.x -= (dx / distance) * repelFactor
      this.y -= (dy / distance) * repelFactor
      
      // Slightly shrink when near cursor
      this.size = this.originalSize * (0.8 + 0.2 * (distance / repelRange))
    } else {
      // Return to original size
      this.size = this.originalSize
    }
  }

  draw(ctx) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(${this.color}, ${this.opacity})`
    ctx.lineWidth = 1
    ctx.stroke()
  }
}

export default function BouncingRings() {
  const canvasRef = useRef(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const ringsRef = useRef([])
  const animationRef = useRef(null)

  // Initialize rings
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      
      // Create new rings when resized - more rings for a denser effect
      const numRings = Math.min(18, Math.max(8, Math.floor(window.innerWidth / 90)))
      
      ringsRef.current = []
      for (let i = 0; i < numRings; i++) {
        const size = Math.random() * 40 + 30 // Random size between 30 and 70
        const x = Math.random() * (canvas.width - size * 2) + size
        const y = Math.random() * (canvas.height - size * 2) + size
        const speed = Math.random() * 0.9 + 0.3 // Random speed between 0.3 and 1.2
        const color = '255, 255, 255' // White rings
        
        ringsRef.current.push(new Ring(x, y, size, speed, color, canvas.width, canvas.height))
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      ringsRef.current.forEach(ring => {
        ring.update(mousePosition.x, mousePosition.y)
        ring.draw(ctx)
      })
      
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [mousePosition])

  return (
    <canvas 
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-10"
    />
  )
}
