import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF5A1F',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        brand: {
          orange: '#FF5A1F',
          'orange-dark': '#E54E16',
          navy: '#0A0A12',
          surface: '#12121E',
          border: '#1E1E30',
          cyan: '#00C2FF',
          'text-secondary': '#8BA4BE',
        },
      },
      fontFamily: {
        bebas: ['Bebas Neue', 'sans-serif'],
        exo: ['Exo 2', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
