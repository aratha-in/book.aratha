/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: '#0d0d0d',
          900: '#171717',
          800: '#262626',
          700: '#404040',
          600: '#525252',
        },
        ivory: {
          50: '#FDFCF7',
          100: '#F8F5EF',
          200: '#EFE9DD',
          300: '#E3D8C3',
        },
        gold: {
          100: '#F5EEDC',
          200: '#E7D5AC',
          300: '#D5BC7C',
          400: '#C7A965',
          500: '#B99A5B', // Primary Muted Gold
          600: '#9E824A',
          700: '#7E6637',
        },
        editorial: {
          border: '#E5DFD5',
          muted: '#6B7280',
          dark: '#171717',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'Cambria', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        cormorant: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'book': '0 10px 30px -5px rgba(23, 23, 23, 0.15), 0 0 0 1px rgba(23, 23, 23, 0.05)',
        'book-lg': '0 20px 40px -10px rgba(23, 23, 23, 0.25), 0 0 0 1px rgba(23, 23, 23, 0.08)',
        'subtle': '0 2px 10px rgba(0, 0, 0, 0.03), 0 0 0 1px rgba(0, 0, 0, 0.04)',
        'elevated': '0 12px 32px rgba(23, 23, 23, 0.08)',
      }
    },
  },
  plugins: [],
}
