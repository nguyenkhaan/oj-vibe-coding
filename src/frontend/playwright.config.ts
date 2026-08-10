import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './tests/e2e',
	testMatch: '**/*.spec.ts',
	fullyParallel: true,
	reporter: [['list'], ['html', { open: 'never' }]],
	use: {
		baseURL: 'http://127.0.0.1:5173',
		trace: 'on-first-retry',
		headless: true,
		...devices['Desktop Chrome'],
		executablePath: '/usr/bin/google-chrome-stable'
	},
	webServer: {
		command: 'bun run dev -- --host 127.0.0.1',
		url: 'http://127.0.0.1:5173',
		reuseExistingServer: true,
		timeout: 30_000
	}
});
