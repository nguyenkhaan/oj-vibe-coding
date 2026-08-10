import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	server: {
		port: 5173,
		host: true
	},
	test: {
		environment: 'jsdom',
		setupFiles: './src/test/setup.ts',
		globals: true,
		css: true,
		include: ['src/**/*.test.{ts,tsx}'],
		exclude: ['node_modules', 'dist', 'tests/e2e']
	}
});
