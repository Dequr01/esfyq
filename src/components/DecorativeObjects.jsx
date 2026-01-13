import { useEffect, useRef } from 'react'
import anime from 'animejs'
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

  // Animations and 3D objects
  useEffect(() => {
    // Anime animations for decorative elements
    anime({
      targets: flowerRef.current,
      opacity: [0, 1],
      scale: [0, 1],
      duration: 800,
      delay: 1200,
      easing: 'easeOutExpo',
    })

    anime({
      targets: dodecahedronRef.current,
      opacity: [0, 1],
      rotateY: [-90, 0],
      duration: 1000,
      delay: 1400,
      easing: 'easeOutExpo',
    })

    anime({
      targets: heartRef.current,
      opacity: [0, 1],
      scale: [0, 1],
      duration: 600,
      delay: 1300,
      easing: 'easeOutExpo',
    })

    anime({
      targets: angularRef.current,
      opacity: [0, 1],
      rotate: [-45, -45],
      duration: 800,
      delay: 1500,
      easing: 'easeOutExpo',
    })

    // Dodecahedron 3D
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
      <div
        ref={flowerRef}
        className="absolute"
        style={{
          bottom: '10%',
          left: '5%',
          width: '60px',
          height: '60px',
          opacity: 0,
          transform: 'scale(0)',
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
      </div>

      {/* White Dodecahedron (near professional title) */}
      <div
        className="absolute"
        style={{
          top: '45%',
          left: '25%',
          width: '80px',
          height: '80px',
          opacity: 0,
          transform: 'rotateY(-90deg)',
        }}
        ref={dodecahedronRef}
      />

      {/* Red Heart (near tech stack) */}
      <div
        ref={heartRef}
        className="absolute"
        style={{
          bottom: '25%',
          right: '15%',
          width: '30px',
          height: '30px',
          opacity: 0,
          transform: 'scale(0)',
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
      </div>

      {/* Red Angular Object (behind Pokédex, top-right) */}
      <div
        ref={angularRef}
        className="absolute"
        style={{
          top: '20%',
          right: '12%',
          width: '40px',
          height: '60px',
          transform: 'rotate(-45deg)',
          opacity: 0,
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
      </div>
    </div>
  )
}
