// Tailwind v4 - theme configuration is now in CSS via @plugin and CSS variables
// See src/styles/global.css for theme configuration
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,,ts,tsx,vue}"],
  darkMode: "class",
  // Note: In Tailwind v4, theme config is done in CSS via @plugin directive
  // and CSS custom properties. The color and font definitions are in global.css
};
