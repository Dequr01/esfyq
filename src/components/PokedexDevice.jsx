import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

/**
 * Pokédex Device Component
 * - Large red rectangular device positioned diagonally
 * - Left screen shows Squirtle information
 * - Right side has keypad and controls
 */
export default function PokedexDevice() {
  const deviceRef = useRef(null)

  return (
    <motion.div
      ref={deviceRef}
      initial={{ opacity: 0, rotate: -5, scale: 0.9 }}
      animate={{ opacity: 1, rotate: -8, scale: 1 }}
      transition={{ delay: 1, duration: 1, ease: 'easeOut' }}
      className="absolute z-14 pointer-events-none"
      style={{
        right: '5%',
        top: '15%',
        width: 'clamp(300px, 35vw, 500px)',
        height: 'clamp(250px, 30vw, 400px)',
        transform: 'rotate(-8deg)',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Main Device Body */}
      <div
        className="relative"
        style={{
          perspective: '1000px',
        }}
      >
        {/* Device Container - Open Book Style */}
        <div className="relative h-full" style={{ transformStyle: 'preserve-3d' }}>
          {/* Left Screen Panel */}
          <div
            className="absolute"
            style={{
              width: '48%',
              height: '100%',
              left: 0,
              backgroundColor: '#8B0000',
              border: '3px solid #5a0000',
              borderRadius: '8px 0 0 8px',
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5), 0 10px 30px rgba(0,0,0,0.6)',
              transform: 'rotateY(-15deg)',
              transformOrigin: 'left center',
            }}
          >
            {/* Screen Content */}
            <div
              className="absolute inset-0 p-4"
              style={{
                backgroundColor: '#1a1a1a',
                borderRadius: '4px',
                margin: '8px',
                fontFamily: 'monospace',
                color: '#fff',
                fontSize: 'clamp(10px, 1.2vw, 14px)',
              }}
            >
              {/* Squirtle Info */}
              <div className="flex flex-col h-full">
                <div className="text-yellow-400 font-bold mb-2" style={{ fontSize: '1.2em' }}>
                  SQUIRTLE
                </div>
                <div className="text-gray-300 mb-1" style={{ fontSize: '0.9em' }}>
                  TINYTURTLE
                </div>
                <div className="text-gray-400 mb-2" style={{ fontSize: '0.8em' }}>
                  HT 1'08"
                </div>
                <div className="text-gray-400 mb-2" style={{ fontSize: '0.8em' }}>
                  WT 20.01b
                </div>
                <div className="mt-auto flex items-center gap-2">
                  <span className="text-gray-300" style={{ fontSize: '0.9em' }}>No.007</span>
                  <div
                    className="flex-shrink-0"
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: '#2a5a5a',
                      border: '2px solid #1a3a3a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {/* Simple pixel art representation */}
                    <div
                      style={{
                        width: '30px',
                        height: '30px',
                        backgroundColor: '#4a9a9a',
                        borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                        position: 'relative',
                      }}
                    >
                      {/* Eyes */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '8px',
                          left: '8px',
                          width: '4px',
                          height: '4px',
                          backgroundColor: '#000',
                          borderRadius: '50%',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          width: '4px',
                          height: '4px',
                          backgroundColor: '#000',
                          borderRadius: '50%',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel with Controls */}
          <div
            className="absolute"
            style={{
              width: '52%',
              height: '100%',
              right: 0,
              backgroundColor: '#8B0000',
              border: '3px solid #5a0000',
              borderRadius: '0 8px 8px 0',
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5), 0 10px 30px rgba(0,0,0,0.6)',
              transform: 'rotateY(15deg)',
              transformOrigin: 'right center',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div className="h-full p-4 flex flex-col justify-between">
              {/* Text Display Area */}
              <div
                style={{
                  backgroundColor: '#1a1a1a',
                  borderRadius: '4px',
                  padding: '12px',
                  minHeight: '80px',
                  fontFamily: 'monospace',
                  color: '#888',
                  fontSize: 'clamp(8px, 1vw, 12px)',
                  lineHeight: '1.4',
                }}
              >
                After births backsweits
              </div>

              {/* Controls Section */}
              <div className="flex flex-col gap-4">
                {/* Keypad Grid */}
                <div
                  className="grid grid-cols-3 gap-2"
                  style={{ maxWidth: '120px' }}
                >
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        aspectRatio: '1',
                        backgroundColor: '#0066cc',
                        border: '2px solid #004499',
                        borderRadius: '2px',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
                      }}
                    />
                  ))}
                </div>

                {/* D-pad and Buttons */}
                <div className="flex items-center gap-4">
                  {/* D-pad */}
                  <div className="relative" style={{ width: '50px', height: '50px' }}>
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '30px',
                        height: '30px',
                        backgroundColor: '#666',
                        border: '2px solid #444',
                        borderRadius: '2px',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.4)',
                      }}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <div
                      style={{
                        width: '20px',
                        height: '30px',
                        backgroundColor: '#666',
                        border: '2px solid #444',
                        borderRadius: '15px',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.4)',
                      }}
                    />
                    <div
                      style={{
                        width: '20px',
                        height: '30px',
                        backgroundColor: '#666',
                        border: '2px solid #444',
                        borderRadius: '15px',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.4)',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Worn/Textured Effect Overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(0,0,0,0.1) 2px,
                rgba(0,0,0,0.1) 4px
              )
            `,
            mixBlendMode: 'multiply',
          }}
        />
      </div>
    </motion.div>
  )
}

