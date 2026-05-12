/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:       { DEFAULT: '#020617', surface: '#0f172a', elevated: '#1e293b' },
        glass:    { DEFAULT: 'rgba(15, 23, 42, 0.55)', light: 'rgba(30, 41, 59, 0.4)' },
        primary:  { DEFAULT: '#6366f1', hover: '#818cf8', muted: '#4f46e5', glow: 'rgba(99, 102, 241, 0.35)' },
        accent:   { DEFAULT: '#22d3ee', glow: 'rgba(34, 211, 238, 0.25)' },
        success:  { DEFAULT: '#10b981', muted: 'rgba(16, 185, 129, 0.12)' },
        danger:   { DEFAULT: '#ef4444', muted: 'rgba(239, 68, 68, 0.12)' },
        warning:  { DEFAULT: '#f59e0b' },
        border:   { DEFAULT: 'rgba(255, 255, 255, 0.06)', hover: 'rgba(255, 255, 255, 0.12)', focus: 'rgba(99, 102, 241, 0.5)' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['clamp(2rem, 5vw, 3.5rem)', { lineHeight: '1.1', fontWeight: '800', letterSpacing: '-0.03em' }],
        'heading': ['clamp(1.25rem, 3vw, 2rem)', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.02em' }],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'glass-hover': '0 16px 48px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        'glow': '0 0 40px rgba(99, 102, 241, 0.15)',
        'glow-lg': '0 0 60px rgba(99, 102, 241, 0.25)',
        'input-focus': '0 0 0 4px rgba(99, 102, 241, 0.15)',
      },
      animation: {
        'shimmer': 'shimmer 2s infinite linear',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'mesh': 'mesh 20s ease infinite',
        'border-glow': 'border-glow 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        mesh: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'border-glow': {
          '0%, 100%': { borderColor: 'rgba(99, 102, 241, 0.2)' },
          '50%': { borderColor: 'rgba(99, 102, 241, 0.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
