import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// Read deployment context from env (set by GitHub Action per branch build).
// Defaults to local dev: base "/" and dummy site URL.
const BASE_PATH = process.env.BASE_PATH || '/';
const SITE_URL = process.env.SITE_URL || 'http://localhost:4321';

// https://astro.build/config
export default defineConfig({
  base: BASE_PATH,
  site: SITE_URL,
  trailingSlash: 'ignore',
  integrations: [tailwind({ applyBaseStyles: false })],
  build: {
    inlineStylesheets: 'auto',
  },
});
