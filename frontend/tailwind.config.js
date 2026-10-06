/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#F4F7FC',
        surface: '#FFFFFF',
        brand: {
          sky: '#38BDF8',
          'sky-dark': '#0284C7',
          'sky-light': '#E0F2FE',
          yellow: '#FCD34D',
          'yellow-dark': '#D97706',
          'yellow-light': '#FEF3C7',
          lilac: '#C4B5FD',
          'lilac-dark': '#7C3AED',
          'lilac-light': '#EDE9FE',
          mint: '#34D399',
          'mint-dark': '#059669',
          'mint-light': '#D1FAE5',
          rose: '#FB7185',
          'rose-dark': '#E11D48',
          'rose-light': '#FFE4E6',
        },
        slate: {
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
          600: '#475569',
          500: '#64748B',
          400: '#94A3B8',
          300: '#CBD5E1',
          200: '#E2E8F0',
          100: '#F1F5F9',
          50: '#F8FAFC',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        'card': '0 2px 12px -2px rgba(15, 23, 42, 0.04)',
        'glow-sky': '0 0 20px -3px rgba(56, 189, 248, 0.3)',
      }
    },
  },
  plugins: [],
}
