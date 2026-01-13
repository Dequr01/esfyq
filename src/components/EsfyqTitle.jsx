import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function EsfyqTitle() {
  const ref = useRef(null)
  const titleRef = useRef(null)
  const rafRef = useRef(0)
  const target = useRef({ rx: 0, ry: 0 })
  const current = useRef({ rx: 0, ry: 0 })

  useEffect(() => {
    // GSAP text reveal animation
    if (titleRef.current) {
      const text = 'ESFYQ'
      const chars = text.split('')
      titleRef.current.innerHTML = ''
      
      chars.forEach((char) => {
        const span = document.createElement('span')
        span.textContent = char === ' ' ? '\u00A0' : char
        span.style.display = 'inline-block'
        span.style.opacity = '0'
        span.style.transform = 'translateY(50px) rotateX(90deg)'
        titleRef.current?.appendChild(span)
      })

      // Add cursor after text
      const cursorSpan = document.createElement('span')
      cursorSpan.className = 'cursor text-white/60'
      cursorSpan.textContent = '_'
      cursorSpan.style.display = 'inline-block'
      titleRef.current?.appendChild(cursorSpan)

      const charSpans = titleRef.current.querySelectorAll('span:not(.cursor)')
      gsap.to(charSpans, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.6,
        stagger: 0.03,
        ease: 'back.out(1.7)',
        delay: 0.5,
      })

      // Continuous cursor blink
      gsap.to(cursorSpan, {
        opacity: 0,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
        delay: 1.5,
      })
    }
  }, [])

  useEffect(() => {
    const onMove = (e) => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const nx = (e.clientX / vw) * 2 - 1
      const ny = (e.clientY / vh) * 2 - 1
      target.current.ry = nx * 5
      target.current.rx = -ny * 3
    }

    const animate = () => {
      current.current.rx += (target.current.rx - current.current.rx) * 0.08
      current.current.ry += (target.current.ry - current.current.ry) * 0.08
      if (ref.current) {
        ref.current.style.transform = `
          translate3d(0, 0, 0)
          rotateX(${current.current.rx}deg)
          rotateY(${current.current.ry}deg)
        `
      }
      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove)
    rafRef.current = requestAnimationFrame(animate)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div className="w-full flex flex-col items-start justify-start gap-4">
      <h1
        ref={ref}
        className="font-extrabold leading-none text-white/60 text-[clamp(48px,12vw,400px)] drop-shadow-[0_18px_40px_rgba(255,0,80,0.25)] select-none text-left"
        aria-label="ESFYQ brand"
      >
        <span ref={titleRef}></span>
      </h1>
    </div>
  )
}
