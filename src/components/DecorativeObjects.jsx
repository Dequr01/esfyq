import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Decorative 3D Objects Component
 * - Flower-shaped object (bottom-left)
 * - White dodecahedron (near professional title)
 * - Red heart (near tech stack)
 * - Red angular object (behind Pokédex)
 */
export default function DecorativeObjects() {
  const flowerRef = useRef(null)
  const dodecahedronRef = useRef(null)
  const heartRef = useRef(null)
  const angularRef = useRef(null)

  // Create 3D objects using Three.js for some elements
  useEffect(() => {
    // Dodecahedron
    if (dodecahedronRef.current) {
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
      renderer.setSize(80, 80)
      dodecahedronRef.current.appendChild(renderer.domElement)

      const geometry = new THREE.DodecahedronGeometry(1, 0)
      const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.3,
        roughness: 0.7,
      })
      const dodecahedron = new THREE.Mesh(geometry, material)
      scene.add(dodecahedron)

      const light = new THREE.DirectionalLight(0xffffff, 1)
      light.position.set(5, 5, 5)
      scene.add(light)

      camera.position.z = 3

      const animate = () => {
        requestAnimationFrame(animate)
        dodecahedron.rotation.x += 0.005
        dodecahedron.rotation.y += 0.01
        renderer.render(scene, camera)
      }
      animate()

      return () => {
        renderer.dispose()
        geometry.dispose()
        material.dispose()
      }
    }
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none z-13">
      {/* Flower-shaped object (bottom-left) */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute"
        style={{
          bottom: '10%',
          left: '5%',
          width: '60px',
          height: '60px',
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <g transform="translate(50,50)">
            {/* Petals */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <ellipse
                key={i}
                cx="0"
                cy="-25"
                rx="12"
                ry="25"
                fill={`hsl(${i * 60}, 70%, 60%)`}
                transform={`rotate(${i * 60})`}
              />
            ))}
            {/* Center */}
            <circle cx="0" cy="0" r="15" fill="#FFD700" />
          </g>
        </svg>
      </motion.div>

      {/* White Dodecahedron (near professional title) */}
      <motion.div
        initial={{ opacity: 0, rotateY: -90 }}
        animate={{ opacity: 1, rotateY: 0 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute"
        style={{
          top: '45%',
          left: '25%',
          width: '80px',
          height: '80px',
        }}
        ref={dodecahedronRef}
      />

      {/* Red Heart (near tech stack) */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.3, duration: 0.6, type: 'spring' }}
        className="absolute"
        style={{
          bottom: '25%',
          right: '15%',
          width: '30px',
          height: '30px',
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            d="M50,85 C20,60 5,40 5,25 C5,15 12,10 20,10 C30,10 35,15 50,30 C65,15 70,10 80,10 C88,10 95,15 95,25 C95,40 80,60 50,85 Z"
            fill="#ff0000"
            stroke="#cc0000"
            strokeWidth="2"
          />
        </svg>
      </motion.div>

      {/* Red Angular Object (behind Pokédex, top-right) */}
      <motion.div
        initial={{ opacity: 0, rotate: -45 }}
        animate={{ opacity: 1, rotate: -45 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute"
        style={{
          top: '20%',
          right: '12%',
          width: '40px',
          height: '60px',
          transform: 'rotate(-45deg)',
        }}
      >
        <svg viewBox="0 0 100 150" className="w-full h-full">
          <polygon
            points="50,0 100,50 50,100 0,50"
            fill="#ff0000"
            stroke="#cc0000"
            strokeWidth="2"
          />
          <polygon
            points="50,50 75,75 50,100 25,75"
            fill="#cc0000"
          />
        </svg>
      </motion.div>
    </div>
  )
}

