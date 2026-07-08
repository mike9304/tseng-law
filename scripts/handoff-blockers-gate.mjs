#!/usr/bin/env node

import { readFile } from 'node:fs/promises';

const DEFAULT_BASE_URL = 'https://tseng-law.com';
const TIMEOUT_MS = 15_000;
const ADMIN_PATH = '/ko/admin-builder';
const STATIC_ASSETS = [
  '/images/placeholder-article-hero.jpg',
  '/_next/image?url=%2Fimages%2Fplaceholder-article-hero.jpg&w=1200&q=75',
];

function parseArgs(argv) {
  const args = { base: DEFAULT_BASE_URL, help: false };
  for (const arg of argv) {
    if (arg === '-h' || arg === '--help') {
      args.help = true;
      continue;
    }
    if (arg.startsWith('--base=')) {
      args.base = arg.slice('--base='.length);
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}

function usage() {
  console.log('Usage: node scripts/handoff-blockers-gate.mjs [--base=<url>]');
}

function normalizeBaseUrl(raw) {
  const url = new URL(raw || DEFAULT_BASE_URL);
  if (url.username || url.password) {
    throw new Error('--base must not include credentials');
  }
  url.hash = '';
  url.search = '';
  return url.toString().replace(/\/+$/, '');
}

function parseEnvFile(text) {
  const env = {};
  for (const raw of text.split(/\r?\n/)) {
    let line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    if (line.startsWith('export ') || line.startsWith('export\t')) {
      line = line.slice('export'.length).trimStart();
    }
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) continue;
    let value = line.slice(eq + 1).trim();

    if (value.length >= 2 && (value[0] === '"' || value[0] === "'")) {
      const quote = value[0];
      let end = -1;
      for (let i = 1; i < value.length; i += 1) {
        if (quote === '"' && value[i] === '\\' && i + 1 < value.length) {
          i += 1;
          continue;
        }
        if (value[i] === quote) {
          end = i;
          break;
        }
      }
      if (end !== -1) {
        value = value.slice(1, end);
        env[key] = quote === '"'
          ? value.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\')
          : value;
        continue;
      }
    }

    const inlineComment = value.search(/\s+#/);
    if (inlineComment !== -1) value = value.slice(0, inlineComment).trim();
    env[key] = value;
  }
  return env;
}

async function loadEnvFile(path) {
  try {
    return parseEnvFile(await readFile(path, 'utf8'));
  } catch (error) {
    if (error?.code === 'ENOENT') return {};
    throw error;
  }
}

async function loadEnv() {
  return {
    ...(await loadEnvFile('.env')),
    ...(await loadEnvFile('.env.local')),
    ...process.env,
  };
}

function hasEnv(env, key) {
  return typeof env[key] === 'string' && env[key].trim() !== '';
}

function missingKeys(env, keys) {
  return keys.filter((key) => !hasEnv(env, key));
}

function basicAuth(username, password) {
  return `Basic ${Buffer.from(`${username}:${password}`, 'utf8').toString('base64')}`;
}

function buildUrl(baseUrl, path) {
  return new URL(path, `${baseUrl}/`).toString();
}

async function fetchWithTimeout(url, init = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

function statusOk(status) {
  return status >= 200 && status < 400;
}

function contentType(response) {
  return response.headers.get('content-type')?.split(';', 1)[0]?.trim().toLowerCase() || 'none';
}

function addResult(results, status, line, ok) {
  results.push({ status, line: `${status} ${line}`, ok });
}

async function checkStaticAssets(baseUrl, results) {
  for (const assetPath of STATIC_ASSETS) {
    try {
      const response = await fetchWithTimeout(buildUrl(baseUrl, assetPath), {
        headers: { accept: 'image/*,*/*;q=0.8' },
      });
      const type = contentType(response);
      const ok = statusOk(response.status) && type.startsWith('image/');
      addResult(
        results,
        ok ? 'PASS' : 'OPEN',
        `static ${assetPath} status=${response.status} content-type=${type}`,
        ok,
      );
      response.body?.cancel();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      addResult(results, 'FAIL', `static ${assetPath} fetch failed: ${message}`, false);
    }
  }
}

function localCredentialCandidates(env, results) {
  const candidates = [];
  const seen = new Set();

  function addPair(userKey, passKey) {
    if (!hasEnv(env, userKey) || !hasEnv(env, passKey)) return;
    const username = env[userKey].trim();
    const password = env[passKey];
    const fingerprint = `${username}\0${password}`;
    if (seen.has(fingerprint)) return;
    seen.add(fingerprint);
    candidates.push({ username, password });
  }

  addPair('BUILDER_SMOKE_USERNAME', 'BUILDER_SMOKE_PASSWORD');
  addPair('CMS_ADMIN_USERNAME', 'CMS_ADMIN_PASSWORD');

  if (hasEnv(env, 'BUILDER_BASIC_AUTH_USERS')) {
    try {
      const parsed = JSON.parse(env.BUILDER_BASIC_AUTH_USERS);
      if (!Array.isArray(parsed)) {
        addResult(results, 'WARN', 'auth BUILDER_BASIC_AUTH_USERS is not a JSON array', true);
      } else {
        for (const entry of parsed) {
          const username = typeof entry?.username === 'string' ? entry.username.trim() : '';
          const password = typeof entry?.password === 'string' ? entry.password : '';
          if (!username || !password) {
            addResult(
              results,
              'WARN',
              'auth BUILDER_BASIC_AUTH_USERS entry missing username/password',
              true,
            );
            continue;
          }
          const fingerprint = `${username}\0${password}`;
          if (seen.has(fingerprint)) continue;
          seen.add(fingerprint);
          candidates.push({ username, password });
        }
      }
    } catch {
      addResult(results, 'WARN', 'auth BUILDER_BASIC_AUTH_USERS is not valid JSON', true);
    }
  }

  return candidates;
}

async function checkAdminAuth(baseUrl, env, results) {
  const adminUrl = buildUrl(baseUrl, ADMIN_PATH);

  try {
    const response = await fetchWithTimeout(adminUrl, {
      headers: { accept: 'text/html,*/*;q=0.8' },
      redirect: 'manual',
    });
    if (response.status === 401) {
      addResult(results, 'PASS', `auth no-auth ${ADMIN_PATH} returned 401`, true);
    } else if (statusOk(response.status)) {
      addResult(results, 'FAIL', `auth no-auth ${ADMIN_PATH} returned ${response.status}`, false);
    } else {
      addResult(
        results,
        'OPEN',
        `auth no-auth ${ADMIN_PATH} expected 401, got ${response.status}`,
        false,
      );
    }
    response.body?.cancel();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    addResult(results, 'FAIL', `auth no-auth ${ADMIN_PATH} fetch failed: ${message}`, false);
  }

  const candidates = localCredentialCandidates(env, results);
  if (candidates.length === 0) {
    addResult(
      results,
      'OPEN',
      'auth smoke missing credential candidates: BUILDER_SMOKE_USERNAME/BUILDER_SMOKE_PASSWORD, CMS_ADMIN_USERNAME/CMS_ADMIN_PASSWORD, BUILDER_BASIC_AUTH_USERS',
      false,
    );
    return;
  }

  let passed = false;
  let requestFailed = false;
  for (const candidate of candidates) {
    try {
      const response = await fetchWithTimeout(adminUrl, {
        headers: {
          accept: 'text/html,*/*;q=0.8',
          authorization: basicAuth(candidate.username, candidate.password),
        },
        redirect: 'manual',
      });
      if (statusOk(response.status)) passed = true;
      response.body?.cancel();
      if (passed) break;
    } catch {
      requestFailed = true;
    }
  }

  if (passed) {
    addResult(
      results,
      'PASS',
      `auth smoke ${ADMIN_PATH} accepted one local credential candidate`,
      true,
    );
  } else if (requestFailed) {
    addResult(
      results,
      'OPEN',
      `auth smoke ${ADMIN_PATH} no credential candidate returned 2xx/3xx (tried ${candidates.length}; request failure observed)`,
      false,
    );
  } else {
    addResult(
      results,
      'OPEN',
      `auth smoke ${ADMIN_PATH} no credential candidate returned 2xx/3xx (tried ${candidates.length})`,
      false,
    );
  }
}

function addRequiredKeys(results, env, label, keys) {
  const missing = missingKeys(env, keys);
  const ok = missing.length === 0;
  addResult(
    results,
    ok ? 'PASS' : 'OPEN',
    ok ? `provider ${label}` : `provider ${label} missing ${missing.join(', ')}`,
    ok,
  );
}

function addCalendar(results, env, label, keys) {
  const missing = missingKeys(env, keys);
  const hasStateSecret = hasEnv(env, 'OAUTH_STATE_SECRET') || hasEnv(env, 'CRON_SECRET');
  const ok = missing.length === 0 && hasStateSecret;
  if (!hasStateSecret) missing.push('OAUTH_STATE_SECRET or CRON_SECRET');
  addResult(
    results,
    ok ? 'PASS' : 'OPEN',
    ok ? `provider ${label}` : `provider ${label} missing ${missing.join(', ')}`,
    ok,
  );
}

function addBookingMail(results, env) {
  const resendReady = hasEnv(env, 'RESEND_API_KEY');
  const smtpKeys = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'];
  const smtpMissing = missingKeys(env, smtpKeys);
  const smtpReady = smtpMissing.length === 0;
  const ready = resendReady || smtpReady;

  if (ready) {
    const via = [
      resendReady ? 'RESEND_API_KEY' : '',
      smtpReady ? 'SMTP_HOST/SMTP_USER/SMTP_PASS' : '',
    ].filter(Boolean).join(' and ');
    addResult(results, 'PASS', `provider Booking/form mail ready via ${via}`, true);
  } else {
    addResult(
      results,
      'OPEN',
      'provider Booking/form mail missing either RESEND_API_KEY or SMTP_HOST/SMTP_USER/SMTP_PASS',
      false,
    );
  }

  addResult(
    results,
    resendReady ? 'PASS' : ready ? 'WARN' : 'OPEN',
    resendReady
      ? 'provider Booking/form mail Resend alternate ready'
      : 'provider Booking/form mail Resend alternate missing RESEND_API_KEY',
    ready || resendReady,
  );
  addResult(
    results,
    smtpReady ? 'PASS' : ready ? 'WARN' : 'OPEN',
    smtpReady
      ? 'provider Booking/form mail SMTP alternate ready'
      : `provider Booking/form mail SMTP alternate missing ${smtpMissing.join(', ')}`,
    ready || smtpReady,
  );
}

function addAnyKey(results, env, label, keys) {
  const present = keys.find((key) => hasEnv(env, key));
  addResult(
    results,
    present ? 'PASS' : 'OPEN',
    present ? `provider ${label} ready via ${present}` : `provider ${label} missing one of ${keys.join(', ')}`,
    Boolean(present),
  );
}

function checkProviders(env, results) {
  addRequiredKeys(results, env, 'Stripe booking/payment', [
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
  ]);
  addRequiredKeys(results, env, 'Zoom', [
    'ZOOM_ACCOUNT_ID',
    'ZOOM_CLIENT_ID',
    'ZOOM_CLIENT_SECRET',
  ]);
  addCalendar(results, env, 'Google calendar', [
    'GOOGLE_OAUTH_CLIENT_ID',
    'GOOGLE_OAUTH_CLIENT_SECRET',
    'GOOGLE_OAUTH_REDIRECT_URI',
  ]);
  addCalendar(results, env, 'Outlook calendar', [
    'MS_OAUTH_CLIENT_ID',
    'MS_OAUTH_CLIENT_SECRET',
    'MS_OAUTH_REDIRECT_URI',
  ]);
  addBookingMail(results, env);
  addAnyKey(results, env, 'Marketing mail', [
    'RESEND_API_KEY',
    'MAILCHIMP_TRANSACTIONAL_API_KEY',
    'MANDRILL_API_KEY',
  ]);
  addRequiredKeys(results, env, 'Translation/AI OpenAI', ['OPENAI_API_KEY']);
  addRequiredKeys(results, env, 'Translation/AI DeepL', ['DEEPL_API_KEY']);
  addRequiredKeys(results, env, 'Upstash rate limit', [
    'UPSTASH_REDIS_REST_URL',
    'UPSTASH_REDIS_REST_TOKEN',
  ]);
  addRequiredKeys(results, env, 'Blob persistence', ['BLOB_READ_WRITE_TOKEN']);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    usage();
    return 0;
  }

  const baseUrl = normalizeBaseUrl(args.base);
  const env = await loadEnv();
  const results = [];

  await checkStaticAssets(baseUrl, results);
  await checkAdminAuth(baseUrl, env, results);
  checkProviders(env, results);

  for (const result of results) {
    console.log(result.line);
  }

  const hardFailures = results.filter((result) => !result.ok && result.status === 'FAIL').length;
  const openBlockers = results.filter((result) => !result.ok && result.status === 'OPEN').length;
  const warnCount = results.filter((result) => result.status === 'WARN').length;
  const ok = hardFailures === 0 && openBlockers === 0;
  console.log(
    `${ok ? 'PASS' : 'FAIL'} handoff blocker gate: ${openBlockers} open, ${hardFailures} fail, ${warnCount} warn`,
  );
  return ok ? 0 : 1;
}

try {
  process.exitCode = await main();
} catch (error) {
  console.error(`FAIL handoff blocker gate: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
