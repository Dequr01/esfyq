import { useEffect, useRef } from 'react'
import anime from 'animejs'

/**
 * Marquee text animation for mobile
 * Slides text in and out of screen on small devices
 */
export default function MarqueeText({ children, className = '' }) {
  const containerRef = useRef(null)
  const textRef = useRef(null)
  const isMobile = window.innerWidth < 768

  useEffect(() => {
    if (!isMobile || !containerRef.current || !textRef.current || typeof anime === 'undefined') {
      return
    }

    const container = containerRef.current
    const text = textRef.current
    const containerWidth = container.offsetWidth
    const textWidth = text.scrollWidth

    if (textWidth <= containerWidth) return

    // Clone text for seamless loop
    const clone = text.cloneNode(true)
    clone.style.marginLeft = '2rem'
    container.appendChild(clone)

    const totalWidth = textWidth + 2 * 16 // margin

    // Continuous marquee animation
    const animate = () => {
      anime({
        targets: container,
        translateX: [-totalWidth, 0],
        duration: (totalWidth / 50) * 1000, // 50px per second
        easing: 'linear',
        complete: animate,
      })
    }

    animate()

    return () => {
      if (clone.parentNode) {
        clone.parentNode.removeChild(clone)
      }
    }
  }, [isMobile])

  if (!isMobile) {
    return <span className={className}>{children}</span>
  }

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        width: '100%',
      }}
    >
      <span ref={textRef} className={className}>
        {children}
      </span>
    </div>
  )
}

