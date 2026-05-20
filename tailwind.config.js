/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Barlow Condensed"', 'sans-serif'],
      },
      colors: {
        surface: {
          900: '#060D18',
          800: '#0A1523',
          700: '#0D1C2E',
          600: '#1A2840',
          500: '#243650',
        },
        brand: {
          DEFAULT: '#E8A020',
          light:   '#F5B93A',
          dim:     '#E8A02015',
        },
      },
    },
  },
  plugins: [],
}
