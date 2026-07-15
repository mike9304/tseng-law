import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';
import {
  loadReadyQaIsolationManifestForCoordinator,
  resolveQaIsolationManifestPath,
} from './src/lib/builder/security/qa-runtime-attestation';

// Playwright evaluates this file in the coordinator and again in workers after
// cwd has moved into the isolated QA namespace. Keep every source/output path
// anchored to the config file, never to the mutable process cwd.
const repositoryRoot = path.resolve(__dirname);

function requireLoopbackBaseUrl(rawValue: string | undefined): string {
  const value = rawValue?.trim();
  if (!value) {
    throw new Error(
      'BASE_URL is required. Start scripts/start-qa-server.sh and target its loopback URL.',
    );
  }

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error('BASE_URL must be a valid absolute loopback URL.');
  }

  if (
    parsed.protocol !== 'http:'
    || parsed.hostname !== '127.0.0.1'
    || !parsed.port
    || parsed.username
    || parsed.password
    || parsed.pathname !== '/'
    || parsed.search
    || parsed.hash
  ) {
    throw new Error(
      'BASE_URL must be exactly an HTTP 127.0.0.1 origin with an explicit port.',
    );
  }

  return parsed.origin;
}

const configuredBaseUrl = requireLoopbackBaseUrl(process.env.BASE_URL);
const manifestPath = resolveQaIsolationManifestPath({
  repositoryRoot,
  baseUrl: configuredBaseUrl,
});
const qaIsolation = loadReadyQaIsolationManifestForCoordinator({
  repositoryRoot,
  baseUrl: configuredBaseUrl,
});

for (const [name, value] of Object.entries(qaIsolation.env)) {
  process.env[name] = value;
}
for (const [name, value] of Object.entries(qaIsolation.runtimeEnv)) {
  process.env[name] = value;
}

// These assertions let global setup and route-side guards bind the browser
// run to this exact live harness. The fixed manifest path is derived above;
// an inherited QA_ISOLATION_MANIFEST_PATH is never trusted as input.
process.env.QA_INTERNAL_REPOSITORY_ROOT = repositoryRoot;
process.env.QA_INTERNAL_RUN_ID = qaIsolation.runId;
process.env.QA_INTERNAL_ATTESTATION_NONCE = qaIsolation.nonce;
process.env.QA_INTERNAL_BASE_URL = qaIsolation.baseUrl;
process.env.QA_INTERNAL_MANIFEST_PATH = manifestPath;
process.env.BUILDER_QA_ISOLATION_ROOT = qaIsolation.isolationRoot;
process.env.QA_ISOLATION_MANIFEST_PATH = manifestPath;
process.env.BUILDER_RATE_LIMIT_BACKEND = 'isolated-qa';

process.chdir(qaIsolation.isolationRoot);

export default defineConfig({
  testDir: path.join(repositoryRoot, 'tests', 'builder-editor'),
  testMatch: '**/*.playwright.ts?(x)',
  globalSetup: path.join(repositoryRoot, 'tests', 'builder-editor', 'qa-global-setup.ts'),
  timeout: 180_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.005,
      threshold: 0.2,
    },
  },
  snapshotPathTemplate: path.join(
    repositoryRoot,
    'tests/visual/baseline{/projectName}/{testFilePath}/{arg}{ext}',
  ),
  use: {
    baseURL: configuredBaseUrl,
    httpCredentials: {
      username: process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin',
      password: process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!',
    },
    viewport: { width: 1440, height: 1000 },
    actionTimeout: 15_000,
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium-builder',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'webkit-builder',
      testMatch: '**/admin-builder.playwright.ts?(x)',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'firefox-builder',
      testMatch: '**/admin-builder.playwright.ts?(x)',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});
