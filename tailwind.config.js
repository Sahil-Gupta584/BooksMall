import daisyui from "daisyui"
 /** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: 'class', //DarkMode
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  
  daisyui: {
    themes: false,
  },

};
