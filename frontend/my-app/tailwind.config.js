/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  daisyui: {
    themes: ["light", "dark", "cupcake", "luxury"], // Optional
  },
  plugins: [
    
    require("daisyui"),
  ],
}
