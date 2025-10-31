import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import tailwind from "@tailwindcss/vite";
import icon from "astro-icon";
import { defineConfig } from "astro/config";
import { remarkReadingTime } from "./src/utils/remark-reading-time.mjs";

// https://astro.build/config
export default defineConfig({
  site: "https://astro-theme-cody.netlify.app",
  integrations: [mdx(), sitemap(), svelte(), icon()],

  markdown: {
    remarkPlugins: [remarkReadingTime],
    syntaxHighlight: "shiki",
    shikiConfig: {
      themes: {
        light: "catppuccin-mocha",
        dark: "catppuccin-latte",
      },
    },
  },

  vite: {
    plugins: [tailwind()],
  },
});
