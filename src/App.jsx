import { useEffect, useState } from 'react'
import ScrollHorizontal from './components/compounds/ScrollHorizontal'
import { useScroll } from 'framer-motion'
import { useRef } from 'react'
import Hero from './components/organisms/Hero'
import About from './components/organisms/About'
// import Projects from './components/organisms/Projects'
import Contact from './components/organisms/Contact'
import Navigation from './components/compounds/Navigation'
import ChapterDots from './components/molecules/ChapterDots'
import ModelBackground from './components/compounds/ModelBackground'
import LoadingScreen from './components/compounds/LoadingScreen'

import { ThemeProvider } from './context/ThemeContext'

export const CHAPTER_BOUNDARIES = [0, 0.5, 1.0];

function App() {
  const [modelLoaded, setModelLoaded] = useState(false)
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    container: containerRef
  })


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
            {/* <Projects /> */}
            <Contact />
          </ScrollHorizontal>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
