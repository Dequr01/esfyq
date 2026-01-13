import Head from 'next/head'
import App from '../App'

export default function Home() {
  return (
    <>
      <Head>
        <title>Parallax Quote — Esfyq</title>
        <meta name="description" content="Interactive portfolio showcasing parallax, 3D and animated components built with React, Three.js and GSAP." />
        <meta name="theme-color" content="#000000" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://your-site.example/" />

        <meta property="og:title" content="Parallax Quote — Esfyq" />
        <meta property="og:description" content="Interactive portfolio showcasing parallax, 3D and animated components built with React, Three.js and GSAP." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://your-site.example/" />
        <meta property="og:image" content="/assets/og-image.svg" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Parallax Quote — Esfyq" />
        <meta name="twitter:description" content="Interactive portfolio showcasing parallax, 3D and animated components." />
        <meta name="twitter:image" content="/assets/og-image.svg" />

        <link rel="icon" type="image/svg+xml" href="/assets/og-image.svg" />

        <style>
          {`
            html, body, #__next { height: 100%; background:#0f0f0f !important; }
            body { margin: 0; background:#0f0f0f !important; }

            @media (prefers-reduced-motion: reduce) {
              * {
                animation: none !important;
                transition: none !important;
                scroll-behavior: auto !important;
              }
            }
          `}
        </style>
      </Head>
      <App />
    </>
  )
}
