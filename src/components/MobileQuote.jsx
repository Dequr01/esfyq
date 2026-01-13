import { useState, useEffect, useRef } from 'react'

export default function MobileQuote() {
  const [active, setActive] = useState(false)
  const [position, setPosition] = useState({ x: 0, direction: 'right' })
  const quoteRef = useRef(null)
  const containerRef = useRef(null)
  const animationRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // Handle animation
  useEffect(() => {
    if (!isMobile || !quoteRef.current || !containerRef.current) return
    
    const animate = () => {
      if (!quoteRef.current || !containerRef.current) return
      
      const quoteWidth = quoteRef.current.offsetWidth
      const containerWidth = containerRef.current.offsetWidth
      
      // Only animate if quote is wider than container
      if (quoteWidth <= containerWidth) {
        setPosition({ x: 0, direction: 'right' })
        animationRef.current = requestAnimationFrame(animate)
        return
      }
      
      // Update position based on direction
      if (position.direction === 'right') {
        const newX = position.x - 0.5
        const minX = -(quoteWidth - containerWidth)
        
        if (newX <= minX) {
          // Change direction when reaching left edge
          setPosition({ x: minX, direction: 'left' })
        } else {
          setPosition({ x: newX, direction: 'right' })
        }
      } else {
        const newX = position.x + 0.5
        
        if (newX >= 0) {
          // Change direction when reaching right edge
          setPosition({ x: 0, direction: 'right' })
        } else {
          setPosition({ x: newX, direction: 'left' })
        }
      }
      
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animationRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isMobile, position])

  // Reset position when switching between mobile and desktop
  useEffect(() => {
    setPosition({ x: 0, direction: 'right' })
  }, [isMobile])

  return (
    <div
      ref={containerRef}
      className="fixed left-4 sm:left-8 top-400 sm:top-24 z-20 p-4 sm:p-0 max-w-[90vw] md:max-w-3xl overflow-hidden"
      style={{
        paddingLeft: 'calc(env(safe-area-inset-left, 0px) + 1rem)',
        paddingRight: 'calc(env(safe-area-inset-right, 0px) + 0rem)',
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 1rem)',
      }}
    >
      <h1
        ref={quoteRef}
        className={[
          'text-left',
          'whitespace-nowrap', // keep single line on mobile for marquee sliding
          'text-[clamp(16px,4.8vw,22px)] sm:text-[clamp(18px,3.8vw,26px)]',
          'leading-tight',
          'font-extrabold',
          'tracking-wide',
          'text-white',
          'transition-all duration-500',
          'animate-fade-in-left',
          'cursor-pointer select-none',
          'drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]',
        ].join(' ')}
        style={{
          transform: isMobile ? `translateX(${position.x}px)` : 'none',
          transition: isMobile ? 'none' : 'transform 0.5s ease',
        }}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        onTouchStart={() => setActive((v) => !v)}
        role="button"
        aria-label="Inspirational quote"
      >
        <span
          aria-hidden="true"
          className="inline-block align-[0.08em] mr-2 select-none pointer-events-none text-white/90"
          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.35)', fontSize: '1em' }}
        >
          “
        </span>
        <span className="uppercase">
          EVERY SKILL YOU ACQUIRE <span className="text-emerald-300 drop-shadow-[0_0_10px_rgba(16,185,129,0.6)]">DOUBLES</span> YOUR ODDS OF SUCCESS
        </span>
        <span
          aria-hidden="true"
          className="inline-block align-[0.08em] ml-2 select-none pointer-events-none text-white/90"
          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.35)', fontSize: '1em' }}
        >
          ”
        </span>
        <span className="ml-2 text-white/95 tracking-widest font-semibold">SCOTT ADAMS</span>
      </h1>
    </div>
  )
}
