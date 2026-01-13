# GLB Model Instructions

## Adding a Sample GLB Model

To enable the 3D model rendering in the GlassyCard component, place a GLB file at:

```
public/assets/demo-model.glb
```

### Recommended Specifications:
- **File size**: 1-10MB (optimized)
- **Format**: GLB (binary GLTF)
- **Compression**: DRACO compression recommended for smaller file sizes
- **Poly count**: Keep under 100k triangles for best performance

### Example Models:
You can find free, optimized GLB models from:
- [Sketchfab](https://sketchfab.com) (check licensing)
- [Poly Haven](https://polyhaven.com/models)
- [Three.js Examples](https://threejs.org/examples/)

### Current Behavior:
- If `demo-model.glb` exists: Renders the 3D model with glass refraction effect
- If `demo-model.glb` is missing: Automatically falls back to Sketchfab iframe embed
- Progress bar shows loading percentage during GLB fetch

### Notes:
- The component checks for file existence before attempting to load
- DRACO decoder is loaded from Google's CDN automatically
- Models are cached in memory to avoid re-downloading
- Low-end devices automatically disable the overlay for performance

