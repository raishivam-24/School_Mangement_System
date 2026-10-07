/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* --- Semantic Layout Colors (reference CSS vars) --- */
        canvas: 'rgb(var(--color-canvas) / <alpha-value>)',
        surface: {
          DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)',
          raised: 'rgb(var(--color-surface-raised) / <alpha-value>)',
          overlay: 'rgb(var(--color-surface-overlay) / <alpha-value>)',
        },

        /* --- Sidebar --- */
        sidebar: {
          DEFAULT: 'rgb(var(--color-sidebar) / <alpha-value>)',
          foreground: 'rgb(var(--color-sidebar-foreground) / <alpha-value>)',
          muted: 'rgb(var(--color-sidebar-muted) / <alpha-value>)',
          active: 'rgb(var(--color-sidebar-active-bg) / <alpha-value>)',
          hover: 'rgb(var(--color-sidebar-hover) / <alpha-value>)',
        },

        /* --- Semantic Text --- */
        primary: 'rgb(var(--color-text-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
        muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
        inverse: 'rgb(var(--color-text-inverse) / <alpha-value>)',

        /* --- Borders --- */
        border: {
          DEFAULT: 'rgb(var(--color-border) / <alpha-value>)',
          light: 'rgb(var(--color-border-light) / <alpha-value>)',
          dark: 'rgb(var(--color-border-dark) / <alpha-value>)',
        },

        /* --- Accent Colors --- */
        accent: {
          blue: {
            DEFAULT: 'rgb(var(--color-accent-blue) / <alpha-value>)',
            subtle: 'rgb(var(--color-accent-blue-subtle) / <alpha-value>)',
          },
          green: {
            DEFAULT: 'rgb(var(--color-accent-green) / <alpha-value>)',
            subtle: 'rgb(var(--color-accent-green-subtle) / <alpha-value>)',
          },
          amber: {
            DEFAULT: 'rgb(var(--color-accent-amber) / <alpha-value>)',
            subtle: 'rgb(var(--color-accent-amber-subtle) / <alpha-value>)',
          },
          rose: {
            DEFAULT: 'rgb(var(--color-accent-rose) / <alpha-value>)',
            subtle: 'rgb(var(--color-accent-rose-subtle) / <alpha-value>)',
          },
          violet: {
            DEFAULT: 'rgb(var(--color-accent-violet) / <alpha-value>)',
            subtle: 'rgb(var(--color-accent-violet-subtle) / <alpha-value>)',
          },
          teal: {
            DEFAULT: 'rgb(var(--color-accent-teal) / <alpha-value>)',
            subtle: 'rgb(var(--color-accent-teal-subtle) / <alpha-value>)',
          },
        },

        /* --- Input / Form --- */
        input: {
          DEFAULT: 'rgb(var(--color-input-bg) / <alpha-value>)',
          border: 'rgb(var(--color-input-border) / <alpha-value>)',
          focus: 'rgb(var(--color-input-focus) / <alpha-value>)',
          placeholder: 'rgb(var(--color-input-placeholder) / <alpha-value>)',
        },

        ring: 'rgb(var(--color-ring) / <alpha-value>)',

        /* --- Legacy brand colors (for backward compatibility during migration) --- */
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
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'card': 'var(--shadow-card)',
        'elevated': 'var(--shadow-elevated)',
        'modal': 'var(--shadow-modal)',
        'soft': '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        'glow-sky': '0 0 20px -3px rgba(56, 189, 248, 0.3)',
        'glow-blue': '0 0 20px -3px rgba(59, 130, 246, 0.4)',
      },
    },
  },
  plugins: [],
}
