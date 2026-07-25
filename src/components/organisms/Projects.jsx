import { useRef, useState, useEffect } from 'react'
import { motion, useReducedMotion, AnimatePresence } from 'motion/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '../../data/projects'
import { X } from 'lucide-react'

// ---------------------------------------------------------------------------
// ProjectLinks — renders the correct link state based on project.linkStatus.
// Rules:
//   confidential → grey "Case study coming soon" label, no href
//   coming-soon  → grey "Coming soon" label, no href
//   source-only  → only Source link rendered
//   live         → Live Demo + optional Source link
//   default      → falls back to rendering whatever URLs exist
// ---------------------------------------------------------------------------
function ProjectLinks({ project, compact = false }) {
  const btnBase = compact
    ? 'text-xs font-medium transition-colors'
    : 'px-6 py-3 font-semibold rounded-lg transition-colors text-sm'
  const liveBtn = compact ? `${btnBase} text-white hover:text-[var(--accent)]` : `${btnBase} bg-white text-black hover:bg-white/90`
  const sourceBtn = compact ? `${btnBase} text-white/50 hover:text-white` : `${btnBase} bg-white/10 text-white hover:bg-white/20`
  const disabledBtn = `${btnBase} text-white/30 cursor-default pointer-events-none`

  if (project.linkStatus === 'confidential') {
    return <span className={disabledBtn}>🔒 Case study coming soon</span>
  }
  if (project.linkStatus === 'coming-soon') {
    return <span className={disabledBtn}>⏳ Store links coming soon</span>
  }
  if (project.linkStatus === 'source-only') {
    return project.githubUrl ? (
      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={sourceBtn}>↗ Source Code</a>
    ) : null
  }
  // live or default
  return (
    <>
      {project.liveUrl && (
        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={liveBtn}>
          ↗ Live Demo
        </a>
      )}
      {project.githubUrl && (
        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={sourceBtn}>
          ↗ Source
        </a>
      )}
    </>
  )
}

// Note: We use a deterministic pseudo-random function so re-renders don't jump
const pseudoRandom = (seed) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export default function Projects() {
  const sectionRef = useRef(null)
  const gridRef = useRef(null)
  const cardsRef = useRef([])
  const prefersReducedMotion = useReducedMotion()
  
  const [selectedProject, setSelectedProject] = useState(null)
  const [isMobile, setIsMobile] = useState(false)

  // Check mobile on mount
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger)

    // Bypass if reduced motion or mobile
    if (prefersReducedMotion || isMobile) return

    const scroller = document.querySelector('.scroll-container')
    if (!scroller) return

    // Context for easy cleanup
    const ctx = gsap.context(() => {
      // 1. Initial Scattered State
      cardsRef.current.forEach((card, i) => {
        if (!card) return
        const seed = i * 1337
        // Scatter in a wide radius
        const angle = pseudoRandom(seed) * Math.PI * 2
        const radius = 600 + pseudoRandom(seed + 1) * 400
        const startX = Math.cos(angle) * radius
        const startY = Math.sin(angle) * radius
        const startRot = (pseudoRandom(seed + 2) - 0.5) * 180

        gsap.set(card, {
          x: startX,
          y: startY,
          rotationZ: startRot,
          scale: 0.2,
          opacity: 0,
        })
      })

      // 2. Convergence Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          scroller: scroller,
          trigger: scroller, // Tie to the vertical scroller's scroll position
          // Since our ScrollHorizontal pauses at 200vh (2/5th) and resumes at 400vh (4/5th),
          // we scrub during this exact window.
          start: "200vh top", 
          end: "400vh top",
          scrub: 1, // Smooth scrub
        }
      })

      // Stagger cards into their final positions (x:0, y:0)
      tl.to(cardsRef.current, {
        x: 0,
        y: 0,
        rotationZ: 0,
        scale: 1,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: "power2.out",
      })

    }, sectionRef)

    // Ensure ScrollTrigger updates its calculations
    ScrollTrigger.refresh()

    return () => {
      ctx.revert()
    }
  }, [prefersReducedMotion, isMobile])

  // Focus trap and body lock for modal
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden'
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setSelectedProject(null)
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => {
        document.body.style.overflow = ''
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [selectedProject])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="w-full h-full relative flex flex-col justify-center p-6 md:p-16 bg-transparent z-10"
      style={{ maxWidth: '1400px', margin: '0 auto' }}
    >
      <div className="w-full h-full flex flex-col pt-12 md:pt-0 pointer-events-none">
        
        {/* Section Header */}
        <div className="mb-8 md:mb-12 shrink-0 pointer-events-auto">
          <span className="text-[var(--accent)] font-mono text-xs uppercase tracking-widest block mb-2">
            III — THE ARTIFACTS
          </span>
          <h2 className="text-[var(--text)] text-3xl md:text-5xl font-bold tracking-tight">
            Selected Work.
          </h2>
        </div>

        {/* Project Grid */}
        <div 
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 h-full max-h-[80vh] overflow-y-auto md:overflow-visible pb-24 md:pb-0 hide-scrollbar pointer-events-auto"
        >
          {projects.map((project, index) => (
            <div
              key={project.id}
              ref={el => cardsRef.current[index] = el}
              className="w-full h-full cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              <div className="flex flex-col h-full bg-black/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md group transition-colors hover:border-white/30">
                
                {/* Image / Placeholder */}
                <div className="relative h-48 md:h-64 w-full overflow-hidden flex items-center justify-center">
                  {project.image ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                      style={{ backgroundImage: `url(${project.image})` }}
                    />
                  ) : (
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center gap-2"
                      style={{ background: project.imagePlaceholder?.color ?? '#111' }}
                    >
                      <span className="font-mono text-xs text-white/30 uppercase tracking-widest border border-dashed border-white/20 px-4 py-2 rounded-lg">
                        {project.imagePlaceholder?.label ?? 'Screenshot pending'}
                      </span>
                      <span className="font-mono text-[10px] text-white/20">⚠ Real capture needed before launch</span>
                    </div>
                  )}
                  {project.image && (
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-500" />
                  )}

                  {/* Project Category Tag */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[var(--accent)] font-mono text-[10px] uppercase tracking-widest">
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* Content Container */}
                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <h3 className="text-white text-2xl font-bold mb-3 tracking-tight">
                    {project.title}
                  </h3>
                  
                  <p className="text-white/60 text-sm leading-relaxed mb-6 flex-grow">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white/50 text-[10px] font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Link row */}
                  <div className="flex gap-4 mt-auto pt-4 border-t border-white/10">
                    <ProjectLinks project={project} compact />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal / Backdrop */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
            {/* Blur Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-xl"
              onClick={() => setSelectedProject(null)}
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95, y: prefersReducedMotion ? 0 : 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95, y: prefersReducedMotion ? 0 : 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto"
              onClick={e => e.stopPropagation()} // Prevent closing when clicking modal
            >
              {/* Header Image / Placeholder */}
              <div className="relative h-64 w-full shrink-0 flex items-center justify-center overflow-hidden">
                {selectedProject.image ? (
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${selectedProject.image})` }}
                  />
                ) : (
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-2"
                    style={{ background: selectedProject.imagePlaceholder?.color ?? '#111' }}
                  >
                    <span className="font-mono text-xs text-white/30 uppercase tracking-widest border border-dashed border-white/20 px-4 py-2 rounded-lg">
                      {selectedProject.imagePlaceholder?.label ?? 'Screenshot pending'}
                    </span>
                    <span className="font-mono text-[10px] text-white/20">⚠ Real capture needed before launch</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
                
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 backdrop-blur-md rounded-full text-white/70 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-8 md:p-10 overflow-y-auto hide-scrollbar">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                  <div>
                    <span className="text-[var(--accent)] font-mono text-sm uppercase tracking-widest block mb-2">
                      {selectedProject.category} • {selectedProject.year}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                      {selectedProject.title}
                    </h2>
                  </div>
                  
                  <div className="flex gap-4 shrink-0">
                    <ProjectLinks project={selectedProject} />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-10">
                  {selectedProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-white/70 text-xs font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="prose prose-invert max-w-none">
                  <h3 className="text-xl text-white font-semibold mb-4">Case Study</h3>
                  <p className="text-white/70 leading-relaxed text-lg mb-6">
                    {selectedProject.caseStudy || selectedProject.description}
                  </p>
                  {/* Additional space for future extended writeup */}
                  <div className="h-32 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center mt-8">
                    <span className="text-white/30 font-mono text-sm">Extended case study content placeholder</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  )
}
