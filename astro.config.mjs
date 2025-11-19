import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@tailwindcss/vite";
import icon from "astro-icon";
import { defineConfig } from "astro/config";
import { remarkReadingTime } from "./src/utils/remark-reading-time.mjs";

import solidJs from "@astrojs/solid-js";

// https://astro.build/config
export default defineConfig({
  site: "https://astro-theme-cody.netlify.app",
  integrations: [mdx(), sitemap(), icon(), solidJs()],

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
