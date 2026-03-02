import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/mundu-react-carousel/',
  root: 'src/docs',
  build: {
    outDir: path.resolve(__dirname, 'build'),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      'mundu-react-carousel': path.resolve(__dirname, 'src/lib'),
    },
  },
  server: {
    port: 8000,
  },
});
