import { motion, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'
import { CHAPTER_BOUNDARIES } from '../../App'

const chapters = [
  { id: 0, label: 'I — THE GENESIS' },
  { id: 1, label: 'II — THE CRAFT' },
  { id: 2, label: 'III — THE ARTIFACTS' },
  { id: 3, label: 'IV — THE CONNECTION' },
]

export default function ChapterDots({ scrollYProgress, containerRef }) {
  const [activeChapter, setActiveChapter] = useState(0)

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      // Find the index of the boundary closest to current scroll progress
      const closestIndex = CHAPTER_BOUNDARIES.reduce((prev, curr, i) => 
        Math.abs(curr - latest) < Math.abs(CHAPTER_BOUNDARIES[prev] - latest) ? i : prev
      , 0)
      setActiveChapter(closestIndex)
    })
    return () => unsubscribe()
  }, [scrollYProgress])

  const handleClick = (index) => {
    if (containerRef.current) {
      const totalHeight = containerRef.current.scrollHeight - containerRef.current.clientHeight
      const targetScroll = CHAPTER_BOUNDARIES[index] * totalHeight
      containerRef.current.scrollTo({ top: targetScroll, behavior: 'smooth' })
    }
  }

  return (
    <div 
      className="fixed right-8 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-3"
      aria-label="Chapter navigation"
    >
      {chapters.map((chapter, index) => (
        <div key={chapter.id} className="relative group flex items-center justify-end">
          {/* Chapter Label */}
          <span 
            className="absolute right-6 whitespace-nowrap text-[0.65rem] tracking-[0.2em] text-white/40 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none pr-2 font-mono uppercase"
          >
            {chapter.label}
          </span>

          {/* Dot */}
          <button
            onClick={() => handleClick(index)}
            className="relative flex items-center justify-center p-2 -mr-2"
          >
            <div 
              style={{
                background: 'var(--text)',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              className={`${
                activeChapter === index 
                  ? 'w-[4px] h-6 rounded-full opacity-100' 
                  : 'w-[4px] h-[4px] rounded-full opacity-25 group-hover:opacity-60'
              }`}
            />
          </button>
        </div>
      ))}
    </div>
  )
}
