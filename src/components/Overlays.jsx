import React from 'react'

/**
 * Overlays
 * - Top and bottom gradient vignettes to match the reference mock.
 * - Subtle large soft circle at top-right.
 * - Pointer-events disabled so it never blocks interactions.
 */
export default function Overlays() {
  return (
    <div className="pointer-events-none fixed inset-0 z-10">
      {/* Top dark vignette */}
      <div className="absolute inset-x-0 top-0 h-40 sm:h-48 bg-gradient-to-b from-black/70 via-black/40 to-transparent" />
      {/* Bottom rose/red vignette */}
      <div className="absolute inset-x-0 bottom-0 h-44 sm:h-56 bg-gradient-to-t from-rose-700/40 via-rose-600/20 to-transparent" />
      {/* Large soft circle highlight on top-right */}
      <div className="absolute -top-16 -right-24 w-96 h-96 rounded-full bg-white/5 blur-2xl" />
    </div>
  )
}
