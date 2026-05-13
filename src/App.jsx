import { useEffect, useState } from 'react'
import ScrollHorizontal from './components/ScrollHorizontal'
import { useScroll } from 'framer-motion'
import { useRef } from 'react'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Navigation from './components/Navigation'
import ChapterDots from './components/ChapterDots'
import ModelBackground from './components/ModelBackground'
import LoadingScreen from './components/LoadingScreen'

import { ThemeProvider } from './context/ThemeContext'

function App() {
  const [modelLoaded, setModelLoaded] = useState(false)
  const containerRef = useRef(null)
  
  const { scrollYProgress } = useScroll({
    container: containerRef
  })

  useEffect(() => {
    // Listen for model loaded event from BackgroundEngine
    const handleModelLoaded = () => {
      setModelLoaded(true)
    }

    window.addEventListener('modelLoaded', handleModelLoaded)

    return () => {
      window.removeEventListener('modelLoaded', handleModelLoaded)
    }
  }, [])

  return (
    <ThemeProvider>
      <div className="app-container h-full w-full">
        {/* Full-screen 3D model background */}
        <ModelBackground scrollProgress={scrollYProgress} />

        {/* Loading screen */}
        {!modelLoaded && <LoadingScreen onModelLoaded={() => setModelLoaded(true)} />}

        {/* Navigation */}
        <Navigation />

        {/* Story Chapters - Horizontal Scrolling */}
        <ChapterDots scrollYProgress={scrollYProgress} containerRef={containerRef} />

        <main>
          <ScrollHorizontal containerRef={containerRef} scrollYProgress={scrollYProgress}>
            <Hero />
            <About />
            <Projects />
            <Contact />
          </ScrollHorizontal>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
