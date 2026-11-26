import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // En local no se definen: el sitio queda en http://localhost:4321/
  // En GitHub Pages los define el workflow (.github/workflows/deploy.yml):
  //   SITE_URL  = https://<organizacion>.github.io
  //   BASE_PATH = /<repositorio>   (por ejemplo /game-gallery-web)
  site: process.env.SITE_URL,
  base: process.env.BASE_PATH || '/',
  vite: {
    plugins: [tailwindcss()]
  }
});
