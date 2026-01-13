import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function Quote() {
  const quoteRef = useRef(null)
  const wordRefs = useRef([])

  useEffect(() => {
    if (!quoteRef.current) return

    const words = quoteRef.current.querySelectorAll('.word')
    wordRefs.current = Array.from(words)

    // Animate words sequentially with stagger
    gsap.fromTo(
      wordRefs.current,
      {
        opacity: 0,
        y: 30,
        rotationX: -90,
      },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: 'power3.out',
        delay: 0.3,
      }
    )

    // Continuous subtle glow animation on "DOUBLES"
    const doublesWord = quoteRef.current.querySelector('.doubles-word')
    if (doublesWord) {
      gsap.to(doublesWord, {
        filter: 'brightness(1.3)',
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    }
  }, [])

  const quoteText = 'EVERY SKILL YOU ACQUIRE DOUBLES YOUR ODDS OF SUCCESS'
  const words = quoteText.split(' ')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full flex items-start justify-start"
    >
      <div className="max-w-2xl w-full">
        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-2">
            <motion.span
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
              className="text-[80px] md:text-[120px] text-red-600 font-black leading-none -mt-4 -ml-2 select-none"
            >
              "
            </motion.span>
            <div ref={quoteRef}>
              <span
                className="block text-white font-extrabold text-[clamp(24px,4vw,38px)] leading-tight mb-2"
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.45)' }}
              >
                {words.map((word, i) => (
                  <span
                    key={i}
                    className={`word inline-block mr-2 ${
                      word === 'DOUBLES' ? 'doubles-word text-emerald-300 drop-shadow-[0_0_10px_rgba(16,185,129,0.6)]' : ''
                    }`}
                  >
                    {word}
                  </span>
                ))}
              </span>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="text-white font-bold text-lg md:text-xl tracking-wide mt-2 mb-2"
              >
                SCOTT ADAMS
              </motion.div>
            </div>
            <motion.span
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.4 }}
              className="text-[80px] md:text-[120px] text-red-600 font-black leading-none self-end -mb-4 -ml-2 select-none"
            >
              "
            </motion.span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
