"use client"

import { motion, useScroll, useTransform, useSpring } from "motion/react"
import { useRef, Children } from "react"

export default function ScrollHorizontal({ children, containerRef, scrollYProgress }) {
    const childrenCount = Children.count(children)

    // Smooth progress for premium feel - adjusted for snapping compatibility
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 80,
        damping: 25,
        restDelta: 0.001
    })

    // Move from first item centered to last item centered
    const x = useTransform(smoothProgress, [0, 1], ["0vw", `-${(childrenCount - 1) * 100}vw`])

    return (
        <div id="story-teller" className="relative z-10 w-full h-full">
            {/* The scroll container defines the length of the scrollable area */}
            <div 
                ref={containerRef} 
                className="scroll-container"
            >
                <div className="scroll-spacer" style={{ height: `calc(${childrenCount} * 100vh)` }}>
                    {/* Snap points for vertical scroll mapping */}
                    <div className="snap-points">
                        {Array.from({ length: childrenCount }).map((_, i) => (
                            <div key={i} className="snap-point" />
                        ))}
                    </div>

                    <div className="sticky-wrapper">
                        {/* Story progress bar - fixed at bottom */}
                        <motion.div
                            className="progress-bar"
                            style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
                        />

                        <motion.div className="gallery" style={{ x }}>
                            {Children.map(children, (child, index) => (
                                <div key={index} className="gallery-item">
                                    <div className="item-wrapper">
                                        {child}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>

            <StyleSheet />
        </div>
    )
}

/**
 * ==============   Styles   ================
 */

function StyleSheet() {
    return (
        <style>{`
            html, body, #__next, .app-container {
                height: 100%;
                overflow: hidden;
                margin: 0;
                padding: 0;
            }

            .scroll-container {
                height: 100vh;
                width: 100vw;
                overflow-y: scroll;
                overflow-x: hidden;
                position: relative;
                scroll-snap-type: y mandatory;
                scrollbar-width: none; /* Hide scrollbar for Firefox */
                -ms-overflow-style: none;  /* Hide scrollbar for IE/Edge */
            }

            .scroll-container::-webkit-scrollbar {
                display: none; /* Hide scrollbar for Chrome/Safari */
            }

            .scroll-spacer {
                position: relative;
                width: 100%;
            }

            .snap-points {
                position: absolute;
                top: 0;
                left: 0;
                width: 1px;
                height: 100%;
                pointer-events: none;
            }

            .snap-point {
                height: 100vh;
                width: 100%;
                scroll-snap-align: start;
            }

            .sticky-wrapper {
                position: sticky;
                top: 0;
                height: 100vh;
                width: 100vw;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                overflow: hidden;
            }

            .progress-bar {
                position: absolute; /* Relative to sticky-wrapper/viewport */
                bottom: 0;
                left: 0;
                width: 100%;
                height: 4px;
                background: linear-gradient(to right, #ffffff, rgba(255, 255, 255, 0.2));
                z-index: 100;
                transform-origin: left;
            }

            .gallery {
                display: flex;
                flex-direction: row;
                height: 100vh;
                will-change: transform;
            }

            .gallery-item {
                flex-shrink: 0;
                width: 100vw;
                height: 100vh;
                position: relative;
                overflow: hidden;
            }

            .item-wrapper {
                width: 100%;
                height: 100%;
            }

            @media (max-width: 768px) {
                .scroll-container {
                    overflow-y: auto;
                    scroll-snap-type: none;
                    height: auto;
                }
                .scroll-spacer {
                    height: auto !important;
                }
                .sticky-wrapper {
                    position: relative;
                    height: auto;
                    width: 100%;
                    overflow: visible;
                }
                .gallery {
                    flex-direction: column;
                    height: auto;
                    transform: none !important;
                }
                .gallery-item {
                    width: 100%;
                    height: auto;
                    min-height: 100vh;
                }
                .progress-bar {
                    display: none;
                }
                .snap-points {
                    display: none;
                }
            }
        `}</style>
    )
}
