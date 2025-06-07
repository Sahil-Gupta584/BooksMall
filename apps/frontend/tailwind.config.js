/** @type {import('tailwindcss').Config} */
import { heroui } from '@heroui/react';
const config = {
  content: [
    "./src/routes/-components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/*.{ts,tsx}",
    "../../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    "../../node_modules/@heroui/react/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/react/dist/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{html,js}"
  ], theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3f2',
          100: '#e8e1dc',
          200: '#d3c3b9',
          300: '#bda291',
          400: '#a68372',
          500: '#8f6953', // Main primary color
          600: '#7c5744',
          700: '#664538',
          800: '#50362c',
          900: '#3b2820',
          950: '#211612',
        },
        secondary: {
          50: '#f2f7fc',
          100: '#e4eef9',
          200: '#c5ddf2',
          300: '#94c1e8',
          400: '#5ea1db',
          500: '#3984cf',
          600: '#2768af', // Main secondary color
          700: '#21538f',
          800: '#1f4676',
          900: '#1e3c63',
          950: '#142543',
        },
        accent: {
          50: '#f7f5ff',
          100: '#efeaff',
          200: '#dfd5ff',
          300: '#c6b3ff',
          400: '#a886ff',
          500: '#9361ff', // Main accent color
          600: '#7d38ff',
          700: '#6b25ee',
          800: '#591dd0',
          900: '#491aaa',
          950: '#2a0d71',
        },
      },
      fontFamily: {
        serif: ['"Merriweather"', 'Georgia', 'serif'],
        sans: ['"Nunito Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'book': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 5px 5px 0 0 rgba(0, 0, 0, 0.03)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [heroui()],
};

export default config