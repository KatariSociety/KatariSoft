import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ mode }) => ({
  //base: mode === 'development' ? '/katarisoft/' : '/', // Base solo para desarrollo
  plugins: [react()],
  build: {
    outDir: resolve(__dirname, 'dist'), // La carpeta de salida para la compilación
    emptyOutDir: true, // Limpia la carpeta de salida antes de compilar
  },
  server: {
    proxy: mode === 'development' ? {
      '/api': 'http://localhost:3000', // Proxy para desarrollo local
    } : {},
  },
}));