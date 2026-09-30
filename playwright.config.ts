import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 45_000,
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'http://localhost:4179',
    viewport: { width: 1440, height: 1000 },
    permissions: ['clipboard-read', 'clipboard-write'],
  },
  webServer: {
    command: 'npm run build && npx vite preview --port 4179 --strictPort',
    url: 'http://localhost:4179',
    reuseExistingServer: true,
    timeout: 240_000,
  },
});
