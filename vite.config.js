import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    plugins: [react()],
    root: resolve(__dirname, 'cliente'), // Define la carpeta cliente como la raíz del proyecto
    build: {
        outDir: resolve(__dirname, 'dist'), // Define la carpeta de salida para la compilación
    },
    server: {
        proxy: {
            '/api': 'http://localhost:3000', // Proxy para las rutas de la API en el servidor Express
        },
    },
});
