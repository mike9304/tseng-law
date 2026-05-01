#!/usr/bin/env node

const DEFAULT_BASE_URL = 'http://localhost:3000';
const DEFAULT_PATHS = [
  '/ko/admin-builder',
  '/ko/admin-builder/columns',
  '/api/builder/home?locale=ko',
  '/api/builder/site/pages?locale=ko',
  '/api/builder/site/settings?locale=ko',
  '/api/builder/assets?locale=ko&limit=1',
];

const baseUrl = (process.env.BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, '');
const username = process.env.BUILDER_SMOKE_USERNAME || process.env.CMS_ADMIN_USERNAME || 'admin';
const password =
  process.env.BUILDER_SMOKE_PASSWORD || process.env.CMS_ADMIN_PASSWORD || 'local-review-2026!';
const timeoutMs = Number(process.env.BUILDER_SMOKE_TIMEOUT_MS || 15_000);
const paths = (process.env.BUILDER_SMOKE_PATHS || '')
  .split(',')
  .map((path) => path.trim())
  .filter(Boolean);
const smokePaths = paths.length > 0 ? paths : DEFAULT_PATHS;
const authorization = `Basic ${Buffer.from(`${username}:${password}`, 'utf8').toString('base64')}`;

function buildUrl(smokePath) {
  if (/^https?:\/\//i.test(smokePath)) {
    return smokePath;
  }
  return `${baseUrl}${smokePath.startsWith('/') ? smokePath : `/${smokePath}`}`;
}

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      headers: {
        accept: 'application/json,text/html;q=0.9,*/*;q=0.8',
        authorization,
      },
      redirect: 'manual',
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

function isAllowedStatus(status) {
  return status >= 200 && status < 400;
}

const results = [];

for (const smokePath of smokePaths) {
  const url = buildUrl(smokePath);

  try {
    const response = await fetchWithTimeout(url);
    const location = response.headers.get('location');
    const ok = isAllowedStatus(response.status);
    const detail = ok
      ? location ? ` -> ${location}` : ''
      : ` ${await response.text().then((body) => body.slice(0, 240)).catch(() => '')}`;

    results.push({
      ok,
      line: `${ok ? 'PASS' : 'FAIL'} ${response.status} ${smokePath}${detail}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    results.push({
      ok: false,
      line: `FAIL fetch ${smokePath} ${message}`,
    });
  }
}

for (const result of results) {
  console.log(result.line);
}

const failures = results.filter((result) => !result.ok);
if (failures.length > 0) {
  console.error(
    `Builder smoke failed for ${failures.length}/${results.length} route(s) at ${baseUrl}.`,
  );
  process.exit(1);
}

console.log(`Builder smoke passed for ${results.length} route(s) at ${baseUrl}.`);
