import { useEffect, useRef, useState } from 'react'

/**
 * MagneticButton
 * - A pill-shaped CTA that is attracted toward the cursor within a bounded radius.
 * - Transform-only translation so it doesn't affect layout.
 * - Accessible: works as a button or link (use href prop to render as anchor).
 */
export default function MagneticButton({
  children = 'Contact me',
  maxOffset = 20,
  radius = 100,
  href = '#',
}) {
  const ref = useRef(null)
  const rafRef = useRef(0)
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })
  const [isHover, setIsHover] = useState(false)

  useEffect(() => {
    const handleMove = (e) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      // Cursor relative to button center
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.hypot(dx, dy)

      if (dist < radius) {
        // Attract toward cursor but clamp to maxOffset
        const nx = (dx / dist) || 0
        const ny = (dy / dist) || 0
        const mag = Math.min(maxOffset, (radius - dist) / radius * maxOffset)
        target.current.x = nx * mag
        target.current.y = ny * mag
        setIsHover(true)
      } else {
        target.current.x = 0
        target.current.y = 0
        setIsHover(false)
      }
    }

    const handleLeave = () => {
      target.current.x = 0
      target.current.y = 0
      setIsHover(false)
    }

    const animate = () => {
      // Smooth follow spring
      current.current.x += (target.current.x - current.current.x) * 0.12
      current.current.y += (target.current.y - current.current.y) * 0.12
      if (ref.current) {
        ref.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`
      }
      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseleave', handleLeave)
    rafRef.current = requestAnimationFrame(animate)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseleave', handleLeave)
      cancelAnimationFrame(rafRef.current)
    }
  }, [maxOffset, radius])

  const className = [
    'inline-flex items-center justify-center',
    'px-5 py-2 rounded-full',
    'min-h-[44px] min-w-[44px]', // ensure accessible tap targets on mobile/tablet
    'text-sm sm:text-base',
    'bg-red-700/90 hover:bg-red-600 text-white',
    'shadow-[0_10px_30px_rgba(255,0,0,0.35)]',
    'backdrop-blur-sm',
    'transition-colors duration-200',
    'select-none cursor-pointer',
    'will-change-transform',
    'relative',
  ].join(' ')

  const innerGlow = isHover
    ? 'shadow-[inset_0_0_20px_rgba(255,255,255,0.35)]'
    : 'shadow-[inset_0_0_12px_rgba(255,255,255,0.15)]'

  return href ? (
    <a
      ref={ref}
      href={href}
      className={`${className} ${innerGlow}`}
      aria-label="Contact me"
    >
      {children}
      <span
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(120% 120% at 30% 20%, rgba(255,255,255,0.35), rgba(255,255,255,0) 60%)',
          mixBlendMode: 'screen',
        }}
      />
    </a>
  ) : (
    <button
      ref={ref}
      type="button"
      className={`${className} ${innerGlow}`}
      aria-label="Contact me"
    >
      {children}
      <span
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(120% 120% at 30% 20%, rgba(255,255,255,0.35), rgba(255,255,255,0) 60%)',
          mixBlendMode: 'screen',
        }}
      />
    </button>
  )
}
