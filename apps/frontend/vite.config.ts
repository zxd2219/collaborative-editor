import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import pages from 'vite-plugin-pages';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    pages({
      exclude: [
        '**/components/*.tsx',
        '**/components/*.ts',
        '**/components/*.jsx',
        '**/components/*.js',
      ],
      extensions: ['tsx', 'ts', 'jsx', 'js'],
    }),
    tailwindcss(),
  ],
});
