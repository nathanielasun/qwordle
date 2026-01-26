import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
