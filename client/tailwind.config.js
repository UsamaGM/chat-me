/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      flex: {
        "2/3": "0.666667",
        "1/3": "0.333333",
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        typing: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
          '100%': { transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        ring: {
          '0%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(10deg)' },
          '50%': { transform: 'rotate(-10deg)' },
          '75%': { transform: 'rotate(5deg)' },
          '100%': { transform: 'rotate(0deg)' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out',
        typing1: 'typing 1s infinite',
        typing2: 'typing 1s infinite 0.2s',
        typing3: 'typing 1s infinite 0.4s',
        pulse: 'pulse 1.5s ease-in-out infinite',
        'ring-bell': 'ring 1s ease-in-out',
      },
      boxShadow: {
        'message': '0 2px 10px rgba(0, 0, 0, 0.05)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

