import { useEffect, useRef, useState } from 'react'
import anime from 'animejs'

const techIcons = [
  { src: '/assets/react-icon.svg', alt: 'React', name: 'React' },
  { src: '/assets/dotnet-icon.svg', alt: '.NET', name: '.NET' },
  { src: '/assets/mysql-icon.svg', alt: 'MySQL', name: 'MySQL' },
  { src: '/assets/html-icon.svg', alt: 'HTML', name: 'HTML' },
  { src: '/assets/css-icon.svg', alt: 'CSS', name: 'CSS' },
]

export default function AnimatedTechStack() {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const containerRef = useRef(null)
  const titleRef = useRef(null)
  const iconsRef = useRef(null)
  const iconRefs = useRef([])

  useEffect(() => {
    // Initial animation
    const timeline = anime.timeline({
      easing: 'easeOutExpo',
    })

    timeline
      .add({
        targets: titleRef.current,
        opacity: [0, 1],
        translateY: [-20, 0],
        duration: 600,
        delay: 500,
      })
      .add({
        targets: iconRefs.current,
        opacity: [0, 1],
        scale: [0, 1],
        rotate: [-180, 0],
        duration: 800,
        delay: anime.stagger(100, { start: 300 }),
      })
  }, [])

  const handleMouseEnter = (index, element) => {
    setHoveredIndex(index)
    anime({
      targets: element,
      scale: 1.3,
      rotate: 360,
      translateY: -10,
      duration: 400,
      easing: 'easeOutQuad',
    })
  }

  const handleMouseLeave = (element) => {
    setHoveredIndex(null)
    anime({
      targets: element,
      scale: 1,
      rotate: 0,
      translateY: 0,
      duration: 400,
      easing: 'easeOutQuad',
    })
  }

  return (
    <div
      ref={containerRef}
      className="bg-white/95 rounded-2xl shadow-xl px-6 py-4 flex flex-col items-center backdrop-blur-sm"
      style={{ minWidth: '200px', opacity: 0 }}
    >
      <div
        ref={titleRef}
        className="uppercase font-bold text-gray-800 mb-2 text-right w-full"
        style={{ opacity: 0, transform: 'translateY(-20px)' }}
      >
        TECHNOLOGY STACK
      </div>
      <div
        ref={iconsRef}
        className="flex gap-4 flex-wrap items-center justify-center"
      >
        {techIcons.map((icon, index) => (
          <div
            key={icon.alt}
            ref={(el) => (iconRefs.current[index] = el)}
            onMouseEnter={(e) => handleMouseEnter(index, e.currentTarget)}
            onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
            className="relative group"
            style={{ opacity: 0, transform: 'scale(0) rotate(-180deg)' }}
          >
            <img
              src={icon.src}
              alt={icon.alt}
              className="h-8 w-8 transition-all duration-300"
              style={{
                filter: hoveredIndex === index
                  ? 'drop-shadow(0 0 15px rgba(255,0,0,0.6)) brightness(1.2)'
                  : 'none',
              }}
            />
            {hoveredIndex === index && (
              <div
                className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none"
                style={{ opacity: 0 }}
              >
                {icon.name}
              </div>
            )}
            {hoveredIndex === index && (
              <div
                className="absolute inset-0 rounded-full border-2 border-red-500 pointer-events-none"
                style={{ opacity: 0, transform: 'scale(0)' }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
