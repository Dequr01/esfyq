import { useEffect, useRef, useState } from 'react'
import anime from 'animejs'

/**
 * Container that stacks sections in 3D space and handles scroll-triggered transitions
 * Sections slide down and reveal the next section from behind as user scrolls.
 * 
 * Usage:
 * Wrap main page sections (Hero, About, Projects, Contact) inside this component.
 */
export default function StackedSectionsContainer({ children }) {
  const containerRef = useRef(null)
  const [currentSection, setCurrentSection] = useState(0)
  const sectionsCount = Array.isArray(children) ? children.length : 1

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let ticking = false

    const handleResize = () => {
      // Recalculate current section on resize
      const scrollY = window.scrollY || window.pageYOffset
      const viewportHeight = window.innerHeight
      const newSectionIndex = Math.min(
        sectionsCount - 1,
        Math.floor(scrollY / viewportHeight)
      )
      setCurrentSection(newSectionIndex)
    }

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY || window.pageYOffset
          const viewportHeight = window.innerHeight

          // Calculate current section index based on scroll position
          const newSectionIndex = Math.min(
            sectionsCount - 1,
            Math.floor(scrollY / viewportHeight)
          )

          setCurrentSection(newSectionIndex)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })

    // Initialize scroll position and current section
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [sectionsCount])

  return (
    <div
      ref={containerRef}
      style={{
        perspective: '1500px',
        height: '100vh',
        overflowX: 'hidden',
        overflowY: 'scroll',
        scrollSnapType: 'y mandatory',
      }}
    >
      {Array.isArray(children)
        ? children.map((child, index) => {
            // Calculate offset for stacking effect
            const offset = index - currentSection

            // Calculate transform styles for stack effect
            const translateY = offset * 100 + (offset === 0 ? 0 : 10)
            const translateZ = -offset * 150 // Section depth stacking (z-axis)

            const opacity = offset < 0 ? 0 : 1

            return (
              <section
                key={index}
                style={{
                  position: 'relative',
                  height: '100vh',
                  width: '100%',
                  scrollSnapAlign: 'start',
                  transform: `translateY(${translateY}vh) translateZ(${translateZ}px)`,
                  transition: 'transform 0.8s ease, opacity 0.8s ease',
                  opacity,
                  pointerEvents: offset === 0 ? 'auto' : 'none',
                  zIndex: sectionsCount - index,
                }}
              >
                {child}
              </section>
            )
          })
        : (
          <section
            style={{
              position: 'relative',
              height: '100vh',
              width: '100%',
              scrollSnapAlign: 'start',
              transform: 'translateY(0) translateZ(0)',
            }}
          >
            {children}
          </section>
        )
      }
    </div>
  )
}
