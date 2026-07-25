import { useRef } from 'react'
import { motion, useTransform } from 'motion/react'
import { useMousePosition } from '../../hooks/useMousePosition'
import GlassyCard from '../atoms/GlassyCard'

export default function TiltCard({ children, style, className }) {
  const cardRef = useRef(null)
  const { mouseX, mouseY } = useMousePosition(cardRef)

  // Subtle 3D tilt ranges
  const tiltX = useTransform(mouseY, [-1, 1], [10, -10])
  const tiltY = useTransform(mouseX, [-1, 1], [-10, 10])

  return (
    <motion.div
      ref={cardRef}
      style={{
        transformStyle: 'preserve-3d',
        rotateX: tiltX,
        rotateY: tiltY,
        perspective: '1000px',
        ...style
      }}
      className={className}
    >
      <GlassyCard style={{ transformStyle: 'preserve-3d' }}>
        {children}
      </GlassyCard>
    </motion.div>
  )
}
