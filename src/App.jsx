import { useEffect, useState } from 'react'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Navigation from './components/Navigation'
import ModelBackground from './components/ModelBackground'
import LoadingScreen from './components/LoadingScreen'
import { useMagneticScroll } from './hooks/useMagneticScroll'
import { ThemeProvider } from './context/ThemeContext'
import './App.css'

function App() {
  const [modelLoaded, setModelLoaded] = useState(false)

  // Enable magnetic scroll snapping for all sections
  useMagneticScroll(['hero', 'about', 'projects', 'contact'])

  useEffect(() => {
    // Disable default smooth scroll behavior - we'll handle it with magnetic snap
    document.documentElement.style.scrollBehavior = 'auto'
    
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
      <div className="app" style={{ background: 'transparent', position: 'relative' }}>
        {/* Full-screen 3D model background - z-index 0, behind everything */}
        <ModelBackground />
        
        {/* Loading screen - shows until model is loaded, animates out with slide-up */}
        {!modelLoaded && <LoadingScreen onModelLoaded={() => setModelLoaded(true)} />}
        
        {/* Navigation Header - z-index 1000, on top */}
        <Navigation />
        
        {/* Main content sections - z-index 1+, layered over ModelBackground */}
        <main
          data-main-content
          style={{
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Hero Section */}
          <Hero />
          
          {/* About Section */}
          <About />
          
          {/* Projects Section */}
          <Projects />
          
          {/* Contact Section */}
          <Contact />
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
