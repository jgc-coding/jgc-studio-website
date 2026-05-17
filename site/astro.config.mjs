import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind({ applyBaseStyles: false })],
  site: 'http://localhost:4321',
  build: {
    inlineStylesheets: 'auto',
  },
});
