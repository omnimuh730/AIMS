import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
	],
	server: {
		proxy: {
			'/api': {
				target: 'http://192.168.9.110:5001',
				changeOrigin: true,
			},
		},
	},
})