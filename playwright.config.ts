import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/builder-editor',
  testMatch: '**/*.playwright.ts',
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL: process.env.BASE_URL ?? 'http://127.0.0.1:3000',
    httpCredentials: {
      username: process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin',
      password: process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!',
    },
    viewport: { width: 1440, height: 1000 },
    actionTimeout: 15_000,
    trace: 'retain-on-failure',
  },
});
