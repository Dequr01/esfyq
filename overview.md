# esfyq.vercel.app — Portfolio Overview
> Last audited: May 2026 | Stack: Next.js · React Three Fiber · Three.js · Framer Motion · Anime.js

---

## 1. Project Architecture

### Stack at a Glance
```
Next.js 16 (Pages Router) + React 19
Three.js 0.179 via @react-three/fiber 9.4 + @react-three/drei 10.7
Framer Motion 12.38 — horizontal scroll orchestration
Anime.js 3.2 — entrance stagger animations
Tailwind CSS 4.0 — utility styling
GSAP — imported in Quote.jsx but NOT in package.json (⚠ build bug)
```

### Folder Structure
```
src/
├── pages/
│   ├── index.js          ← renders App, sole entry point
│   └── _app.js           ← global providers, ThemeContext wrap
├── components/
│   ├── Hero.jsx          ← Chapter I — Genesis
│   ├── About.jsx         ← Chapter II — The Craft
│   ├── Quote.jsx         ← interstitial (GSAP bug lives here)
│   ├── Projects.jsx      ← Chapter III — The Artifacts
│   ├── Contact.jsx       ← Chapter IV — The Connection
│   ├── Navigation.jsx    ← maps section IDs to fixed scroll offsets
│   ├── ScrollHorizontal.jsx  ← drives the horizontal storytelling layout
│   ├── ModelBackground.jsx   ← PRIMARY: R3F scene + scroll camera
│   ├── BackgroundEngine.jsx  ← REDUNDANT: vanilla Three.js fallback
│   └── ui/
│       ├── MagneticButton.jsx   ← exists, underutilised
│       └── [shadcn primitives]
├── assets/
│   ├── porsche_911_gt1_straenversion_www.vecarz.com.glb  ← ACTIVE
│   ├── 1992_honda_nsx_type-r.glb                         ← alternate
│   ├── mazda_rx-7_fd.glb                                 ← unused
│   ├── robot_90s.glb                                     ← unused
│   ├── minecraft_-_steve.glb                             ← unused
│   ├── studio.glb                                        ← env lighting
│   └── tokyo/image-1.jpg … image-5.jpg
├── context/
│   └── ThemeContext.js   ← global dark/light state
└── lib/
    └── [utility helpers]

public/assets/           ← duplicate model copies (needs cleanup)
```

### Scene & Camera Architecture
- **R3F Canvas** lives in `ModelBackground.jsx` — wraps a `<Canvas>` with a `PerspectiveCamera`
- **Camera interpolation** is manually driven by scroll progress (`useScroll` from framer-motion → passed into Scene as a prop)
- **4 camera keyframes** — one per chapter — lerped on each frame
- **Environment**: `@react-three/drei` `<Environment preset="studio" />` with manual light intensity
- **Model**: Loaded via `useLoader(GLTFLoader)` + `DRACOLoader` for Draco-compressed meshes
- **Material**: `MeshStandardMaterial` with tuned metalness/roughness for car paint

---

## 2. Sections — The Chapter Map

| # | Chapter Name | Section ID | Camera Position | Content | 3D / Animation |
|---|---|---|---|---|---|
| I | The Genesis | `hero` | Wide shot — full model visible | Name, title, CTA | Text entrance via Anime.js stagger; model loads with fade |
| II | The Craft | `about` | Left close-up — driver side detail | Skills, bio, glassmorphic cards | Cards fade in via IntersectionObserver |
| III | The Artifacts | `projects` | High-angle top-down | Project grid, skills list | Grid stagger animation |
| IV | The Connection | `contact` | Low-angle dramatic | Contact form | Form fields slide up |

**Layout**: All 4 chapters sit in a horizontal scroll container managed by `ScrollHorizontal.jsx`. On mobile, this collapses to vertical.

---

## 3. Tech Stack — Full Inventory

### Dependencies (from package.json)
| Package | Version | Role |
|---|---|---|
| `next` | 16.1.1 | Framework |
| `react` / `react-dom` | 19.2.3 | UI runtime |
| `three` | 0.179.1 | 3D engine |
| `@react-three/fiber` | 9.4.0 | React renderer for Three.js |
| `@react-three/drei` | 10.7.7 | Three.js helpers (loaders, env, etc.) |
| `framer-motion` | 12.38.0 | Scroll progress + horizontal layout |
| `animejs` | 3.2.2 | DOM entrance animations |
| `tailwindcss` | 4.0.0 | Utility CSS |
| `gsap` | ⚠ MISSING | Imported in Quote.jsx — will crash in prod |

### Three.js Features Active
- `GLTFLoader` + `DRACOLoader` — compressed mesh loading
- `PerspectiveCamera` — with FOV adjustments per breakpoint
- `MeshStandardMaterial` — PBR car materials
- `Environment` (drei) — studio HDRI lighting preset
- Manual per-frame lerp — camera path between 4 keyframe positions

### Animation Strategy (currently fragmented)
```
Framer Motion  →  horizontal scroll container, progress tracking
Anime.js       →  DOM element entrances (Hero, About, Projects)
IntersectionObserver  →  triggers for card/grid reveals
GSAP           →  intended for Quote.jsx, broken (missing dep)
Manual lerp    →  camera interpolation inside useFrame()
```
**Problem**: 3 animation libraries + manual math doing the same class of work with no unified strategy.

---

## 4. Confirmed Visual Bugs — Screenshot Evidence (May 13 2026)

> **AGENT NOTE — READ THIS FIRST**: The following bugs are confirmed from a live production screenshot of https://esfyq.vercel.app taken May 13 2026. This is not speculation. The site is visually broken right now. Your job in PHASE 1 is exclusively bug fixes — no new features, no polish, no refactors outside the broken areas. Fix each bug, verify it visually, then move to the next. Do not proceed to PHASE 2 until every 🔴 item below is resolved.

---

### 🔴 BUG-01 — Wrong 3D Model Is Rendering (Minecraft Steve Instead of Porsche)

**Screenshot evidence**: The hero background shows a Minecraft block-world/Steve scene, not the Porsche 911 GT1.

**What's broken**: `ModelBackground.jsx` is loading `minecraft_-_steve.glb` instead of `porsche_911_gt1_straenversion_www.vecarz.com.glb`. This is the PRIMARY hero model — having the wrong one here breaks the entire visual identity of the site.

**Likely root cause**: The `useLoader(GLTFLoader, ...)` call has the wrong path string, or a stale import alias points to the Minecraft model. Possibly an accidental swap when testing alternate models.

**Exact fix**:
1. Open `ModelBackground.jsx`
2. Find every `import` statement referencing a `.glb` file and every `useLoader(GLTFLoader, path)` call
3. Ensure the loaded path resolves to `porsche_911_gt1_straenversion_www.vecarz.com.glb`
4. Remove every reference to `minecraft_-_steve.glb` from this file
5. Do a project-wide search (`grep -r "steve" src/`) — remove every import or reference
6. Delete `minecraft_-_steve.glb` from the filesystem entirely

---

### 🔴 BUG-02 — Horizontal Scroll Is Completely Broken (Site Is a Static Page)

**Screenshot evidence**: Only Chapter I (The Genesis) is visible. The site does not scroll horizontally. Chapters II, III, IV (The Craft, The Artifacts, The Connection) are completely unreachable.

**What's broken**: `ScrollHorizontal.jsx` + Framer Motion `useScroll` is not functioning. The scroll progress value stays frozen at 0, so the horizontal track never moves and the camera never changes position.

**Likely root causes** (check all):
- Outer scroll container missing `overflow-y: scroll` or `overflow-y: auto`
- `useScroll({ container: containerRef })` ref not attached to the correct DOM element
- Inner horizontal track missing `display: flex` or wrong `width` calculation
- The scroll container has `height` not set, so it has no scrollable area
- `scrollYProgress` motion value not passed down to `ModelBackground.jsx`

**Exact fix**:
1. Open `ScrollHorizontal.jsx`
2. Outer container div must have: `style={{ height: '100vh', overflowY: 'scroll', position: 'relative' }}`
3. Inner horizontal track must have: `style={{ display: 'flex', flexDirection: 'row', width: 'calc(4 * 100vw)' }}`
4. Each chapter panel must have: `style={{ width: '100vw', height: '100vh', flexShrink: 0 }}`
5. `useScroll({ container: containerRef })` — confirm `containerRef` is attached via `ref={containerRef}` to the **outer** scrollable div (not the track, not window, not document)
6. Add a temporary `console.log(scrollYProgress.get())` inside a scroll event listener to verify the value changes from 0 to 1 as you scroll. If it stays at 0, the ref is detached.
7. Trace `scrollYProgress` down through props to `ModelBackground.jsx` — confirm it arrives and is read inside `useFrame()`

---

### 🔴 BUG-03 — Hero Text Wrapped in a Full-Viewport Frosted Glass Card

**Screenshot evidence**: The headline "Bringing ideas to life", subtitle "GOOD CODE IS LIKE POETRY", body copy, and CTA button are all enclosed in a large rounded frosted-glass rectangle that covers roughly 80% of the viewport. The 3D scene is visible only at the bottom edge, cropped by this card.

**What's broken**: In `Hero.jsx`, the outermost content wrapper has `backdrop-filter: blur(...)`, `background: rgba(...)`, and `border-radius` applied to it. This traps all hero content in a card box instead of letting it float transparently over the 3D canvas. This is either a debug container that was never cleaned up, or a glassmorphic component accidentally wrapping the full hero instead of a small element.

**Exact fix**:
1. Open `Hero.jsx`
2. Find the outermost wrapper `<div>` around all hero content
3. Remove from it: `backdrop-filter`, `background`, `background-color`, `border`, `border-radius`, `box-shadow`, and any `padding` that was compensating for the card shape
4. The hero text elements should now sit directly over the `<Canvas>` with no card background
5. Glassmorphism is acceptable ONLY on small child elements — e.g. a skill badge, a small subtitle pill, or a tag. Never on the full hero wrapper.
6. Verify: the canvas/3D scene should be fully visible behind the text with no opaque or blurred overlay covering it

---

### 🟡 BUG-04 — "SCROLL" Label Overlapping the CTA Button

**Screenshot evidence**: The text "SCROLL" appears directly below "View My Work" with almost no gap — they read as a single merged element rather than a button + separate scroll hint.

**What's broken**: The scroll indicator in `Hero.jsx` is either `position: absolute` with wrong coordinates, or in document flow immediately after the button with insufficient margin.

**Exact fix**:
1. Open `Hero.jsx`, find the scroll indicator element (contains "SCROLL" text and likely a down arrow icon)
2. If `position: absolute`: set `bottom: 2rem; left: 50%; transform: translateX(-50%); top: auto`
3. If in normal flow: add `marginTop: '2rem'` and ensure it is a separate element from the button — not a child of the `<button>` element
4. The scroll indicator must be visually separate from the button with clear breathing room

---

### 🔴 BUG-05 — Camera Is Frozen (Static Background, No Scroll-Driven Movement)

**Screenshot evidence**: The 3D background does not move or react to scroll. It sits completely static like a wallpaper image.

**Root cause**: This is a downstream symptom of BUG-02. Because `scrollYProgress` stays at 0, the camera lerp in `ModelBackground.jsx` never executes past the first keyframe.

**Fix**: Resolves automatically when BUG-02 is fixed. After fixing scroll, verify by opening `ModelBackground.jsx` and confirming the `useFrame` callback reads the live motion value like this:
```js
useFrame(() => {
  const p = scrollProgress.get() // must return changing values 0→1
  camera.position.lerpVectors(keyframes[a].position, keyframes[b].position, t)
  camera.lookAt(...)
})
```
If `scrollProgress.get()` always returns 0 even after BUG-02 fix, the prop is stale — ensure `scrollYProgress` is passed as a motion value reference, not a raw number snapshot.

### 🔴 BUG-04 — "SCROLL" Label Overlapping the CTA Button
**What's broken**: The word "SCROLL" is rendered directly on top of the "View My Work" button, making both unreadable and unclickable.
**Root cause**: In `Hero.jsx`, the scroll indicator element (likely an animated `<span>` or `<p>` with `position: absolute`) has incorrect `top`/`bottom` coordinates that place it inside the button's bounding box instead of below it.
**Fix**: Find the scroll indicator element in `Hero.jsx`. Give it `position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%)` to anchor it to the bottom of the viewport, separate from the button. Or if it's in normal flow, add `margin-top: 1.5rem` to push it below the button.

### 🔴 BUG-05 — 3D Background Frozen / Not Responding to Scroll
**What's broken**: The 3D scene renders but is completely static — no camera movement, no model animation, no response to user input. It looks like a screenshot.
**Root cause**: Directly caused by BUG-02. Since `scrollYProgress` from Framer Motion never changes (scroll is broken), the camera lerp in `useFrame` always interpolates toward keyframe[0] and stays there. The R3F canvas is rendering correctly, but has nothing to animate.
**Fix**: Fix BUG-02 first. Once scroll progress flows correctly into `ModelBackground.jsx`, camera movement should resume. After that, verify the `useFrame` callback reads the live progress value and not a stale closure.

---

## 5. Known Bugs & Limitations (Pre-existing)

### Critical
- [ ] **GSAP not installed** — `Quote.jsx` imports `gsap` which is absent from `package.json`. Silent runtime crash in production.

### Architecture
- [ ] **Dual background engines** — `ModelBackground.jsx` (R3F) and `BackgroundEngine.jsx` (vanilla) coexist. Dead code, remove `BackgroundEngine.jsx`.
- [ ] **Asset duplication** — GLB files in both `/src/assets` and `/public/assets`. Unused models (Mazda, Robot, Steve) inflate build size.

### UX / Performance
- [ ] **No lazy loading** — all GLBs load upfront. No `<Suspense>` boundaries with meaningful fallbacks.
- [ ] **No low-poly fallback** — mobile gets full-res model.
- [ ] **Navigation hardcoded offsets** — `Navigation.jsx` uses fixed pixel heights that break on non-standard screens.
- [ ] **No loading screen** — no perceived loading state while 3D assets hydrate.

### Missing Portfolio Content
- [ ] No testimonials or social proof
- [ ] No case study depth — projects grid has no detail views
- [ ] No résumé / CV download link

---

## 6. Assets Inventory

### 3D Models
| File | Location | Status |
|---|---|---|
| `porsche_911_gt1_straenversion_www.vecarz.com.glb` | `/src/assets` | ✅ Active (primary) |
| `1992_honda_nsx_type-r.glb` | `/src/assets` | 🟡 Alternate (loaded?) |
| `mazda_rx-7_fd.glb` | `/src/assets` | ❌ Unused |
| `robot_90s.glb` | `/src/assets` | ❌ Unused |
| `minecraft_-_steve.glb` | `/src/assets` | ❌ Unused |
| `studio.glb` | `/src/assets` | ✅ Env lighting |

### Images & Media
| File | Status |
|---|---|
| `tokyo/image-1.jpg … image-5.jpg` | ✅ Narrative visuals |
| `Background.jpg` | ❌ Unused fallback |
| `og-image.svg` | ✅ SEO meta image |

**Action needed**: Delete unused models. Convert JPGs to `.webp`. Run remaining GLBs through `gltf-pipeline -d` for Draco re-compression.

---

## 7. Upgrade Roadmap — From Good to World-Class

### Tier 1 — Fix the Foundation (do these first)
1. **Install GSAP** — `npm i gsap` and audit `Quote.jsx` usage
2. **Delete `BackgroundEngine.jsx`** — remove vanilla Three.js dead code
3. **Purge unused assets** — Mazda, Robot, Steve, Background.jpg
4. **Add `<Suspense>` + loader screen** — spinner or progress bar while GLB loads
5. **Fix Navigation.jsx** — replace fixed-height offsets with dynamic section refs

### Tier 2 — Elevate the 3D (the visual wow)
6. **GSAP ScrollTrigger camera paths** — replace manual lerp with scrubable, eased camera animation. Reference: Bruno Simon's portfolio approach.
7. **Drag-to-rotate model interaction** — let users orbit the car on hover/drag, auto-resume scroll sync after idle
8. **Digital Dissolve shader** — GLSL transition between chapters using a noise-based dissolve (replaces hard cuts)
9. **Baked lighting for mobile** — pre-bake environment to a texture map, drop `<Environment>` on mobile for 60fps
10. **Post-processing** — add `@react-three/postprocessing`: Bloom on car paint, subtle Vignette, Chromatic Aberration on transitions

### Tier 3 — Micro-interactions & Polish
11. **MagneticButton.jsx everywhere** — apply to all CTAs, nav links, and project cards
12. **Cursor trail** — custom WebGL cursor that reacts to the 3D scene depth
13. **Sound design** — optional ambient audio tied to scroll position (engine idle, wind, etc.)
14. **SplitText reveal** — replace Anime.js text stagger with GSAP SplitText for per-character physics-based entrances
15. **Project case study modals** — expand project cards to full-screen detail overlays with their own mini 3D scene or video

### Tier 4 — Content & SEO
16. **Resume/CV download** — floating pill button, always accessible
17. **Project depth** — each project gets a cover image, tech stack tags, live/GitHub links
18. **Loading experience** — branded intro animation while assets hydrate (logo morph, progress ring)

---

## 8. Current State Summary

The site is architecturally ambitious — a cinematic, scroll-driven 3D portfolio with a clear "Apple meets cyberpunk" identity and a chapter-based narrative that few portfolios attempt. The 3D camera storytelling concept is genuinely strong and worth building on.

**What's working well**: The chapter structure gives the portfolio a memorable flow. The Porsche 911 model choice is distinctive. The Framer Motion horizontal scroll creates a film-like quality.

**The biggest single gap**: There is no unified animation strategy. GSAP, Anime.js, Framer Motion, and manual `useFrame` lerps are all doing overlapping jobs with no clear ownership. This creates jank at section boundaries and makes the code nearly impossible to orchestrate into something truly smooth. **Consolidating onto GSAP ScrollTrigger as the single scroll-animation authority** — with R3F handling only 3D rendering — is the most impactful single change possible.

---

## 9. Antigravity Fix Brief — AI Agent Instructions

> Read this section carefully. This is your work order. Execute bugs in the priority order listed. Do not start polish or upgrade work until all 🔴 bugs are resolved and verified.

### Priority Order
```
PHASE 1 — Broken (fix first, nothing else works without these)
  BUG-02  Horizontal scroll
  BUG-05  Camera frozen (auto-resolves after BUG-02)
  BUG-01  Wrong 3D model
  BUG-03  Hero glass card wrapper
  BUG-04  SCROLL label overlapping button

PHASE 2 — Crashing (fix before any animation work)
  Install gsap package, audit Quote.jsx

PHASE 3 — Cleanup (remove bloat)
  Delete BackgroundEngine.jsx
  Remove minecraft_-_steve.glb, mazda_rx-7_fd.glb, robot_90s.glb, Background.jpg
  Consolidate /src/assets and /public/assets — one location only

PHASE 4 — Polish (only after phases 1-3 are green)
  Add <Suspense> loading screen
  Fix Navigation.jsx hardcoded offsets
  Apply MagneticButton to all CTAs
  Add CV download button
```

### Per-Bug Fix Instructions for AI

**BUG-01**: Open `ModelBackground.jsx`. Find every `import` or `useLoader` reference to a GLB file. Ensure only `porsche_911_gt1_straenversion_www.vecarz.com.glb` is loaded as the primary scene model. Remove any reference to `minecraft_-_steve.glb`. Confirm the path resolves correctly relative to the file location.

**BUG-02**: Open `ScrollHorizontal.jsx`. Verify:
- Outer container: `height: 100vh; overflow-y: scroll; position: relative`
- Inner horizontal track: `display: flex; flex-direction: row; width: calc(4 * 100vw)`  
- Each chapter panel: `width: 100vw; height: 100vh; flex-shrink: 0`
- `useScroll({ container: containerRef })` ref is attached to the outer scrollable div, not `window`
- Log `scrollYProgress.get()` on scroll event to confirm it changes. If it does not change, the ref is detached — re-attach it.

**BUG-03**: Open `Hero.jsx`. Find the outermost wrapping div around the hero content. Strip `backdrop-filter`, `background`, `background-color`, `border-radius`, and `border` from it. Hero text must float directly over the canvas. Glassmorphic styling is only acceptable on child elements (e.g. a small badge or the subtitle tag), not the full hero container.

**BUG-04**: Open `Hero.jsx`. Find the scroll indicator element (likely contains the text "SCROLL" or "↓"). If it is `position: absolute`, set `bottom: 2rem; left: 50%; transform: translateX(-50%); top: auto`. If it is in normal document flow, ensure it comes after the button in the JSX and has `margin-top: 1.5rem`. The button and scroll label must never overlap.

**BUG-05**: Auto-resolves when BUG-02 is fixed. After fixing scroll, open `ModelBackground.jsx` and confirm the `useFrame` callback reads from the live `scrollYProgress` motion value — not a stale captured value. Pattern should be: `useFrame(() => { const p = scrollProgress.get(); camera.position.lerpVectors(keyframes[a], keyframes[b], p) })`.

### Definition of Done
- [ ] Site loads and shows Porsche 911 GT1 (not Minecraft Steve)
- [ ] Scrolling on desktop transitions through all 4 chapters horizontally
- [ ] Camera moves between 4 keyframe positions as user scrolls
- [ ] Hero text is NOT inside a glass card — it floats over the 3D scene
- [ ] "SCROLL" indicator is below the CTA button with no overlap
- [ ] No console errors related to `gsap` missing
- [ ] `BackgroundEngine.jsx` deleted
- [ ] Unused GLB files deleted