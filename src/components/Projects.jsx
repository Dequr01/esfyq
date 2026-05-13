import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { projects } from '../data/projects'

export default function Projects() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const sectionRef = useRef(null)

  const activeProject = projects[activeIndex]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [hasAnimated])

  const handleNext = () => {
    setDirection(1)
    setActiveIndex((prev) => (prev + 1) % projects.length)
  }

  const handlePrev = () => {
    setDirection(-1)
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length)
  }

  const entranceStyle = (delay, x = 0) => ({
    opacity: hasAnimated ? 1 : 0,
    transform: hasAnimated ? 'translate(0, 0)' : `translate(${x}px, 20px)`,
    transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`
  })

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="w-screen h-screen relative flex flex-col md:flex-row overflow-hidden bg-transparent"
    >
      {/* Left Column: Project Info (40%) */}
      <div 
        style={{
          transform: hasAnimated ? 'translateX(0)' : 'translateX(-40px)',
          opacity: hasAnimated ? 1 : 0,
          transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        className="w-full md:w-[40%] h-full flex flex-col justify-center p-8 md:p-16 z-10 relative bg-black/60 backdrop-blur-3xl border-r border-white/10"
      >
        <div className="flex flex-col gap-8">
          {/* Section Header */}
          <div className="space-y-2">
            <span className="text-white/40 font-mono text-sm tracking-widest uppercase">
              III — THE ARTIFACTS
            </span>
            <h2 className="text-white text-5xl md:text-6xl font-bold tracking-tight">
              Selected Work.
            </h2>
          </div>

          {/* Project Details */}
          <div className="min-h-[300px] flex flex-col justify-center relative">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeIndex}
                custom={direction}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <span className="text-emerald-400 font-mono text-xs uppercase tracking-widest">
                    {activeProject.category}
                  </span>
                  <h3 className="text-white text-5xl font-bold leading-tight">
                    {activeProject.title}
                  </h3>
                </div>

                <p className="text-white/60 text-lg leading-relaxed max-w-md">
                  {activeProject.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {activeProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full border border-white/20 text-white/40 text-xs font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4 pt-4">
                  {activeProject.liveUrl && (
                    <a
                      href={activeProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2 bg-white text-black font-medium rounded-full hover:bg-emerald-400 transition-colors duration-300"
                    >
                      Live Demo
                    </a>
                  )}
                  {activeProject.githubUrl && (
                    <a
                      href={activeProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2 border border-white/30 text-white font-medium rounded-full hover:bg-white/10 transition-colors duration-300"
                    >
                      Source Code
                    </a>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div 
            style={entranceStyle(400)}
            className="flex items-center gap-8 pt-8"
          >
            <div className="flex gap-4">
              <button
                onClick={handlePrev}
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300 group"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:-translate-x-1 transition-transform"
                >
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
              </button>
              <button
                onClick={handleNext}
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300 group"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:translate-x-1 transition-transform"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
            <div className="text-white/20 font-mono text-lg">
              <span className="text-white font-bold">{String(activeIndex + 1).padStart(2, '0')}</span> / {String(projects.length).padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Image Showcase (60%) */}
      <div className="hidden md:block w-[60%] h-full relative overflow-hidden bg-zinc-900">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIndex}
            src={activeProject.image}
            alt={activeProject.title}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ 
              opacity: hasAnimated ? 1 : 0, 
              scale: hasAnimated ? 1 : 1.05 
            }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
          />
        </AnimatePresence>
        {/* Subtle overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      </div>

      {/* Mobile Image Fallback (stacked) */}
      <div className="md:hidden w-full h-[40vh] relative">
        <img
          src={activeProject.image}
          alt={activeProject.title}
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  )
}
