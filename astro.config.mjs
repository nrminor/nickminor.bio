import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import solidJs from "@astrojs/solid-js";
import tailwind from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import icon from "astro-icon";
import { remarkReadingTime } from "./src/utils/remark-reading-time.mjs";

// https://astro.build/config
export default defineConfig({
  site: "https://nickminor.bio",
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
