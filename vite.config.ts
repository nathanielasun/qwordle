import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // Base path for GitHub Pages deployment (https://nathanielasun.github.io/qwordle/)
  base: process.env.NODE_ENV === 'production' ? '/qwordle/' : '/',
  plugins: [
    react(),
    // Bundle analysis - generates stats.html in project root
    visualizer({
      filename: 'bundle-stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@qcjs': path.resolve(__dirname, '../qcjs'),
      '@qc-builder': path.resolve(__dirname, '../web_qc_builder/src'),
    },
  },
  optimizeDeps: {
    include: ['@tensorflow/tfjs'],
    esbuildOptions: {
      target: 'esnext',
    },
  },
  build: {
    target: 'esnext',
  },
  esbuild: {
    target: 'esnext',
  },
});
