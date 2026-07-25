import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import GlassyCard from '../atoms/GlassyCard'

export default function Contact() {
  const [mobile, setMobile] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const checkMobile = () => setMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' })
      setSubmitted(false)
    }, 2000)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <section
      id="contact"
      className={`w-full h-full flex flex-col justify-center items-center ${mobile ? 'p-6 pt-24' : 'p-8'} bg-transparent relative z-10`}
      style={{ maxWidth: '600px', margin: '0 auto' }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="w-full text-center mb-10"
      >
        <motion.span variants={itemVariants} className="text-[var(--accent)] font-mono text-xs uppercase tracking-widest block mb-4">
          IV — THE CONNECTION
        </motion.span>
        <motion.h2 variants={itemVariants} className={`text-[var(--text)] ${mobile ? 'text-3xl' : 'text-4xl md:text-5xl'} font-bold tracking-tight mb-4`}>
          Get in Touch.
        </motion.h2>
        <motion.p variants={itemVariants} className="text-[var(--text-muted)] text-sm max-w-xs mx-auto">
          Every story has a beginning. Let's write the next chapter of yours.
        </motion.p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="w-full"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <GlassyCard className="p-6 space-y-4">
            <motion.div variants={itemVariants}>
              <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--text)] text-sm focus:border-[var(--text-muted)] outline-none transition-all duration-300"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--text)] text-sm focus:border-[var(--text-muted)] outline-none transition-all duration-300"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me about your project..."
                required
                rows={4}
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--text)] text-sm focus:border-[var(--text-muted)] outline-none transition-all duration-300 resize-none"
              />
            </motion.div>

            <motion.button
              type="submit"
              variants={itemVariants}
              className="w-full py-4 bg-[var(--text)] text-[var(--bg)] font-bold rounded-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 disabled:opacity-50"
              disabled={submitted}
            >
              {submitted ? '✓ Message Sent' : 'Send Message'}
            </motion.button>
          </GlassyCard>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        viewport={{ once: true }}
        className="flex gap-6 mt-8"
      >
        {['GitHub', 'LinkedIn', 'Twitter'].map((social) => (
          <a
            key={social}
            href="#"
            className="text-[var(--text-muted)] text-[10px] font-mono uppercase tracking-[0.2em] hover:text-[var(--text)] transition-colors duration-300"
          >
            {social}
          </a>
        ))}
      </motion.div>
    </section>
  )
}
