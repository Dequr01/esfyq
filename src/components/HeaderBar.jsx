import { motion } from 'framer-motion'
import MagneticButton from './MagneticButton'

export default function HeaderBar() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.2 }}
      className="fixed inset-x-0 z-30 flex items-center justify-between px-4 py-3 sm:px-8"
      style={{
        top: '80px', // Position below Navigation
        pointerEvents: 'none',
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 0.75rem)',
        paddingLeft: 'calc(env(safe-area-inset-left, 0px) + 1rem)',
        paddingRight: 'calc(env(safe-area-inset-right, 0px) + 1rem)',
        backgroundColor: 'rgba(0, 0, 0, 0.18)',
        backdropFilter: 'blur(10px)',
      }}
      aria-label="Top navigation"
    >
    </motion.header>
  )
}
