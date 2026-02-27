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
        background: '#0a0a0f',
        foreground: '#e8e6f0',
        card: {
          DEFAULT: '#111118',
          foreground: '#e8e6f0',
        },
        primary: {
          DEFAULT: '#facc15',
          foreground: '#0a0a0f',
        },
        secondary: {
          DEFAULT: '#1e1e2a',
          foreground: '#e8e6f0',
        },
        accent: {
          DEFAULT: '#22d3ee',
          foreground: '#0a0a0f',
        },
        muted: {
          DEFAULT: '#3f3f50',
          foreground: '#71717a',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#0a0a0f',
        },
        success: {
          DEFAULT: '#34d399',
          foreground: '#0a0a0f',
        },
        warning: {
          DEFAULT: '#fb923c',
          foreground: '#0a0a0f',
        },
        'accent-pink': '#f472b6',
        border: '#1e1e2a',
        ring: '#facc15',
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
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
