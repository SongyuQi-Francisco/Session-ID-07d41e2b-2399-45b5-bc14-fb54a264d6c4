import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        zinc: {
          950: '#09090B',
          900: '#18181B',
          800: '#27272A',
        },
        emerald: {
          500: '#10B981',
        },
        violet: {
          500: '#8B5CF6',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
        sans: ['Noto Sans SC', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 15px rgba(16, 185, 129, 0.3)',
        'glow-violet': '0 0 15px rgba(139, 92, 246, 0.3)',
      },
      animation: {
        'typing': 'typing 1.5s steps(20, end)',
        'blink': 'blink 0.75s step-end infinite',
        'glitch': 'glitch 1s linear infinite',
        'slide-in': 'slideIn 0.5s ease-out',
      },
      keyframes: {
        typing: {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        blink: {
          'from, to': { borderColor: 'transparent' },
          '50%': { borderColor: '#10B981' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        slideIn: {
          'from': { transform: 'translateX(100%) opacity(0)' },
          'to': { transform: 'translateX(0) opacity(1)' },
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};

export default config;