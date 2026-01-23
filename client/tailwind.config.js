/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f0f14',
        foreground: '#e8e6f0',
        card: {
          DEFAULT: '#1a1a24',
          foreground: '#e8e6f0',
        },
        primary: {
          DEFAULT: '#a78bfa',
          foreground: '#0f0f14',
        },
        secondary: {
          DEFAULT: '#2d2d3a',
          foreground: '#e8e6f0',
        },
        accent: {
          DEFAULT: '#5eead4',
          foreground: '#0f0f14',
        },
        muted: {
          DEFAULT: '#3f3f50',
          foreground: '#a1a1aa',
        },
        destructive: {
          DEFAULT: '#f87171',
          foreground: '#0f0f14',
        },
        border: '#2d2d3a',
        ring: '#a78bfa',
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.375rem',
      },
    },
  },
  plugins: [],
};
