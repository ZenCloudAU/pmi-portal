/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        mono: ['"DM Mono"', '"Courier New"', 'monospace'],
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
          DEFAULT: '#E8630A',
          light:   '#F0741B',
          dim:     '#E8630A15',
        },
      },
    },
  },
  plugins: [],
}
