import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'
import anime from 'animejs'

// Simple in-memory cache for loaded GLTF scenes to avoid re-downloading
const gltfCache = new Map()

export default function BackgroundEngine() {
  const mountRef = useRef(null)
  const rafRef = useRef(null)
  const resizeObserverRef = useRef(null)

  useEffect(() => {
    if (!mountRef.current) {
      console.error('❌ mountRef.current is null!')
      return
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Use window dimensions as fallback and ensure we have valid dimensions
    const getDimensions = () => {
      const rect = mountRef.current.getBoundingClientRect()
      return {
        width: Math.max(rect.width || window.innerWidth, window.innerWidth),
        height: Math.max(rect.height || window.innerHeight, window.innerHeight)
      }
    }
    
    const { width, height } = getDimensions()
    
    console.log('BackgroundEngine mount dimensions:', { width, height })
    console.log('Window dimensions:', { width: window.innerWidth, height: window.innerHeight })
    
    if (width === 0 || height === 0) {
      console.error('❌ Mount container has zero dimensions!')
      console.log('Mount ref:', mountRef.current)
      console.log('Mount computed style:', window.getComputedStyle(mountRef.current))
    }

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)
    camera.position.set(0, 0, 30)
    camera.lookAt(0, 0, 0) // Ensure camera looks at origin
    console.log('Camera initialized at position:', camera.position)
    console.log('Camera looking at:', new THREE.Vector3(0, 0, 0))
    console.log('Camera FOV:', camera.fov)
    console.log('Camera aspect:', camera.aspect)
    console.log('Camera near:', camera.near, 'far:', camera.far)

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    // Temporarily use a visible background to test if canvas is rendering
    renderer.setClearColor(0x0000ff, 0.3) // Semi-transparent blue background for testing
    console.log('⚠️ Canvas background set to blue for testing - you should see a blue tint if canvas is visible')
    renderer.domElement.style.position = 'fixed' // Changed from absolute to fixed
    renderer.domElement.style.top = '0'
    renderer.domElement.style.left = '0'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.zIndex = '0' // Temporarily higher to test visibility
    console.log('⚠️ Canvas z-index set to 0 for testing')
    renderer.domElement.style.pointerEvents = 'none'
    renderer.domElement.style.opacity = '1' // Ensure it's visible
    renderer.domElement.style.backgroundColor = 'transparent' // Ensure transparent background

    mountRef.current.appendChild(renderer.domElement)
    console.log('Renderer canvas appended to mount, canvas size:', renderer.domElement.width, 'x', renderer.domElement.height)
    
    // Verify canvas is in DOM and visible
    if (!document.body.contains(renderer.domElement) && !mountRef.current.contains(renderer.domElement)) {
      console.error('❌ Renderer canvas not properly attached to DOM!')
    } else {
      console.log('✅ Renderer canvas is in DOM')
    }
    
    // Check canvas visibility
    const canvasStyle = window.getComputedStyle(renderer.domElement)
    console.log('Canvas computed style:', {
      display: canvasStyle.display,
      visibility: canvasStyle.visibility,
      opacity: canvasStyle.opacity,
      zIndex: canvasStyle.zIndex,
      position: canvasStyle.position,
      width: canvasStyle.width,
      height: canvasStyle.height
    })
    
    // Force canvas to be visible
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.visibility = 'visible'
    renderer.domElement.style.opacity = '1'
    
    // Verify mount container visibility
    const mountStyle = window.getComputedStyle(mountRef.current)
    console.log('Mount container computed style:', {
      display: mountStyle.display,
      visibility: mountStyle.visibility,
      opacity: mountStyle.opacity,
      zIndex: mountStyle.zIndex,
      position: mountStyle.position,
      width: mountStyle.width,
      height: mountStyle.height
    })

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambient)
    const dir = new THREE.DirectionalLight(0xffffff, 0.6)
    dir.position.set(5, 10, 7.5)
    scene.add(dir)

    // Add test objects AFTER renderer is created and appended
    const testGeo = new THREE.BoxGeometry(10, 10, 10) // HUGE
    const testMat = new THREE.MeshBasicMaterial({ 
      color: 0x00ff00, // Bright green
      side: THREE.DoubleSide
    })
    const testMesh = new THREE.Mesh(testGeo, testMat)
    testMesh.position.set(0, 0, 0)
    scene.add(testMesh)
    console.log('🟢 HUGE green test cube (10x10x10) added to scene at origin')
    
    // Also add a bright red sphere
    const sphereGeo = new THREE.SphereGeometry(5, 32, 32)
    const sphereMat = new THREE.MeshBasicMaterial({ color: 0xff0000 })
    const sphere = new THREE.Mesh(sphereGeo, sphereMat)
    sphere.position.set(15, 0, 0)
    scene.add(sphere)
    console.log('🔴 Bright red sphere added at (15, 0, 0)')
    
    // Render immediately multiple times
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        renderer.render(scene, camera)
        console.log(`Test render ${i + 1}/5 completed`)
      }, i * 100)
    }
    
    // Keep test objects for 10 seconds
    setTimeout(() => {
      scene.remove(testMesh)
      scene.remove(sphere)
      testGeo.dispose()
      testMat.dispose()
      sphereGeo.dispose()
      sphereMat.dispose()
      console.log('Test objects removed')
    }, 10000)

    // Create a container group that will either hold the loaded GLTF model
    // or fall back to a field of low-poly objects.
    const group = new THREE.Group()
    scene.add(group)

    const floatAnimations = []

    // Try to load a GLTF model placed at `public/assets/model.glb`.
    // If it loads, we use it as the main visual and apply a continuous spin.
    let modelLoaded = false
    // Create a GLTF loader and configure DRACO for compressed GLTFs
    const loader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.4.1/')
    loader.setDRACOLoader(dracoLoader)

    // Materials that have GPU time uniforms injected
    const gpuMaterials = new Set()

    // Inject a simple Y-rotation driven by a `uTime` uniform into standard materials.
    function injectGPURotation(material, speed = 0.3) {
      if (!material || material.userData._gpuInjected) {
        // If already injected, ensure it's still visible
        if (material) {
          material.visible = true
          if (material.opacity === 0) material.opacity = 1
        }
        return material
      }
      
      // Clone material to avoid modifying original
      const clonedMaterial = material.clone()
      clonedMaterial.userData._gpuInjected = true
      clonedMaterial.visible = true
      if (clonedMaterial.opacity === 0) clonedMaterial.opacity = 1

      clonedMaterial.onBeforeCompile = (shader) => {
        shader.uniforms.uTime = { value: 0 }
        shader.vertexShader = 'uniform float uTime;\n' + shader.vertexShader

        // replace the default transformed assignment to add a Y-rotation based on time
        const replacement = shader.vertexShader.replace(
          'vec3 transformed = vec3( position );',
          `vec3 transformed = vec3( position );\n        float _angle = uTime * ${speed.toFixed(3)};\n        float _c = cos(_angle);\n        float _s = sin(_angle);\n        mat3 _rotY = mat3(_c, 0.0, _s, 0.0, 1.0, 0.0, -_s, 0.0, _c);\n        transformed = _rotY * transformed;`
        )
        
        if (replacement === shader.vertexShader) {
          // Replacement didn't work, try alternative pattern
          shader.vertexShader = shader.vertexShader.replace(
            /vec3\s+transformed\s*=\s*vec3\s*\(\s*position\s*\)\s*;/,
            `vec3 transformed = vec3( position );\n        float _angle = uTime * ${speed.toFixed(3)};\n        float _c = cos(_angle);\n        float _s = sin(_angle);\n        mat3 _rotY = mat3(_c, 0.0, _s, 0.0, 1.0, 0.0, -_s, 0.0, _c);\n        transformed = _rotY * transformed;`
          )
        } else {
          shader.vertexShader = replacement
        }

        // keep a reference to the uniform so we can update it in the render loop
        clonedMaterial.userData._uTimeUniform = shader.uniforms.uTime
        gpuMaterials.add(clonedMaterial)
      }

      return clonedMaterial
    }

    // Apply injection to all mesh materials in an object
    function applyGPUTransformToObject(obj) {
      obj.traverse((node) => {
        if (node.isMesh && node.material) {
          // handle material arrays (multi-material meshes)
          if (Array.isArray(node.material)) {
            node.material = node.material.map((m) => injectGPURotation(m) || m)
          } else {
            const newMat = injectGPURotation(node.material)
            if (newMat) node.material = newMat
          }
        }
      })
    }

    // Try multiple potential model paths in assets subdirectories
    // This will automatically find models in various folder structures
    // Supports both .glb and .gltf formats
    const modelExtensions = ['.glb', '.gltf']
    const modelNames = ['background', 'model', 'scene', 'main', 'world', 'environment', 'porsche_911_gt1_straenversion_www.vecarz.com']
    const folderNames = ['models', 'background', '3d', 'models/background', 'models/3d']
    
    // Build comprehensive list of potential paths
    const potentialModelPaths = [
      '/assets/porsche_911_gt1_straenversion_www.vecarz.com.glb', // Prioritize the Porsche model
    ]
    
    // Add root assets paths
    modelNames.forEach(name => {
      modelExtensions.forEach(ext => {
        if (!potentialModelPaths.includes(`/assets/${name}${ext}`)) {
          potentialModelPaths.push(`/assets/${name}${ext}`)
        }
      })
    })
    
    // Add folder-based paths
    folderNames.forEach(folder => {
      modelNames.forEach(name => {
        modelExtensions.forEach(ext => {
          potentialModelPaths.push(`/assets/${folder}/${name}${ext}`)
        })
      })
    })
    
    // Remove duplicates and log for debugging
    const uniquePaths = [...new Set(potentialModelPaths)]
    console.log(`BackgroundEngine: Will try ${uniquePaths.length} potential model paths`)

    // Function to try loading a model from a given URL
    const tryLoadModel = (url, onSuccess, onError) => {
      // Check cache first
      if (gltfCache.has(url)) {
      try {
          const cached = gltfCache.get(url)
          const cloned = clone(cached)
        group.clear()
          applyGPUTransformToObject(cloned)
          group.add(cloned)
        modelLoaded = true
          console.log(`Background model loaded from cache: ${url}`)
          onSuccess()
          return
      } catch (e) {
          // Cache failed, continue to load
        }
      }

      // Try to load the model
      console.log(`Attempting to load model from: ${url}`)
      loader.load(
        url,
        (gltf) => {
          try {
            console.log(`Model file loaded successfully from: ${url}`)
            const original = gltf.scene
            
            if (!original) {
              throw new Error('GLTF scene is null or undefined')
            }
            
            // store a safe clone in cache for future mounts
            try { 
              gltfCache.set(url, clone(original)) 
              console.log('Model cached successfully')
            } catch (e) {
              console.warn('Failed to cache model:', e)
            }

            // Normalize scale and position
            const bbox = new THREE.Box3().setFromObject(original)
            const size = bbox.getSize(new THREE.Vector3()).length()
            console.log(`Model bounding box size: ${size}`)
            
            // Calculate appropriate scale - make model visible but not too large
            // For a car model, we want it to be reasonably sized
            const targetSize = 10 // Reduced target size for better visibility
            const scale = targetSize / Math.max(size, 0.1)
            console.log(`Model original size: ${size}, applying scale: ${scale}`)
            
            // If scale is too extreme, use a more reasonable value
            const finalScale = Math.max(0.01, Math.min(100, scale))
            console.log(`Final scale applied: ${finalScale}`)
            original.scale.setScalar(finalScale)
            
            // Center the model in the view
            bbox.setFromObject(original)
            const center = bbox.getCenter(new THREE.Vector3())
            original.position.sub(center)
            console.log('Model centered at:', original.position)
            
            // Update bbox after centering
            bbox.setFromObject(original)
            const finalSize = bbox.getSize(new THREE.Vector3())
            console.log('Model final size after scaling and centering:', finalSize)
            console.log('Model bounding box min:', bbox.min, 'max:', bbox.max)
            
            // Disable shadows and optimize materials BEFORE cloning
            original.traverse((n) => { 
              if (n.isMesh) {
                n.castShadow = false
                n.receiveShadow = false
                // Ensure materials are visible
                if (n.material) {
                  if (Array.isArray(n.material)) {
                    n.material.forEach(mat => {
                      if (mat) {
                        mat.needsUpdate = true
                        // Ensure material is visible
                        if (mat.transparent !== undefined) mat.transparent = false
                        if (mat.opacity !== undefined && mat.opacity === 0) mat.opacity = 1
                        if (mat.visible !== undefined) mat.visible = true
                      }
                    })
                  } else {
                    n.material.needsUpdate = true
                    if (n.material.transparent !== undefined) n.material.transparent = false
                    if (n.material.opacity !== undefined && n.material.opacity === 0) n.material.opacity = 1
                    if (n.material.visible !== undefined) n.material.visible = true
                  }
                }
                // Ensure mesh is visible
                n.visible = true
              }
            })

            group.clear()
            const sceneObj = clone(original)
            
            // Ensure cloned object is visible
            sceneObj.visible = true
            sceneObj.traverse((n) => {
              if (n.isMesh) {
                n.visible = true
                if (n.material) {
                  if (Array.isArray(n.material)) {
                    n.material.forEach(mat => {
                      if (mat) {
                        mat.visible = true
                        if (mat.opacity === 0) mat.opacity = 1
                      }
                    })
                  } else {
                    n.material.visible = true
                    if (n.material.opacity === 0) n.material.opacity = 1
                  }
                }
              }
            })
            
            // TEMPORARILY: Skip GPU transform to test if that's causing visibility issues
            // Apply GPU transform (this modifies materials, so do it after visibility setup)
            // Commented out temporarily for debugging:
            // applyGPUTransformToObject(sceneObj)
            console.log('⚠️ GPU transform temporarily disabled for debugging - model should be visible but not rotating')
            
            group.add(sceneObj)
            modelLoaded = true
            
            // Verify the object is actually in the group
            console.log('SceneObj added to group. Group now has', group.children.length, 'children')
            console.log('SceneObj visible:', sceneObj.visible)
            console.log('SceneObj position:', sceneObj.position)
            console.log('SceneObj scale:', sceneObj.scale)
            
            // Verify the model is in the scene
            console.log(`✅ Background model successfully loaded and added to scene from: ${url}`)
            console.log('Model group children count:', group.children.length)
            console.log('Scene children count:', scene.children.length)
            console.log('Model bounding box after setup:', bbox)
            
            // Verify model is visible from camera
            const modelWorldPos = new THREE.Vector3()
            sceneObj.getWorldPosition(modelWorldPos)
            console.log('Model world position:', modelWorldPos)
            console.log('Camera position:', camera.position)
            const distance = camera.position.distanceTo(modelWorldPos)
            console.log('Distance from camera:', distance)
            
            // Adjust camera to ensure model is in view
            // If model is too far or too close, adjust camera
            if (distance > 100 || distance < 5) {
              console.log('⚠️ Camera distance seems off, adjusting...')
              camera.position.set(0, 0, Math.max(20, Math.min(50, distance)))
              camera.lookAt(modelWorldPos)
            } else {
              camera.lookAt(modelWorldPos)
            }
            camera.updateProjectionMatrix()
            
            // Count meshes in the model
            let meshCount = 0
            sceneObj.traverse((n) => {
              if (n.isMesh) {
                meshCount++
                console.log(`Mesh ${meshCount}: visible=${n.visible}, material visible=${n.material?.visible}, position=`, n.position)
              }
            })
            console.log(`Total meshes in model: ${meshCount}`)
            
            // Force multiple renders to ensure visibility
            for (let i = 0; i < 3; i++) {
              renderer.render(scene, camera)
            }
            console.log('Initial render completed (3x)')
            
            // Add a test cube to verify rendering works (temporarily)
            // Make it large and bright so it's definitely visible
            const testGeometry = new THREE.BoxGeometry(5, 5, 5)
            const testMaterial = new THREE.MeshBasicMaterial({ 
              color: 0x00ff00, 
              wireframe: false, // Solid, not wireframe for better visibility
              side: THREE.DoubleSide
            })
            const testCube = new THREE.Mesh(testGeometry, testMaterial)
            testCube.position.set(0, 0, 0) // Center it
            scene.add(testCube) // Add directly to scene, not group
            console.log('✅ Test green cube added directly to scene at origin - you should see a large green cube')
            console.log('Test cube position:', testCube.position)
            console.log('Test cube visible:', testCube.visible)
            
            // Also add a simple sphere for testing
            const testSphereGeo = new THREE.SphereGeometry(3, 16, 16)
            const testSphereMat = new THREE.MeshBasicMaterial({ color: 0xff0000 })
            const testSphere = new THREE.Mesh(testSphereGeo, testSphereMat)
            testSphere.position.set(10, 0, 0)
            scene.add(testSphere)
            console.log('✅ Test red sphere added at (10, 0, 0)')
            
            // Force immediate render
            renderer.render(scene, camera)
            console.log('Rendered scene with test objects')
            
            // Remove test objects after 5 seconds
            setTimeout(() => {
              scene.remove(testCube)
              scene.remove(testSphere)
              testGeometry.dispose()
              testMaterial.dispose()
              testSphereGeo.dispose()
              testSphereMat.dispose()
              console.log('Test objects removed')
            }, 5000)
            
            onSuccess()
          } catch (err) {
            console.error(`❌ Error processing model from ${url}:`, err)
            console.error('Error details:', err.stack)
            onError()
          }
        },
        (progress) => {
          // Progress callback
          if (progress && progress.total > 0) {
            const percent = (progress.loaded / progress.total) * 100
            console.log(`Loading progress for ${url}: ${percent.toFixed(1)}%`)
          }
        },
        (error) => {
          // load error — try next path
          console.error(`❌ Failed to load model from ${url}:`, error)
          if (error.message) {
            console.error('Error message:', error.message)
          }
          if (error.target && error.target.status) {
            console.error('HTTP status:', error.target.status)
          }
          onError()
        },
      )
    }

    // Try each path in sequence
    let currentPathIndex = 0
    const tryNextPath = () => {
      if (modelLoaded) {
        console.log('Model already loaded, skipping further attempts')
        return // Already loaded successfully
      }

      if (currentPathIndex >= uniquePaths.length) {
        // All paths failed, use fallback
        console.warn('⚠️ No background models found after trying all paths, using fallback field')
        console.log('Tried paths:', uniquePaths)
        populateFallbackField()
        return
      }

      const modelUrl = uniquePaths[currentPathIndex]
      console.log(`[${currentPathIndex + 1}/${uniquePaths.length}] Trying: ${modelUrl}`)
      currentPathIndex++

      tryLoadModel(
        modelUrl,
        () => {
          // Success - model loaded, no need to try more paths
          console.log('✅ Model loading successful!')
        },
        () => {
          // Failed - try next path after a short delay
          console.log(`⏭️ Moving to next path...`)
          setTimeout(tryNextPath, 200) // Slightly longer delay for better debugging
        }
      )
    }

    // Start trying paths
    console.log('🚀 Starting model discovery...')
    tryNextPath()

    // Fallback population function (creates dodecahedron field)
    function populateFallbackField() {
      const geom = new THREE.DodecahedronGeometry(1.5, 0)
      const mat = new THREE.MeshStandardMaterial({ color: 0x7dd3fc, roughness: 0.4, metalness: 0.1, transparent: true, opacity: 0.9 })

      const count = 28
      for (let i = 0; i < count; i++) {
        const mesh = new THREE.Mesh(geom, mat.clone())
        mesh.position.x = (Math.random() - 0.5) * 60
        mesh.position.y = (Math.random() - 0.5) * 40
        mesh.position.z = (Math.random() - 0.5) * 100
        mesh.scale.setScalar(0.6 + Math.random() * 1.2)
        mesh.material.opacity = 0.06 + Math.random() * 0.25
        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
        group.add(mesh)
      }

      if (!prefersReduced) {
        group.children.forEach((mesh) => {
          const delay = Math.random() * 2000
          const anim = anime({
            targets: mesh.rotation,
            x: `+=${(Math.random() - 0.5) * 2}`,
            y: `+=${(Math.random() - 0.5) * 2}`,
            z: `+=${(Math.random() - 0.5) * 2}`,
            duration: 8000 + Math.random() * 6000,
            easing: 'easeInOutSine',
            direction: 'alternate',
            loop: true,
            autoplay: true,
            delay,
          })
          floatAnimations.push(anim)
        })
      }
    }

    // If loader never calls error or success synchronously, ensure we have a fallback after a short timeout
    setTimeout(() => {
      if (!modelLoaded && group.children.length === 0) populateFallbackField()
    }, 900)

    // Smooth camera movement based on scroll
    let lastScroll = window.scrollY
    const onScroll = () => {
      const scrollY = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? scrollY / docHeight : 0

      // Rotate model based on scroll progress
      if (modelLoaded && group.children.length > 0) {
        group.rotation.y = progress * Math.PI * 4 // Full rotations as user scrolls
      }

      // animate camera z and rotation subtly
      if (!prefersReduced) {
        anime.remove(camera.position)
        anime.remove(camera.rotation)
        anime({
          targets: camera.position,
          z: 30 - progress * 18,
          x: Math.sin(progress * Math.PI * 2) * 6,
          duration: 800,
          easing: 'easeOutQuad',
        })

        anime({
          targets: camera.rotation,
          x: -progress * 0.08,
          y: progress * 0.06,
          duration: 1000,
          easing: 'easeOutQuad',
        })
      }

      lastScroll = scrollY
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    // animation loop — drive GPU uniforms for animated materials
    let frameCount = 0
    const animate = () => {
      const t = performance.now() / 1000
      frameCount++

      // update any injected material uniforms
      // materials are stored in the gpuMaterials Set via injectGPURotation
      gpuMaterials.forEach((mat) => {
        try {
          if (mat.userData && mat.userData._uTimeUniform) mat.userData._uTimeUniform.value = t
        } catch (e) {}
      })
      
      // Log first few frames for debugging
      if (frameCount <= 5) {
        console.log(`Frame ${frameCount}: Rendering scene with ${scene.children.length} children, group has ${group.children.length} children`)
        if (modelLoaded && group.children.length > 0) {
          const firstChild = group.children[0]
          if (firstChild) {
            const worldPos = new THREE.Vector3()
            firstChild.getWorldPosition(worldPos)
            console.log(`Frame ${frameCount}: Model world position:`, worldPos)
          }
        }
      }

      renderer.render(scene, camera)
      rafRef.current = requestAnimationFrame(animate)
    }

    animate()
    console.log('Animation loop started')
    
    // Additional debugging: Check if canvas is actually rendering
    setTimeout(() => {
      const canvas = renderer.domElement
      const ctx = canvas.getContext('webgl') || canvas.getContext('webgl2')
      if (!ctx) {
        console.error('❌ WebGL context not available!')
      } else {
        console.log('✅ WebGL context available:', ctx.getParameter(ctx.VERSION))
      }
      
      // Check canvas dimensions
      console.log('Canvas actual dimensions:', {
        width: canvas.width,
        height: canvas.height,
        clientWidth: canvas.clientWidth,
        clientHeight: canvas.clientHeight,
        offsetWidth: canvas.offsetWidth,
        offsetHeight: canvas.offsetHeight
      })
      
      // Check if canvas is in viewport
      const rect = canvas.getBoundingClientRect()
      console.log('Canvas bounding rect:', rect)
      console.log('Canvas is in viewport:', rect.width > 0 && rect.height > 0)
      
      // Try to read pixels to verify rendering
      const pixels = new Uint8Array(4)
      ctx.readPixels(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2), 1, 1, ctx.RGBA, ctx.UNSIGNED_BYTE, pixels)
      console.log('Center pixel color (RGBA):', pixels)
    }, 1000)

    // Resize handling
    const onResize = () => {
      const w = mountRef.current.clientWidth
      const h = mountRef.current.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    window.addEventListener('resize', onResize)

    // Clean up
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      floatAnimations.forEach(a => a.pause && a.pause())
      try {
        renderer.dispose()
      } catch (e) {}

      // dispose DRACO loader resources
      try { dracoLoader && dracoLoader.dispose && dracoLoader.dispose() } catch (e) {}

      // dispose injected GPU materials
      try {
        gpuMaterials.forEach((mat) => { try { mat.dispose && mat.dispose() } catch (e) {} })
        gpuMaterials.clear()
      } catch (e) {}

      mountRef.current && mountRef.current.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -2,
        pointerEvents: 'none',
        overflow: 'hidden',
        backgroundColor: 'transparent',
      }}
    />
  )
}
