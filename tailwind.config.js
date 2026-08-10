/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#12131A',
        paper: '#F7F7F5',
        slate: {
          850: '#1B1D27',
        },
        signal: {
          DEFAULT: '#2F5DFF',
          dark: '#1E3FCC',
          light: '#EBF0FF',
        },
        pass: '#1E8A5A',
        fail: '#C4432E',
        warn: '#C48A1E',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        card: '10px',
      },
      opacity: {
        8: '0.08',
        12: '0.12',
        15: '0.15',
      },
    },
  },
  plugins: [],
};