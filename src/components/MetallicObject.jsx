import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Metallic 3D Object behind the quote
 * - Broken/disassembled sphere or helmet
 * - Silver-white exterior with dark interior
 */
export default function MetallicObject() {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(200, 200)
    containerRef.current.appendChild(renderer.domElement)

    // Create a broken sphere/helmet-like object
    const group = new THREE.Group()

    // Main sphere shell (broken)
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32, 0, Math.PI * 2, 0, Math.PI * 1.5)
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x222222,
    })
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    group.add(sphere)

    // Interior mechanical parts
    const innerGeometry = new THREE.TorusGeometry(0.6, 0.1, 16, 32)
    const innerMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      metalness: 0.5,
      roughness: 0.8,
    })
    const inner1 = new THREE.Mesh(innerGeometry, innerMaterial)
    inner1.rotation.x = Math.PI / 2
    group.add(inner1)

    const inner2 = new THREE.Mesh(innerGeometry, innerMaterial)
    inner2.rotation.y = Math.PI / 2
    group.add(inner2)

    // Broken pieces
    for (let i = 0; i < 3; i++) {
      const pieceGeometry = new THREE.SphereGeometry(0.3, 16, 16, 0, Math.PI)
      const piece = new THREE.Mesh(pieceGeometry, sphereMaterial)
      piece.position.set(
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.5
      )
      piece.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      )
      group.add(piece)
    }

    scene.add(group)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    const pointLight = new THREE.PointLight(0xffffff, 0.5)
    pointLight.position.set(-5, -5, -5)
    scene.add(pointLight)

    camera.position.set(0, 0, 4)
    camera.lookAt(0, 0, 0)

    const animate = () => {
      requestAnimationFrame(animate)
      group.rotation.y += 0.005
      group.rotation.x += 0.002
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      renderer.dispose()
      sphereGeometry.dispose()
      sphereMaterial.dispose()
      innerGeometry.dispose()
      innerMaterial.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute pointer-events-none z-11"
      style={{
        top: '25%',
        left: '20%',
        width: '200px',
        height: '200px',
        opacity: 0.5,
      }}
    />
  )
}

