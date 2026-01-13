import { useEffect, useState, useRef } from 'react'

export default function GlassCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const cursorRef = useRef(null)

  useEffect(() => {
    // Add CSS to hide the default cursor - with stronger specificity for Safari
    const style = document.createElement('style')
    style.textContent = `
      html, body, a, button, [role="button"], div, span, p, h1, h2, h3, h4, h5, h6, input, textarea, select, label, img, svg, path, circle, rect, line, polyline, polygon {
        cursor: none !important;
      }
      * {
        cursor: none !important;
      }
    `
    document.head.appendChild(style)

    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY })
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    const handleMouseEnter = () => {
      setIsVisible(true)
    }

    window.addEventListener('mousemove', updatePosition)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      window.removeEventListener('mousemove', updatePosition)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.head.removeChild(style)
    }
  }, [isVisible])

  // Hide on mobile/touch devices
  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouchDevice) {
      setIsVisible(false)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className={`fixed pointer-events-none z-50 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
        width: '40px', // 20px radius per spec
        height: '40px',
        mixBlendMode: 'difference', // Makes it look more amorphous
        backdropFilter: 'blur(8px) contrast(0.8) hue-rotate(30deg)',
        WebkitBackdropFilter: 'blur(8px) contrast(0.8) hue-rotate(30deg)',
        background: 'rgba(255, 255, 255, 0.15)',
        borderRadius: '50%',
        boxShadow: '0 0 20px rgba(255, 255, 255, 0.15)',
      }}
    />
  )
}
