import Head from 'next/head'
import App from '../App'

export default function Home() {
  return (
    <>
      <Head>
        <title>Esfyq_</title>
        <meta name="description" content="Official portfolio of Esfyq_ — Architecting high-performance digital experiences." />
        <meta name="theme-color" content="#000000" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://your-site.example/" />

        <meta property="og:title" content="Esfyq_" />
        <meta property="og:description" content="Official portfolio of Esfyq_ — Architecting high-performance digital experiences." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://your-site.example/" />
        <meta property="og:image" content="/assets/og-image.svg" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Esfyq_" />
        <meta name="twitter:description" content="Official portfolio of Esfyq_." />
        <meta name="twitter:image" content="/assets/og-image.svg" />

        <link rel="icon" type="image/svg+xml" href="/assets/og-image.svg" />

        <style>
          {`
            html, body, #__next { height: 100%; background:transparent; }
            body { margin: 0; background:transparent; }

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
