import { Canvas, useFrame, useThree, useLoader, invalidate } from '@react-three/fiber'
import React, { useRef, useMemo, useCallback, Suspense, useState, useEffect, memo } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { Environment, PerspectiveCamera, AdaptiveDpr, AdaptiveEvents, Preload } from '@react-three/drei'
import * as THREE from 'three'
import { useControls, folder, Leva } from 'leva'
import { useTheme } from '../context/ThemeContext'

const porsche911 = '/models/porsche_917k_lm_red.glb'


const isMobile = () => {
  if (typeof window === 'undefined') return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.innerWidth <= 768 ||
    window.innerHeight <= 500 ||
    ('ontouchstart' in window)
}


function Model({ url, isMobile, metalness, roughness, envMapIntensity }) {
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
    const targetSize = isMobile ? 14 : 12
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
          mat.metalness = metalness
          mat.roughness = roughness
          mat.envMapIntensity = envMapIntensity
          mat.needsUpdate = true
        })
      }
    })

    return clone
  }, [gltf.scene, isMobile, metalness, roughness, envMapIntensity])

  if (isMobile) {
    processedModel.position.y = -2.5
  }

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
  const scrollPoints = useMemo(() => {
    // const basePoints = [
    //   {
    //     scroll: 0,
    //     position: [0, 4, 25],     // Chapter 1: The Genesis - Wide shot
    //     lookAt: [0, 0, 0]
    //   },
    //   {
    //     scroll: 0.33,
    //     position: [-15, 2, 5],    // Chapter 2: The Craft - Left close-up
    //     lookAt: [0, 1, 0]
    //   },
    //   {
    //     scroll: 0.66,
    //     position: [15, 8, 12],    // Chapter 3: The Artifacts - High angle
    //     lookAt: [0, 0, 0]
    //   },
    //   {
    //     scroll: 1.0,
    //     position: [0, 0, 18],    // Chapter 4: The Connection - Low angle
    //     lookAt: [0, 2, 0]
    //   }
    // ]

    const basePoints = [
      {
        scroll: 0,
        position: [0, 4, 25],        // Wide establishing shot — full car in frame, feels grand
        lookAt: [0, 0, 0]
      },
      {
        scroll: 0.08,
        position: [0, 1.5, 14],      // Slow push-in — camera drifts toward the front, tension builds
        lookAt: [0, 0.5, 0]
      },
      {
        scroll: 0.15,
        position: [-8, 0.5, 8],      // Low front-left corner — hood line, headlight detail
        lookAt: [0, 0.8, 0]
      },
      {
        scroll: 0.25,
        position: [-14, 1, 2],       // Driver's side profile close — door, mirrors, haunch
        lookAt: [0, 1, 0]
      },
      {
        scroll: 0.33,
        position: [-15, 2, 5],       // Classic left beauty angle — wide enough to see the whole flank
        lookAt: [0, 1, 0]
      },
      {
        scroll: 0.42,
        position: [-10, 6, -2],      // Rising over the roof — dramatic top-down sweep from left
        lookAt: [0, 0, 0]
      },
      {
        scroll: 0.50,
        position: [0, 9, -10],       // Rear high shot — GT1 rear wing and diffuser, very cinematic
        lookAt: [0, 1, 0]
      },
      {
        scroll: 0.58,
        position: [12, 1, -6],       // Low rear-right — exhaust, haunches, aggression
        lookAt: [0, 0.5, 0]
      },
      {
        scroll: 0.66,
        position: [15, 8, 12],       // High right angle — elevated, shows the whole car from above
        lookAt: [0, 0, 0]
      },
      {
        scroll: 0.75,
        position: [10, 0.3, 10],     // Ground-level right side — wheel arch, tire, road-hugging stance
        lookAt: [0, 0.5, 0]
      },
      {
        scroll: 0.84,
        position: [4, 0.5, 12],      // Low front-right — near the bumper, intimate and powerful
        lookAt: [0, 1, 0]
      },
      {
        scroll: 0.92,
        position: [0, 2, 16],        // Slow pull back to center — preparing for the final reveal
        lookAt: [0, 1, 0]
      },
      {
        scroll: 1.0,
        position: [0, 1, 20],        // Final hero shot — centered, low, slightly closer than the open
        lookAt: [0, 1.5, 0]          // Looking slightly up = car feels dominant, powerful
      }
    ];

    if (isMobile) {
      // Shift camera higher and further back on mobile to move model lower in frame
      return basePoints.map(p => ({
        ...p,
        position: [p.position[0] * 0.7, p.position[1] + 4, p.position[2] + 12],
        lookAt: [p.lookAt[0], p.lookAt[1] - 2, p.lookAt[2]]
      }))
    }
    return basePoints
  }, [isMobile])

  const {
    ambientIntensity,
    mainLightIntensity, mainLightColor, mainLightPos,
    fillLightIntensity, fillLightColor, fillLightPos,
    rimLightIntensity, rimLightColor, rimLightPos,
    spotLightIntensity, spotLightAngle, spotLightPos,
    envIntensity, envPreset
  } = useControls('Lighting & Environment', {
    'Ambient': folder({
      ambientIntensity: { value: 2.0, min: 0, max: 2, step: 0.1 },
    }),
    'Main Light': folder({
      mainLightIntensity: { value: 5.5, min: 0, max: 10, step: 0.1 },
      mainLightColor: '#ffffff',
      mainLightPos: { value: [0, 123, 30], step: 1 },
    }),
    'Fill Light': folder({
      fillLightIntensity: { value: 5.0, min: 0, max: 10, step: 0.1 },
      fillLightColor: '#ffffff',
      fillLightPos: { value: [-10, 18, -32], step: 1 },
    }),
    'Rim Light': folder({
      rimLightIntensity: { value: 5.0, min: 0, max: 10, step: 0.1 },
      rimLightColor: '#ffffff',
      rimLightPos: { value: [-20, 5, 38], step: 1 },
    }),
    'Spot Light': folder({
      spotLightIntensity: { value: 5.0, min: 0, max: 10, step: 0.1 },
      spotLightAngle: { value: 1.0, min: 0, max: 1, step: 0.05 },
      spotLightPos: { value: [15, 4, 5], step: 1 },
    }),
    'Environment': folder({
      envIntensity: { value: 1.1, min: 0, max: 2, step: 0.1 },
      envPreset: { value: 'night', options: ['night', 'city', 'studio', 'apartment', 'lobby', 'park', 'forest', 'sunrise', 'sunset'] },
    })
  })

  const {
    modelMetalness,
    modelRoughness,
    modelEnvMapIntensity
  } = useControls('Model Material', {
    modelMetalness: { value: 0.95, min: 0, max: 1, step: 0.01 },
    modelRoughness: { value: 0.15, min: 0, max: 1, step: 0.01 },
    modelEnvMapIntensity: { value: 0.6, min: 0, max: 5, step: 0.1 },
  })

  const DramaticLighting = () => (
    <>
      <ambientLight intensity={ambientIntensity} />
      <directionalLight position={mainLightPos} intensity={mainLightIntensity} color={mainLightColor} />
      <directionalLight position={fillLightPos} intensity={fillLightIntensity} color={fillLightColor} />
      <directionalLight position={rimLightPos} intensity={rimLightIntensity} color={rimLightColor} />
      <spotLight position={spotLightPos} intensity={spotLightIntensity} angle={spotLightAngle} penumbra={1} color="#ffffff" />
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
        <MemoizedModel
          url={modelUrl}
          isMobile={isMobile}
          metalness={modelMetalness}
          roughness={modelRoughness}
          envMapIntensity={modelEnvMapIntensity}
        />
        <Environment preset={envPreset} environmentIntensity={envIntensity} />
        <Preload all />
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
      </Suspense>
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
      <Leva hidden />
      <Canvas
        frameloop="demand"
        performance={{ min: 0.5 }}
        gl={{
          alpha: true,
          antialias: !mobile,
          stencil: false,
          depth: true,
          powerPreference: 'high-performance',
          precision: mobile ? 'lowp' : 'highp',
          pixelRatio: typeof window !== 'undefined' ? (mobile ? Math.min(window.devicePixelRatio, 1.2) : Math.min(window.devicePixelRatio, 2)) : 1,
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

