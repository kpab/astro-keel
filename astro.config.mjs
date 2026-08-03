// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import { remarkReadingTime } from './remark-reading-time.mjs';

// https://astro.build/config
export default defineConfig({
  // Change to your deployed URL. Used for sitemap, canonical, and RSS links.
  // For a GitHub Pages project site, `site` is the user/org domain and `base`
  // is the repository name. Drop `base` (or set it to '/') for a custom domain
  // or a `<user>.github.io` root site.
  site: 'https://kpab.github.io',
  base: '/astro-keel',
  integrations: [mdx(), sitemap()],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkReadingTime],
    }),
    // Dual Shiki themes; `defaultColor: false` emits CSS variables
    // (--shiki-light / --shiki-dark) so global.css can switch with the theme.
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
      wrap: true,
    },
  },
});
