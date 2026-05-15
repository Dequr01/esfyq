import { useEffect, useRef, useState } from 'react'
import GlassyCard from './GlassyCard'

export default function Contact() {
  const [hasAnimated, setHasAnimated] = useState(false)
  const [mobile, setMobile] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const sectionRef = useRef(null)

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

  const entranceStyle = (delay) => ({
    opacity: hasAnimated ? 1 : 0,
    transform: hasAnimated ? 'translateY(0)' : 'translateY(20px)',
    transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`
  })

  return (
    <section
      id="contact"
      ref={sectionRef}
      className={`w-full h-full flex flex-col justify-center items-center ${mobile ? 'p-6 pt-24' : 'p-8'} bg-transparent relative z-10`}
      style={{ maxWidth: '600px', margin: '0 auto' }}
    >
      <div
        style={entranceStyle(0)}
        className="w-full text-center mb-10"
      >
        <span className="text-[var(--accent)] font-mono text-xs uppercase tracking-widest block mb-4">
          IV — THE CONNECTION
        </span>
        <h2 className={`text-[var(--text)] ${mobile ? 'text-3xl' : 'text-4xl md:text-5xl'} font-bold tracking-tight mb-4`}>
          Get in Touch.
        </h2>
        <p className="text-[var(--text-muted)] text-sm max-w-xs mx-auto">
          Every story has a beginning. Let's write the next chapter of yours.
        </p>
      </div>

      <div
        style={entranceStyle(200)}
        className="w-full"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <GlassyCard className="p-6 space-y-4">
            <div style={entranceStyle(300)}>
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
            </div>

            <div style={entranceStyle(400)}>
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
            </div>

            <div style={entranceStyle(500)}>
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
            </div>

            <button
              type="submit"
              style={entranceStyle(600)}
              className="w-full py-4 bg-[var(--text)] text-[var(--bg)] font-bold rounded-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 disabled:opacity-50"
              disabled={submitted}
            >
              {submitted ? '✓ Message Sent' : 'Send Message'}
            </button>
          </GlassyCard>
        </form>
      </div>

      <div
        style={entranceStyle(700)}
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
      </div>
    </section>
  )
}
