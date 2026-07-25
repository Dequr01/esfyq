import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import GlassyCard from '../atoms/GlassyCard'

export default function About() {
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const skills = [
    'Python', 'React', 'TensorFlow Lite', 'OpenCV', 'TailwindCSS',
    'PostgreSQL', 'Hugging Face', 'OSINT', 'AI Prompt Engineering',
    'Vite', 'Git', 'Automation'
  ]

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    },
  }

  return (
    <section
      id="about"
      className={`w-full h-full flex flex-col justify-center ${mobile ? 'p-6 pt-16' : 'p-8 md:p-16'} bg-transparent relative z-10`}
      style={{ maxWidth: '1400px', margin: '0 auto' }}
    >
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className={mobile ? 'mb-6' : 'mb-12'}
      >
        <motion.span
          variants={itemVariants}
          className="text-[var(--accent)] font-mono text-xs uppercase tracking-widest block mb-2"
        >
          II — THE CRAFT
        </motion.span>
        <motion.h2
          variants={itemVariants}
          className={`text-[var(--text)] ${mobile ? 'text-2xl' : 'text-4xl md:text-5xl'} font-bold tracking-tight`}
        >
          The Craft of Creation.
        </motion.h2>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className={`grid grid-cols-1 md:grid-cols-3 ${mobile ? 'gap-4 mb-8' : 'gap-8 mb-16'}`}
      >
        <motion.div variants={itemVariants}>
          <GlassyCard>
            <h3 className="text-[var(--text)] text-xl font-bold mb-4">Who I Am</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed text-sm">
              I'm Esfyq, an AI and Python developer passionate about building intelligent
              solutions. Specialized in machine learning, OSINT automation, and offline AI systems.
            </p>
          </GlassyCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <GlassyCard>
            <h3 className="text-[var(--text)] text-xl font-bold mb-4">What I Do</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed text-sm">
              I specialize in AI model fine-tuning, OSINT automation, offline ML systems, and
              full-stack development. Delivering privacy-first, intelligent applications.
            </p>
          </GlassyCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <GlassyCard>
            <h3 className="text-[var(--text)] text-xl font-bold mb-4">My Approach</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed text-sm">
              I focus on clean, maintainable code with performance-first architecture. Every
              project combines cutting-edge AI capabilities with practical automation.
            </p>
          </GlassyCard>
        </motion.div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="space-y-6"
      >
        <motion.h3
          variants={itemVariants}
          className="text-[var(--text-muted)] font-mono text-[10px] uppercase tracking-[0.3em]"
        >
          Expertise & Stack
        </motion.h3>
        <div className={`flex flex-wrap ${mobile ? 'gap-2' : 'gap-3'}`}>
          {skills.map((skill) => (
            <motion.div
              key={skill}
              variants={itemVariants}
              className={`px-4 py-1.5 bg-[var(--surface)] border border-[var(--border)] backdrop-blur-xl rounded-full text-[var(--text-muted)] ${mobile ? 'text-[10px]' : 'text-xs'} font-medium hover:text-[var(--text)] hover:border-[var(--text-secondary)] transition-all duration-300`}
            >
              {skill}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
