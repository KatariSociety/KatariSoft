import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ mode, command }) => {
  const isGitHubPages = process.env.DEPLOY_TARGET === 'gh-pages';
  
  return {
    base: isGitHubPages ? '/katarisoft/' : '/',
    plugins: [react()],
    build: {
      outDir: resolve(__dirname, 'dist'),
      emptyOutDir: true,
    },
    server: {
      proxy: mode === 'development' ? {
        '/api': 'http://localhost:3000',
      } : {},
    },
  };
});