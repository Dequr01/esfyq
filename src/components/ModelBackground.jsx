import { useRef, useMemo, useCallback, Suspense, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { Environment, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { useTheme } from '../context/ThemeContext'

import mazdaRx7Fd from '../assets/mazda_rx-7_fd.glb?url'
import mazdaRx7SpiritR from '../assets/2002_mazda_rx-7_spirit_r_type_a_fd.glb?url'
import hondaNsx from '../assets/1992_honda_nsx_type-r.glb?url'
import porsche911 from '../assets/porsche_911_gt1_straenversion_www.vecarz.com.glb?url'
import porsche917k from '../assets/porsche_917k_lm_red.glb?url'
import studio from '../assets/studio.glb?url'
import kuromi from '../assets/kuromi.glb?url'
import baymax from '../assets/baymaxnanoblock.glb?url'
import robot from '../assets/90s_robot.glb?url'
import minecraftModel from '../assets/minecraft/source/big boy.glb?url'


const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.innerWidth <= 768 ||
    window.innerHeight <= 500 ||
    ('ontouchstart' in window)
}

function LightingSetup({ isMobile }) {
  return (
    <>
      {/* Increased neutral ambient light to prevent color casts on mobile */}
      <ambientLight intensity={isMobile ? 0.4 : 0.3} />
      
      {/* Main neutral white directional light from above */}
      <directionalLight position={[10, 10, 8]} intensity={isMobile ? 1.0 : 0.9} color="#ffffff" />
      
      {/* Reduced warm tones - only subtle hint of warmth on mobile */}
      <directionalLight position={[12, 8, 8]} intensity={isMobile ? 0.5 : 0.6} color="#ffe4cc" />
      
      {/* Soft key light from side */}
      <directionalLight position={[8, 4, 10]} intensity={isMobile ? 0.6 : 0.5} color="#e8f0ff" />
      
      {/* Fill light from back-left to prevent harsh shadows on mobile */}
      <directionalLight position={[-10, 3, -8]} intensity={isMobile ? 0.3 : 0.2} color="#e8f0ff" />
      
      {/* Subtle hemisphere for natural sky/ground reflection */}
      <hemisphereLight skyColor="#e8f0ff" groundColor="#d0d0d0" intensity={isMobile ? 0.25 : 0.2} />
    </>
  )
}

function Model({ url, isMobile }) {
  const gltf = useLoader(GLTFLoader, url, (loader) => {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.4.1/')
    loader.setDRACOLoader(dracoLoader)
  })

  const modelRef = useRef()

  const processedModel = useMemo(() => {
    const clone = gltf.scene.clone()

    const bbox = new THREE.Box3().setFromObject(clone)
    const size = bbox.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const targetSize = isMobile ? 8 : 12 // Much bigger robot
    const scale = targetSize / Math.max(maxDim, 0.01)
    clone.scale.setScalar(scale)

    bbox.setFromObject(clone)
    const center = bbox.getCenter(new THREE.Vector3())
    clone.position.sub(center)

    clone.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = false
        node.receiveShadow = false

        const mats = Array.isArray(node.material)
          ? node.material
          : [node.material]

        mats.forEach((mat) => {
          if (!mat || !(mat.isMeshStandardMaterial || mat.isMeshPhysicalMaterial)) return

          if (isMobile) {
            mat.metalness = Math.min(mat.metalness || 0.8, 0.9)
            mat.roughness = Math.max(mat.roughness || 0.2, 0.15)
            mat.envMapIntensity = 1.0
          } else {
            mat.metalness = Math.min(mat.metalness || 0.8, 0.95)
            mat.roughness = Math.max(mat.roughness || 0.2, 0.1)
            mat.envMapIntensity = 1.3
          }

          mat.needsUpdate = true
        })
      }
    })

    return clone
  }, [gltf.scene, isMobile])

  return <primitive ref={modelRef} object={processedModel} />
}

function Scene({ modelUrl, isMobile }) {
  const cameraRef = useRef()

  useEffect(() => {
    // Dispatch model loaded event when Scene mounts (after model is loaded due to Suspense)
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('modelLoaded'))
    }, 100) // Small delay to ensure everything is set up
  }, [])

  // --- CAMERA SCROLL POINTS (KEYFRAME SYSTEM) ---
  const scrollPoints = [
  {
    scroll: 0,
    position: [2, 1.6, 12],   // Slightly above ground (eye height)
    lookAt: [0, 1.4, 0]
  },
  {
    scroll: 0.15,
    position: [4, 1.7, 6],    // Walk closer along a path
    lookAt: [0, 1.4, 0]
  },
  {
    scroll: 0.3,
    position: [1, 1.65, 2],   // Move through trees
    lookAt: [0, 1.4, 0]
  },
  {
    scroll: 0.45,
    position: [-3, 1.7, 1],   // Circle around the object
    lookAt: [0, 1.4, 0]
  },
  {
    scroll: 0.6,
    position: [-5, 1.65, 4],  // Pass behind
    lookAt: [0, 1.4, 0]
  },
  {
    scroll: 0.8,
    position: [-2, 1.6, 9],   // Back out on another jungle trail
    lookAt: [0, 1.4, 0]
  },
  {
    scroll: 1,
    position: [2, 1.7, 12],   // Return to starting point
    lookAt: [0, 1.4, 0]
  }
]




  // Camera orbiting around the model based on scroll
  /*
  useFrame(() => {
    if (!cameraRef.current) return

    const scrollY = window.scrollY || 0
    const docHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
    const scrollProgress = Math.max(0, Math.min(1, scrollY / docHeight))

    // Calculate camera orbit parameters for bigger robot
    const radius = isMobile ? 18 : 25 // Increased radius for bigger robot
    const baseHeight = isMobile ? 5 : 8 // Higher base height for better view
    const angle = scrollProgress * Math.PI * (isMobile ? 4 : 6)
    const verticalAngle = scrollProgress * (isMobile ? 0.8 : 1.2)

    // Position camera in orbit around the model
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius
    const y = Math.sin(verticalAngle) * 6 + baseHeight

    cameraRef.current.position.set(x, y, z)
    cameraRef.current.lookAt(0, 0, 0)
  })
  */

  useFrame(() => {
    if (!cameraRef.current) return

    // Scroll value between 0 and 1
    const scrollY = window.scrollY || 0
    const docHeight = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      1
    )
    const t = Math.min(1, Math.max(0, scrollY / docHeight))

    // Determine current segment
    let i = 0
    while (i < scrollPoints.length - 1 && t > scrollPoints[i + 1].scroll) {
      i++
    }

    const p1 = scrollPoints[i]
    const p2 = scrollPoints[Math.min(i + 1, scrollPoints.length - 1)]
    const localT =
      (t - p1.scroll) / (p2.scroll - p1.scroll === 0 ? 1 : p2.scroll - p1.scroll)

    // Interpolate camera position
    const camPos = new THREE.Vector3().fromArray(p1.position).lerp(
      new THREE.Vector3().fromArray(p2.position),
      localT
    )

    // Interpolate lookAt target
    const lookAtPos = new THREE.Vector3().fromArray(p1.lookAt).lerp(
      new THREE.Vector3().fromArray(p2.lookAt),
      localT
    )

    cameraRef.current.position.copy(camPos)
    cameraRef.current.lookAt(lookAtPos)
  })

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 2, isMobile ? 10 : 14]} // Initial position, will be overridden by scroll
        fov={25}
      />

      <LightingSetup isMobile={isMobile} />

      <Suspense fallback={null}>
        <Model url={modelUrl} isMobile={isMobile} />
      </Suspense>

      {!isMobile && (
        <Environment preset="studio" background={false} intensity={0.5} />
      )}
    </>
  )
}

export default function ModelBackground({ modelUrl }) {
  const { isDark } = useTheme()
  const mobile = useMemo(() => isMobile(), [])

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        backgroundColor: 'transparent',
      }}
    >
      <Canvas
        gl={{
          alpha: true,
          antialias: !mobile,
          powerPreference: 'high-performance',
          pixelRatio: mobile ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2),
        }}
        style={{
          background: isDark ? 'rgba(26, 26, 26, 0.3)' : 'rgba(208, 208, 208, 0.4)',
        }}

      >
        <Scene modelUrl={modelUrl || minecraftModel} isMobile={mobile} />
      </Canvas>
    </div>
  )
}






// import { useRef, useMemo, Suspense, useState, useEffect } from 'react'
// import { Canvas, useFrame } from '@react-three/fiber'
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
// import { PerspectiveCamera, Environment } from '@react-three/drei'
// import * as THREE from 'three'
// import { useTheme } from '../context/ThemeContext'

// // Replace this with a free Minecraft-style model
// import minecraftModel from '../assets/minecraft/source/big boy.glb?url'

// const isMobile = () =>
//   /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
//     navigator.userAgent
//   ) || window.innerWidth <= 768 || window.innerHeight <= 500

// function LightingSetup({ isMobile }) {
//   return (
//     <>
//       <ambientLight intensity={isMobile ? 0.4 : 0.3} />
//       <directionalLight position={[10, 10, 8]} intensity={isMobile ? 1.0 : 0.9} color="#ffffff" />
//       <directionalLight position={[12, 8, 8]} intensity={isMobile ? 0.5 : 0.6} color="#ffe4cc" />
//       <directionalLight position={[8, 4, 10]} intensity={isMobile ? 0.6 : 0.5} color="#e8f0ff" />
//       <directionalLight position={[-10, 3, -8]} intensity={isMobile ? 0.3 : 0.2} color="#e8f0ff" />
//       <hemisphereLight skyColor="#e8f0ff" groundColor="#d0d0d0" intensity={isMobile ? 0.25 : 0.2} />
//     </>
//   )
// }

// function Model({ url, isMobile }) {
//   const gltf = useMemo(() => {
//     const loader = new GLTFLoader()
//     const dracoLoader = new DRACOLoader()
//     dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.4.1/')
//     loader.setDRACOLoader(dracoLoader)
//     let model
//     loader.load(url, (g) => {
//       model = g.scene
//     })
//     return model
//   }, [url])

//   const modelRef = useRef()

//   return <primitive ref={modelRef} object={gltf} />
// }

// // Scroll keyframes for Minecraft-style camera orbit
// const cameraKeyframes = [
//   { scroll: 0, radius: 10, height: 4, angleOffset: 0 },
//   { scroll: 0.25, radius: 12, height: 5, angleOffset: Math.PI / 2 },
//   { scroll: 0.5, radius: 10, height: 6, angleOffset: Math.PI },
//   { scroll: 0.75, radius: 12, height: 5, angleOffset: (3 * Math.PI) / 2 },
//   { scroll: 1, radius: 10, height: 4, angleOffset: 2 * Math.PI },
// ]

// function Scene({ modelUrl, isMobile }) {
//   const cameraRef = useRef()

//   useFrame(() => {
//     const scrollY = window.scrollY || 0
//     const docHeight = document.documentElement.scrollHeight - window.innerHeight
//     const scrollProgress = Math.min(1, scrollY / docHeight)

//     // Find current keyframe segment
//     let i = 0
//     while (i < cameraKeyframes.length - 1 && scrollProgress > cameraKeyframes[i + 1].scroll) i++
//     const start = cameraKeyframes[i]
//     const end = cameraKeyframes[Math.min(i + 1, cameraKeyframes.length - 1)]

//     const localT = (scrollProgress - start.scroll) / (end.scroll - start.scroll || 1)

//     // Interpolate radius, height, angle
//     const radius = THREE.MathUtils.lerp(start.radius, end.radius, localT)
//     const height = THREE.MathUtils.lerp(start.height, end.height, localT)
//     const angle = THREE.MathUtils.lerp(start.angleOffset, end.angleOffset, localT) + scrollProgress * Math.PI

//     const x = Math.sin(angle) * radius
//     const z = Math.cos(angle) * radius
//     const y = height

//     if (cameraRef.current) cameraRef.current.position.set(x, y, z)
//     if (cameraRef.current) cameraRef.current.lookAt(0, 0, 0)
//   })

//   return (
//     <>
//       <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 4, 10]} fov={25} />
//       <LightingSetup isMobile={isMobile} />
//       <Suspense fallback={null}>
//         <Model url={modelUrl} isMobile={isMobile} />
//       </Suspense>
//       {!isMobile && <Environment preset="studio" background={false} intensity={0.5} />}
//     </>
//   )
// }

// export default function ModelBackground({ modelUrl }) {
//   const { isDark } = useTheme()
//   const mobile = useMemo(() => isMobile(), [])

//   return (
//     <div
//       aria-hidden="true"
//       style={{
//         position: 'fixed',
//         inset: 0,
//         width: '100vw',
//         height: '100vh',
//         zIndex: 0,
//         pointerEvents: 'none',
//         backgroundColor: 'transparent',
//       }}
//     >
//       <Canvas
//         gl={{
//           alpha: true,
//           antialias: !mobile,
//           powerPreference: 'high-performance',
//           pixelRatio: mobile ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2),
//         }}
//         style={{
//           background: isDark ? 'rgba(26, 26, 26, 0.3)' : 'rgba(208, 208, 208, 0.4)',
//         }}
//       >
//         <Scene modelUrl={modelUrl || minecraftModel} isMobile={mobile} />
//       </Canvas>
//     </div>
//   )
// }
