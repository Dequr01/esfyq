/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        vt: ['VT323', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        sans: ['Helvetica', 'Arial', 'sans-serif'],
      },
      keyframes: {
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'spin-slow': 'spin-slow 6s linear infinite',
      },
    },
  },
  plugins: [],
}
