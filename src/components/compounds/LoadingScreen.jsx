import { useState, useEffect } from 'react'
import anime from 'animejs'

// Optimized loading screen with clean fade-out effect
export default function LoadingScreen({ onModelLoaded }) {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('Initializing...')

  useEffect(() => {
    // Simulate smooth progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 90) {
          return prev + Math.random() * 2 + 0.3
        }
        return prev
      })
    }, 100)

    // Listen for model loaded event
    const handleModelLoaded = () => {
      setProgress(100)
      setStatus('Ready!')

      // Add 1-second delay before fading out for better UX
      setTimeout(() => {
        // Fade out and remove loading screen
        const loadingContainer = document.querySelector('[data-loading-screen]')
        if (loadingContainer) {
          anime({
            targets: loadingContainer,
            opacity: [1, 0],
            duration: 600,
            easing: 'easeInOutQuad',
            complete: () => {
              onModelLoaded()
            }
          })
        } else {
          setTimeout(() => {
            onModelLoaded()
          }, 600)
        }
      }, 1000) // 1-second delay before starting fade-out
    }

    // Listen for progress updates from model loading
    const handleProgress = (event) => {
      const percent = event.detail.percent
      setProgress(Math.max(progress, percent))
      if (percent < 50) {
        setStatus('Loading assets...')
      } else if (percent < 85) {
        setStatus('Processing model...')
      } else {
        setStatus('Finalizing...')
      }
    }

    window.addEventListener('modelLoaded', handleModelLoaded)
    window.addEventListener('modelProgress', handleProgress)

    return () => {
      clearInterval(progressInterval)
      window.removeEventListener('modelLoaded', handleModelLoaded)
      window.removeEventListener('modelProgress', handleProgress)
    }
  }, [onModelLoaded])

  return (
    <div
      data-loading-screen
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        backdropFilter: 'blur(1px)',
      }}
    >
      {/* Content Container */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 700,
            marginBottom: '1rem',
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #ffffff 0%, #cccccc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          ESFYQ
        </h1>
        <p
          style={{
            fontSize: 'clamp(0.9rem, 2vw, 1rem)',
            color: '#aaaaaa',
            letterSpacing: '0.05em',
            fontWeight: 300,
          }}
        >
          {status}
        </p>
      </div>

      {/* Progress Bar Container */}
      <div
        style={{
          width: 'clamp(200px, 70%, 400px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        {/* Progress Bar */}
        <div
          style={{
            width: '100%',
            height: '2px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '1px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: `${Math.min(progress, 100)}%`,
              height: '100%',
              background: 'linear-gradient(90deg, rgba(255,255,255,0.4), rgba(255,255,255,0.8))',
              transition: 'width 0.4s ease-out',
              borderRadius: '1px',
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
            }}
          />
        </div>

        {/* Progress Percentage */}
        <span
          style={{
            fontSize: '0.75rem',
            color: 'rgba(255, 255, 255, 0.5)',
            letterSpacing: '0.1em',
          }}
        >
          {Math.round(Math.min(progress, 100))}%
        </span>
      </div>

      {/* Animated Dots */}
      <div
        style={{
          marginTop: '3rem',
          display: 'flex',
          gap: '0.5rem',
          justifyContent: 'center',
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.4)',
              animation: `pulse 1.5s ease-in-out ${i * 0.3}s infinite`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  )
}
