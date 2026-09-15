/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#F2E6D0',
          light: '#FAF3E3',
          dark: '#E4D3AE',
        },
        curtain: {
          DEFAULT: '#7C2D2D',
          dark: '#5B1F1F',
          light: '#9B4444',
        },
        walnut: {
          DEFAULT: '#3B2A20',
          light: '#5A4432',
        },
        mustard: {
          DEFAULT: '#D9A441',
          dark: '#B8842B',
          light: '#E8C273',
        },
        teal: {
          DEFAULT: '#4F7B74',
          dark: '#375955',
        },
        filmblack: '#1C1712',
      },
      fontFamily: {
        display: ['"Abril Fatface"', 'serif'],
        type: ['"Special Elite"', 'monospace'],
      },
      boxShadow: {
        ticket: '0 4px 0 0 rgba(28,23,18,0.9)',
        booth: '0 20px 50px -12px rgba(28,23,18,0.55)',
      },
      backgroundImage: {
        grain: "radial-gradient(rgba(28,23,18,0.06) 1px, transparent 1px)",
      },
      backgroundSize: {
        grain: '4px 4px',
      },
      keyframes: {
        flash: {
          '0%': { opacity: '0' },
          '15%': { opacity: '0.9' },
          '100%': { opacity: '0' },
        },
        popin: {
          '0%': { transform: 'scale(0.6) rotate(-6deg)', opacity: '0' },
          '100%': { transform: 'scale(1) rotate(-2deg)', opacity: '1' },
        },
        bulbGlow: {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        flash: 'flash 550ms ease-out forwards',
        popin: 'popin 420ms cubic-bezier(.2,.9,.3,1.3) forwards',
        bulbGlow: 'bulbGlow 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
