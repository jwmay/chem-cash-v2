import netlify from '@netlify/vite-plugin'
import netlifyReactRouter from '@netlify/vite-plugin-react-router'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vite'
import { reactRouter } from '@react-router/dev/vite'
import { reactRouterDevTools } from 'react-router-devtools'

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouterDevTools(),
    reactRouter(),
    tsconfigPaths(),
    // netlifyReactRouter(),
    // netlify(),
  ],

  server: {
    host: true,
  },
})
