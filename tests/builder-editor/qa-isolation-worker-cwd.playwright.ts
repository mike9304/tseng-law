import fs from 'node:fs';
import path from 'node:path';

import { expect, test } from '@playwright/test';

function isContained(root: string, candidate: string): boolean {
  const relative = path.relative(root, candidate);
  return relative === '' || (
    relative !== '..'
    && !relative.startsWith(`..${path.sep}`)
    && !path.isAbsolute(relative)
  );
}

test('QA worker keeps repository test discovery while runtime cwd stays isolated', async ({ page, request }, testInfo) => {
  const isolatedRoot = process.env.BUILDER_QA_ISOLATION_ROOT;
  const runtimeRoot = process.env.BUILDER_RUNTIME_DATA_ROOT;
  expect(isolatedRoot, 'start the test through scripts/start-qa-server.sh').toBeTruthy();
  expect(runtimeRoot, 'the QA runtime root must come from the active manifest').toBeTruthy();
  if (!isolatedRoot || !runtimeRoot) return;

  const physicalIsolationRoot = fs.realpathSync(isolatedRoot);
  expect(fs.realpathSync(process.cwd())).toBe(physicalIsolationRoot);
  expect(isContained(physicalIsolationRoot, fs.realpathSync(runtimeRoot))).toBe(true);

  // This file must still resolve from the real repository. If a worker derives
  // testDir from the isolated cwd, Playwright fails before reaching this body.
  expect(path.isAbsolute(testInfo.file)).toBe(true);
  expect(fs.existsSync(testInfo.file)).toBe(true);
  expect(isContained(physicalIsolationRoot, path.resolve(testInfo.file))).toBe(false);

  const providerSecretsAndEndpoints = [
    'BLOB_READ_WRITE_TOKEN',
    'ANTHROPIC_API_KEY',
    'OPENAI_API_KEY',
    'DEEPL_API_KEY',
    'STRIPE_SECRET_KEY',
    'ZOOM_CLIENT_SECRET',
    'GOOGLE_OAUTH_CLIENT_SECRET',
    'MS_OAUTH_CLIENT_SECRET',
    'RESEND_API_KEY',
    'SMTP_HOST',
    'TWILIO_AUTH_TOKEN',
    'MAILCHIMP_TRANSACTIONAL_API_KEY',
    'MANDRILL_API_KEY',
    'MAILCHIMP_TRANSACTIONAL_API_URL',
    'MAILCHIMP_MARKETING_API_KEY',
    'MAILCHIMP_API_KEY',
    'MAILCHIMP_AUDIENCE_ID',
    'MAILCHIMP_SERVER_PREFIX',
    'MAILCHIMP_MARKETING_API_URL',
    'SLACK_WEBHOOK_URL',
    'SENTRY_DSN',
    'LINE_CHANNEL_SECRET',
    'LINE_CHANNEL_ACCESS_TOKEN',
    'VERCEL_TOKEN',
    'VERCEL_URL',
    'UPSTASH_REDIS_REST_URL',
    'UPSTASH_REDIS_REST_TOKEN',
  ] as const;
  for (const name of providerSecretsAndEndpoints) {
    expect(process.env[name] ?? '', `${name} must not reach the QA worker`).toBe('');
  }
  for (const name of [
    'BUILDER_SITE_BACKEND',
    'BUILDER_BOOKINGS_BACKEND',
    'BUILDER_COMMERCE_BACKEND',
    'CRM_BACKEND',
    'REVIEWS_BACKEND',
  ] as const) {
    expect(process.env[name], `${name} must be inherited from the manifest`).toBe('local');
  }

  const baseUrl = String(testInfo.project.use.baseURL);
  for (const name of [
    'BUILDER_ALLOWED_ORIGINS',
    'SITE_URL',
    'NEXT_PUBLIC_SITE_URL',
    'PUBLIC_SITE_ORIGIN',
    'NEXT_PUBLIC_SITE_ORIGIN',
  ] as const) {
    expect(process.env[name]).toBe(baseUrl);
  }

  const response = await request.get('/ko');
  expect(response.status()).toBe(200);

  const providerHosts = [
    'api.openai.com',
    'api.anthropic.com',
    'api.deepl.com',
    'api-free.deepl.com',
    'api.stripe.com',
    'zoom.us',
    'api.zoom.us',
    'api.resend.com',
    'api.twilio.com',
    'mandrillapp.com',
    'hooks.slack.com',
    'api.line.me',
    'api.vercel.com',
  ];
  const externalProviderRequests: string[] = [];
  page.on('request', (browserRequest) => {
    const host = new URL(browserRequest.url()).hostname.toLowerCase();
    if (
      providerHosts.includes(host)
      || host.endsWith('.api.mailchimp.com')
      || host.endsWith('.upstash.io')
      || host.endsWith('.ingest.sentry.io')
    ) {
      externalProviderRequests.push(browserRequest.url());
    }
  });
  await page.goto('/ko', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(250);
  expect(externalProviderRequests, 'QA public load must not call external service providers').toEqual([]);
});
