import { useEffect, useRef, useState } from 'react'
import GlassyCard from './GlassyCard'

export default function About() {
  const [hasAnimated, setHasAnimated] = useState(false)
  const sectionRef = useRef(null)

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
      { threshold: 0.2 }
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

  const skills = [
    'Python', 'React', 'TensorFlow Lite', 'OpenCV', 'TailwindCSS', 
    'PostgreSQL', 'Hugging Face', 'OSINT', 'AI Prompt Engineering', 
    'Vite', 'Git', 'Automation'
  ]

  const entranceStyle = (delay) => ({
    opacity: hasAnimated ? 1 : 0,
    transform: hasAnimated ? 'translateY(0)' : 'translateY(30px)',
    transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`
  })

  return (
    <section
      id="about"
      ref={sectionRef}
      className="w-full h-full flex flex-col justify-center p-8 md:p-16 bg-transparent relative z-10"
      style={{ maxWidth: '1400px', margin: '0 auto' }}
    >
      <div className="mb-12">
        <span 
          style={entranceStyle(0)}
          className="text-[var(--accent)] font-mono text-xs uppercase tracking-widest block mb-4"
        >
          II — THE CRAFT
        </span>
        <h2
          style={entranceStyle(100)}
          className="text-[var(--text)] text-4xl md:text-5xl font-bold tracking-tight"
        >
          The Craft of Creation.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div style={entranceStyle(150)}>
          <GlassyCard>
            <h3 className="text-[var(--text)] text-xl font-bold mb-4">Who I Am</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed text-sm">
              I'm IamCodebreaker, an AI and Python developer passionate about building intelligent
              solutions. Specialized in machine learning, OSINT automation, and offline AI systems.
            </p>
          </GlassyCard>
        </div>

        <div style={entranceStyle(300)}>
          <GlassyCard>
            <h3 className="text-[var(--text)] text-xl font-bold mb-4">What I Do</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed text-sm">
              I specialize in AI model fine-tuning, OSINT automation, offline ML systems, and
              full-stack development. Delivering privacy-first, intelligent applications.
            </p>
          </GlassyCard>
        </div>

        <div style={entranceStyle(450)}>
          <GlassyCard>
            <h3 className="text-[var(--text)] text-xl font-bold mb-4">My Approach</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed text-sm">
              I focus on clean, maintainable code with performance-first architecture. Every
              project combines cutting-edge AI capabilities with practical automation.
            </p>
          </GlassyCard>
        </div>
      </div>

      <div className="space-y-6">
        <h3 
          style={entranceStyle(600)}
          className="text-[var(--text-muted)] font-mono text-[10px] uppercase tracking-[0.3em]"
        >
          Expertise & Stack
        </h3>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill, index) => (
            <div
              key={skill}
              style={entranceStyle(700 + (index * 50))}
              className="px-5 py-2 bg-[var(--surface)] border border-[var(--border)] backdrop-blur-xl rounded-full text-[var(--text-muted)] text-xs font-medium hover:text-[var(--text)] hover:border-[var(--text-secondary)] transition-all duration-300"
            >
              {skill}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
