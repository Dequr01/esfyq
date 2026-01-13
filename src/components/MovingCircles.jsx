import { useEffect, useRef } from 'react'

/**
 * MovingCircles
 * - Renders large translucent circles that subtly follow the mouse with inertia.
 * - Uses translate3d for GPU acceleration and slight scaling/blur for depth.
 * - Non-interactive overlay (pointer-events: none).
 */
export default function MovingCircles() {
  const rafRef = useRef(0)
  const mouseRef = useRef({ x: 0, y: 0 }) // normalized -1..1
  const circlesRef = useRef([
    { el: null, pos: { x: 0, y: 0 }, factor: 0.25, size: 520, blur: 24, opacity: 0.35 },
    { el: null, pos: { x: 0, y: 0 }, factor: 0.35, size: 380, blur: 18, opacity: 0.30 },
    { el: null, pos: { x: 0, y: 0 }, factor: 0.45, size: 280, blur: 12, opacity: 0.25 },
  ])

  useEffect(() => {
    const handleMouse = (e) => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const nx = (e.clientX / vw) * 2 - 1
      const ny = (e.clientY / vh) * 2 - 1
      mouseRef.current.x = nx
      mouseRef.current.y = ny
    }

    window.addEventListener('mousemove', handleMouse)

    // Intro rise-from-bottom animation
    const start = performance.now()
    const introDuration = 900
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

    const animate = () => {
      const { x: nx, y: ny } = mouseRef.current
      const maxOffset = Math.min(window.innerWidth, window.innerHeight) * 0.12

      // progress 0..1
      const t = Math.min(1, (performance.now() - start) / introDuration)
      const intro = easeOutCubic(t)
      const extraRise = (1 - intro) * window.innerHeight * 0.35

      circlesRef.current.forEach((c, idx) => {
        // Target position biased toward top-right quadrant like the reference
        const targetX = nx * maxOffset * c.factor + maxOffset * 0.8
        const targetY = ny * maxOffset * c.factor - maxOffset * 0.5

        // Lerp current position toward target
        c.pos.x += (targetX - c.pos.x) * 0.06
        c.pos.y += (targetY - c.pos.y) * 0.06

        if (c.el) {
          const depthScale = 1 + (idx * 0.03)
          c.el.style.transform = `translate3d(${c.pos.x}px, ${c.pos.y + extraRise}px, 0) scale(${depthScale})`
          c.el.style.opacity = String(c.opacity * intro)
        }
      })

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', handleMouse)
    }
  }, [])

  return (
    <div
      className="pointer-events-none fixed inset-0 z-20"
      aria-hidden="true"
      style={{ overflow: 'hidden' }}
    >
      {circlesRef.current.map((c, i) => (
        <div
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          ref={(el) => { circlesRef.current[i].el = el }}
          className="absolute rounded-full"
          style={{
            width: c.size,
            height: c.size,
            right: '-10vw',
            top: i === 0 ? '-5vh' : i === 1 ? '8vh' : '20vh',
            background: 'radial-gradient(ellipse at center, rgba(255,0,0,0.35), rgba(255,0,0,0.0) 60%)',
            boxShadow: '0 20px 60px rgba(255,0,0,0.12), inset 0 0 100px rgba(255,0,0,0.12)',
            filter: `blur(${c.blur}px)`,
            opacity: 0,
            mixBlendMode: 'screen',
            transform: 'translate3d(0,0,0)',
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  )
}
