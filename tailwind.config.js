/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx}",
    "./src/pages/**/*.{js,jsx}",
    "./src/utils/**/*.{js,jsx}",
    "./src/**/*"
  ],
  safelist: [
    // Animasyon sınıfları
    'animate-fade-in',
    'animate-slide-up', 
    'animate-stagger-1',
    'animate-stagger-2',
    'animate-stagger-3',
    'animate-stagger-4',
    'hover-lift',
    'hover-scale',
    'hover-glow',
    'card-animate',
    // Button Design System
    'btn-base',
    'btn-primary',
    'btn-secondary', 
    'btn-ghost',
    'btn-danger',
    'btn-success',
    'btn-whatsapp',
    'btn-fab',
    'btn-icon',
    'btn-icon--danger',
    'btn-icon--success',
    'btn-magnetic',
    'btn-dark-bg',
    // Primary renk pattern
    {
      pattern: /^(bg|text|border|ring)-primary-(50|100|200|300|400|500|600|700|800|900)$/,
    }
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'rgba(var(--primary-rgb), 0.05)',
          100: 'rgba(var(--primary-rgb), 0.1)',
          200: 'rgba(var(--primary-rgb), 0.2)',
          300: 'rgba(var(--primary-rgb), 0.3)',
          400: 'rgba(var(--primary-rgb), 0.4)',
          500: 'var(--primary-500)',
          600: 'var(--primary-600)',
          700: 'var(--primary-700)',
          800: 'var(--primary-800)',
          900: 'var(--primary-900)',
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      // Semantic tokens for consistent theming
      surface: '#ffffff',
      muted: '#f3f4f6',
      accent: '#3b82f6',
      onSurface: '#111827',
      success: '#16a34a',
      warning: '#f59e0b',
      danger: '#ef4444',
      info: '#0ea5e9',
      card: '#ffffff',
      // Typography scale (semantic sizes)
      fontSize: {
        h1: ['2rem', { lineHeight: '1.1' }],
        h2: ['1.5rem', { lineHeight: '1.2' }],
        h3: ['1.25rem', { lineHeight: '1.25' }],
        base: ['1rem', { lineHeight: '1.5' }],
        sm: ['0.875rem', { lineHeight: '1.25' }]
      },
      // Additional spacing tokens
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem'
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem'
        }
      }
    }
  },
  plugins: [],
}
