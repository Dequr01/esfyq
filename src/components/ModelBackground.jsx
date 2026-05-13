import { Canvas, useFrame, useThree, useLoader, invalidate } from '@react-three/fiber'
import React, { useRef, useMemo, useCallback, Suspense, useState, useEffect, memo } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { Environment, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { useTheme } from '../context/ThemeContext'

import mazdaRx7SpiritR from '../assets/2002_mazda_rx-7_spirit_r_type_a_fd.glb?url'
import hondaNsx from '../assets/1992_honda_nsx_type-r.glb?url'
import porsche911 from '../assets/porsche_911_gt1_straenversion_www.vecarz.com.glb?url'
import porsche917k from '../assets/porsche_917k_lm_red.glb?url'
import studio from '../assets/studio.glb?url'
import kuromi from '../assets/kuromi.glb?url'
import baymax from '../assets/baymaxnanoblock.glb?url'
// Removed minecraft model


const isMobile = () => {
  if (typeof window === 'undefined') return false
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
  const gltf = useLoader(GLTFLoader, url, 
    (loader) => {
      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.4.1/')
      loader.setDRACOLoader(dracoLoader)
    },
    (xhr) => {
      if (xhr.total > 0) {
        const percent = (xhr.loaded / xhr.total) * 100
        window.dispatchEvent(new CustomEvent('modelProgress', { detail: { percent } }))
      }
    }
  )

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

          // Dramatic paint setup
          mat.metalness = 0.95
          mat.roughness = 0.15
          mat.envMapIntensity = 0.6
          mat.needsUpdate = true
        })
      }
    })

    return clone
  }, [gltf.scene, isMobile])

  return <primitive ref={modelRef} object={processedModel} />
}

const MemoizedModel = memo(Model)

function Scene({ modelUrl, isMobile, scrollProgress }) {
  const cameraRef = useRef()

  useEffect(() => {
    // Dispatch model loaded event when Scene mounts
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('modelLoaded'))
    }, 100)

    // Invalidate on scroll change for frameloop="demand"
    if (scrollProgress) {
      return scrollProgress.on('change', () => invalidate())
    }
  }, [scrollProgress])

  // --- CAMERA SCROLL POINTS (NARRATIVE CHAPTERS) ---
  // --- CAMERA SCROLL POINTS (NARRATIVE CHAPTERS) ---
  const scrollPoints = [
    {
      scroll: 0,
      position: [0, 4, 25],     // Chapter 1: The Genesis - Wide shot
      lookAt: [0, 0, 0]
    },
    {
      scroll: 0.33,
      position: [-15, 2, 5],    // Chapter 2: The Craft - Left close-up
      lookAt: [0, 1, 0]
    },
    {
      scroll: 0.66,
      position: [15, 8, 12],    // Chapter 3: The Artifacts - High angle
      lookAt: [0, 0, 0]
    },
    {
      scroll: 1.0,
      position: [0, -2, 18],    // Chapter 4: The Connection - Low angle
      lookAt: [0, 2, 0]
    }
  ]

  const DramaticLighting = () => (
    <>
      <ambientLight intensity={0.2} />
      {/* Key light: Strong white main light */}
      <directionalLight position={[10, 10, 10]} intensity={2.5} color="#ffffff" />
      {/* Fill light: Cool blue for depth */}
      <directionalLight position={[-10, 5, -5]} intensity={1.2} color="#a0c4ff" />
      {/* Rim light: Warm orange backlight for silhouette pop */}
      <directionalLight position={[0, -5, -10]} intensity={2.0} color="#ff9040" />
      {/* Side accent */}
      <spotLight position={[15, 5, 5]} intensity={1.5} angle={0.3} penumbra={1} color="#ffffff" />
    </>
  )

  useFrame(() => {
    if (!cameraRef.current) return

    // Scroll value between 0 and 1
    const t = scrollProgress ? scrollProgress.get() : 0

    // Determine current segment
    let i = 0
    while (i < scrollPoints.length - 1 && t > scrollPoints[i + 1].scroll) {
      i++
    }

    const p1 = scrollPoints[i]
    const p2 = scrollPoints[Math.min(i + 1, scrollPoints.length - 1)]
    const range = p2.scroll - p1.scroll
    const localT = range === 0 ? 0 : (t - p1.scroll) / range

    // Smoothly interpolate camera position and lookAt
    const camPos = new THREE.Vector3().fromArray(p1.position).lerp(
      new THREE.Vector3().fromArray(p2.position),
      localT
    )

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
        position={[0, 4, 25]} 
        fov={isMobile ? 35 : 25}
      />

      <DramaticLighting />

      <Suspense fallback={null}>
        <MemoizedModel url={modelUrl} isMobile={isMobile} />
      </Suspense>

      <Environment preset="night" environmentIntensity={0.3} />
    </>
  )
}

export default function ModelBackground({ modelUrl, scrollProgress }) {
  const { isDark } = useTheme()
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    setMobile(isMobile())
  }, [])

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        backgroundColor: 'transparent',
        top: 0,
        left: 0,
      }}
    >
      <Canvas
        frameloop="demand"
        gl={{
          alpha: true,
          antialias: !mobile,
          powerPreference: 'high-performance',
          pixelRatio: typeof window !== 'undefined' ? (mobile ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2)) : 1,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0)
        }}
        style={{
          background: 'transparent',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <Scene modelUrl={modelUrl || porsche911} isMobile={mobile} scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  )
}

