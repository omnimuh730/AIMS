import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve, dirname } from 'path'
import { copyFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-files',
      closeBundle: () => {
        // Create icons directory
        mkdirSync('dist/icons', { recursive: true });
        
        // Copy manifest
        copyFileSync('manifest.json', 'dist/manifest.json');
        
        // Copy icons
        copyFileSync('public/icons/icon16.png', 'dist/icons/icon16.png');
        copyFileSync('public/icons/icon48.png', 'dist/icons/icon48.png');
        copyFileSync('public/icons/icon128.png', 'dist/icons/icon128.png');
      }
    }
  ],
  build: {
    rollupOptions: {
      input: {
        sidepanel: resolve(__dirname, 'index.html'),
        background: resolve(__dirname, 'src/background.js')
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === 'background' ? '[name].js' : 'assets/[name]-[hash].js';
        },
      },
    },
    outDir: 'dist',
  }
})
