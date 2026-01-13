Placing a GLB model for the Porsche card

To enable the in-card GLTF rendering and true GPU refraction, place a GLB file at:

  public/assets/porsche.glb

Notes:
- If your GLB is DRACO-compressed, the code uses the DRACO decoder from Google's CDN.
- For best visuals, use a reasonably optimized GLB (~1-10MB). Large models will slow rendering.
- If you can't provide a GLB, the card will still display but without the actual model texture (overlay will remain artistic). To revert to the Sketchfab iframe instead, edit `src/components/Projects.jsx` to use the iframe embed.

Security / Licensing:
- Only include models you have rights to redistribute or host. Respect Sketchfab/author licensing before downloading and hosting a model locally.
