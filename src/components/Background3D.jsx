import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Fullscreen Three.js background with:
 * - Image cover (/assets/Background.png)
 * - Subtle parallax via camera movement (mouse)
 * - Slow floating/zoom effect
 */
export default function Background3D() {
  const containerRef = useRef(null)
  const rafRef = useRef(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Scene
    const scene = new THREE.Scene()

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    // Dark gray base for concrete texture
    renderer.setClearColor(0x1a1a1a, 1)
    container.appendChild(renderer.domElement)

    // Camera
    const camera = new THREE.PerspectiveCamera(
      70,
      container.clientWidth / container.clientHeight,
      0.1,
      100,
    )
    const baseZ = 5
    camera.position.set(0, 0, baseZ)

    // Plane with background texture
    const geometry = new THREE.PlaneGeometry(1, 1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff })
    const plane = new THREE.Mesh(geometry, material)
    // Hide plane until texture has loaded to prevent white flash
    plane.visible = false
    scene.add(plane)

    let tex = null
    const loader = new THREE.TextureLoader()
    
    // Create a procedural concrete texture if image doesn't load
    const createConcreteTexture = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 512
      canvas.height = 512
      const ctx = canvas.getContext('2d')
      
      // Base gray
      ctx.fillStyle = '#2a2a2a'
      ctx.fillRect(0, 0, 512, 512)
      
      // Add noise/grain
      const imageData = ctx.getImageData(0, 0, 512, 512)
      for (let i = 0; i < imageData.data.length; i += 4) {
        const noise = Math.random() * 30 - 15
        imageData.data[i] = Math.max(0, Math.min(255, imageData.data[i] + noise))
        imageData.data[i + 1] = Math.max(0, Math.min(255, imageData.data[i + 1] + noise))
        imageData.data[i + 2] = Math.max(0, Math.min(255, imageData.data[i + 2] + noise))
      }
      ctx.putImageData(imageData, 0, 0)
      
      return new THREE.CanvasTexture(canvas)
    }
    
    loader.load(
      './assets/Background.jpg',
      (texture) => {
        tex = texture
        tex.colorSpace = THREE.SRGBColorSpace
        tex.generateMipmaps = true
        tex.minFilter = THREE.LinearMipmapLinearFilter
        material.map = tex
        material.color.set(0xffffff)
        material.needsUpdate = true
        plane.visible = true
        resizePlaneToCover()
      },
      undefined,
      (err) => {
        console.warn('Failed to load background image, using procedural texture', err)
        tex = createConcreteTexture()
        material.map = tex
        material.color.set(0xcccccc)
        material.needsUpdate = true
        plane.visible = true
        resizePlaneToCover()
      },
    )

    // Fit plane to cover viewport, preserving image aspect
    const resizePlaneToCover = () => {
      const w = container.clientWidth
      const h = container.clientHeight

      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)

      // visible size at z=0
      const vFov = THREE.MathUtils.degToRad(camera.fov)
      const viewHeight =
        2 * Math.tan(vFov / 2) * Math.abs(camera.position.z - plane.position.z)
      const viewWidth = viewHeight * camera.aspect

      const imageAspect =
        tex && tex.image && tex.image.width && tex.image.height
          ? tex.image.width / tex.image.height
          : 16 / 9

      // start from view area then scale to cover, then zoom in
      const ZOOM = 1.15 // 15% zoom in
      let planeWidth = viewWidth
      let planeHeight = planeWidth / imageAspect
      if (planeHeight < viewHeight) {
        planeHeight = viewHeight
        planeWidth = planeHeight * imageAspect
      }
      plane.scale.set(planeWidth * ZOOM, planeHeight * ZOOM, 1)
    }

    const onResize = () => resizePlaneToCover()
    window.addEventListener('resize', onResize)

    // Parallax with mouse
    let mouseX = 0
    let mouseY = 0
    let lerpX = 0
    let lerpY = 0
    const parallaxAmount = 0.15

    const onMouseMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1
      mouseX = nx
      mouseY = ny
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    // Animate
    let t = 0
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate)

      // Lerp camera towards mouse
      lerpX += (mouseX - lerpX) * 0.05
      lerpY += (mouseY - lerpY) * 0.05
      camera.position.x = lerpX * parallaxAmount
      camera.position.y = -lerpY * parallaxAmount

      // Slow float/zoom
      t += 0.005
      camera.position.z = baseZ + Math.sin(t) * 0.15
      plane.rotation.z = Math.sin(t * 0.25) * 0.01
      
      // Keep background centered
      plane.position.x = -lerpX * (parallaxAmount * 0.5)
      plane.position.y = lerpY * (parallaxAmount * 0.5)

      camera.lookAt(0, 0, 0)
      renderer.render(scene, camera)
    }
    animate()
    resizePlaneToCover()

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)

      geometry.dispose()
      material.dispose()
      if (tex) tex.dispose()
      renderer.dispose()

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 w-full h-full pointer-events-none"
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  )
}
