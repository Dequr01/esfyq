import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const techIcons = [
  { src: '/assets/react-icon.svg', alt: 'React', name: 'React' },
  { src: '/assets/dotnet-icon.svg', alt: '.NET', name: '.NET' },
  { src: '/assets/mysql-icon.svg', alt: 'MySQL', name: 'MySQL' },
  { src: '/assets/html-icon.svg', alt: 'HTML', name: 'HTML' },
  { src: '/assets/css-icon.svg', alt: 'CSS', name: 'CSS' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
}

const iconVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0,
    rotate: -180,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 15,
    },
  },
  hover: {
    scale: 1.3,
    rotate: 360,
    y: -10,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10,
    },
  },
}

export default function AnimatedTechStack() {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-white/95 rounded-2xl shadow-xl px-6 py-4 flex flex-col items-center backdrop-blur-sm"
      style={{ minWidth: '200px' }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="uppercase font-bold text-gray-800 mb-2 text-right w-full"
      >
        TECHNOLOGY STACK
      </motion.div>
      <motion.div
        variants={containerVariants}
        className="flex gap-4 flex-wrap items-center justify-center"
      >
        {techIcons.map((icon, index) => (
          <motion.div
            key={icon.alt}
            variants={iconVariants}
            whileHover="hover"
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
            className="relative group"
          >
            <motion.img
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
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none"
              >
                {icon.name}
              </motion.div>
            )}
            {hoveredIndex === index && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.5, opacity: [0, 0.5, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="absolute inset-0 rounded-full border-2 border-red-500 pointer-events-none"
              />
            )}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

