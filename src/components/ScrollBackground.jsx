import { useEffect, useRef } from 'react'
import anime from 'animejs'

/**
 * Scroll-based background animations with morphing shapes
 * Creates a morphic dreams effect with animated blobs
 */
export default function ScrollBackground() {
  const containerRef = useRef(null)
  const blobsRef = useRef([])

  useEffect(() => {
    if (!containerRef.current || typeof anime === 'undefined') return

    const blobs = []
    const blobCount = 5

    // Create morphing blob elements
    for (let i = 0; i < blobCount; i++) {
      const blob = document.createElement('div')
      blob.className = 'morphic-blob'
      const size = 200 + Math.random() * 300
      const x = Math.random() * 100
      const y = Math.random() * 100
      
      blob.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        left: ${x}%;
        top: ${y}%;
        background: radial-gradient(circle, 
          rgba(${120 + Math.random() * 60}, ${80 + Math.random() * 100}, ${200 + Math.random() * 55}, 0.15) 0%,
          rgba(${100 + Math.random() * 80}, ${60 + Math.random() * 120}, ${180 + Math.random() * 75}, 0.05) 50%,
          transparent 100%
        );
        border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
        filter: blur(60px);
        pointer-events: none;
        z-index: -1;
        mix-blend-mode: screen;
      `
      
      containerRef.current.appendChild(blob)
      blobs.push(blob)
    }

    blobsRef.current = blobs

    // Morphing animation
    const morphBlobs = () => {
      blobs.forEach((blob, i) => {
        anime({
          targets: blob,
          borderRadius: [
            `${30 + Math.random() * 40}% ${70 + Math.random() * 30}% ${70 + Math.random() * 30}% ${30 + Math.random() * 40}% / ${30 + Math.random() * 40}% ${30 + Math.random() * 40}% ${70 + Math.random() * 30}% ${70 + Math.random() * 30}%`,
            `${70 + Math.random() * 30}% ${30 + Math.random() * 40}% ${30 + Math.random() * 40}% ${70 + Math.random() * 30}% / ${70 + Math.random() * 30}% ${70 + Math.random() * 30}% ${30 + Math.random() * 40}% ${30 + Math.random() * 40}%`,
          ],
          duration: 8000 + Math.random() * 4000,
          easing: 'easeInOutQuad',
          complete: morphBlobs,
        })
      })
    }

    // Scroll-based parallax
    let scrollY = 0
    const handleScroll = () => {
      scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const scrollProgress = scrollY / (document.documentElement.scrollHeight - windowHeight)

      blobs.forEach((blob, i) => {
        const speed = 0.5 + (i * 0.2)
        const offsetY = scrollY * speed * 0.1
        const scale = 1 + scrollProgress * 0.3
        const opacity = 0.15 - scrollProgress * 0.1

        anime({
          targets: blob,
          translateY: offsetY,
          scale: scale,
          opacity: Math.max(0.05, opacity),
          duration: 100,
          easing: 'easeOutQuad',
        })
      })
    }

    morphBlobs()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      blobs.forEach(blob => blob.remove())
    }
  }, [])

  return <div ref={containerRef} className="scroll-background" />
}

