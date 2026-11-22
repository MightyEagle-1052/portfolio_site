import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The admin lives at /admin on the same domain as the site.
// In development it runs on :5174 (reachable via the site's dev server at :8080/admin)
// and forwards API / image requests to the server.
const API = process.env.ADMIN_API_URL || 'http://localhost:4000';

export default defineConfig({
  base: '/admin/',
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: true,
    hmr: { clientPort: 5174 },
    proxy: {
      '/api': API,
      '/site': API,
      '/uploads': API,
    },
  },
});
