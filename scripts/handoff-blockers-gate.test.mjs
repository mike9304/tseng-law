import { spawn } from 'node:child_process';
import { chmod, mkdtemp, mkdir, readFile, rm, stat, symlink, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { actionItemMetadata, actionItemsFor, addResult } from './handoff-blockers/reporting.mjs';

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const GATE_SCRIPT = join(TEST_DIR, 'handoff-blockers-gate.mjs');
const GATE_HELPERS_DIR = join(TEST_DIR, 'handoff-blockers');
const AUTH_USER = 'fake-local-admin-user';
const AUTH_PASSWORD = 'fake-local-password-do-not-print';
const IMAGE_BYTES = Buffer.from([0xff, 0xd8, 0xff, 0xd9]);

const AUTH_ENV = {
  BUILDER_SMOKE_USERNAME: AUTH_USER,
  BUILDER_SMOKE_PASSWORD: AUTH_PASSWORD,
};

const PROVIDER_ENV = {
  STRIPE_SECRET_KEY: 'fake-stripe-secret-do-not-print',
  STRIPE_WEBHOOK_SECRET: 'fake-stripe-webhook-secret-do-not-print',
  ZOOM_ACCOUNT_ID: 'fake-zoom-account-do-not-print',
  ZOOM_CLIENT_ID: 'fake-zoom-client-id-do-not-print',
  ZOOM_CLIENT_SECRET: 'fake-zoom-client-secret-do-not-print',
  GOOGLE_OAUTH_CLIENT_ID: 'fake-google-client-id-do-not-print',
  GOOGLE_OAUTH_CLIENT_SECRET: 'fake-google-client-secret-do-not-print',
  GOOGLE_OAUTH_REDIRECT_URI: 'http://127.0.0.1/google/callback',
  MS_OAUTH_CLIENT_ID: 'fake-ms-client-id-do-not-print',
  MS_OAUTH_CLIENT_SECRET: 'fake-ms-client-secret-do-not-print',
  MS_OAUTH_REDIRECT_URI: 'http://127.0.0.1/outlook/callback',
  OAUTH_STATE_SECRET: 'fake-oauth-state-secret-do-not-print',
  RESEND_API_KEY: 'fake-resend-api-key-do-not-print',
  SMTP_HOST: 'smtp.local.test',
  SMTP_USER: 'fake-smtp-user-do-not-print',
  SMTP_PASS: 'fake-smtp-password-do-not-print',
  MAILCHIMP_TRANSACTIONAL_API_KEY: 'fake-mailchimp-token-do-not-print',
  OPENAI_API_KEY: 'fake-openai-key-do-not-print',
  DEEPL_API_KEY: 'fake-deepl-key-do-not-print',
  UPSTASH_REDIS_REST_URL: 'http://127.0.0.1/upstash',
  UPSTASH_REDIS_REST_TOKEN: 'fake-upstash-token-do-not-print',
  BLOB_READ_WRITE_TOKEN: 'fake-blob-token-do-not-print',
};

function envFile(vars) {
  return `${Object.entries(vars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n')}\n`;
}

function expectedAuthHeader() {
  return `Basic ${Buffer.from(`${AUTH_USER}:${AUTH_PASSWORD}`, 'utf8').toString('base64')}`;
}

async function startGateServer() {
  const requests = [];
  const server = createServer((req, res) => {
    requests.push({
      method: req.method,
      url: req.url,
      authorization: req.headers.authorization,
    });

    if (
      req.url === '/images/placeholder-article-hero.jpg' ||
      req.url === '/_next/image?url=%2Fimages%2Fplaceholder-article-hero.jpg&w=1200&q=75'
    ) {
      res.writeHead(200, { 'content-type': 'image/jpeg' });
      res.end(IMAGE_BYTES);
      return;
    }

    if (req.url === '/ko/admin-builder') {
      if (req.headers.authorization === expectedAuthHeader()) {
        res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
        res.end('<!doctype html><title>Admin</title>');
        return;
      }

      res.writeHead(401, {
        'content-type': 'text/plain; charset=utf-8',
        'www-authenticate': 'Basic realm="test"',
      });
      res.end('Unauthorized');
      return;
    }

    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  });

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      server.off('error', reject);
      resolve();
    });
  });

  const address = server.address();
  assert.equal(typeof address, 'object');
  assert.notEqual(address, null);

  return {
    baseUrl: `http://127.0.0.1:${address.port}`,
    requests,
    close: () => new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    }),
  };
}

async function runGate(baseUrl, vars, args = [], options = {}) {
  const cwd = await mkdtemp(join(tmpdir(), 'handoff-blockers-gate-'));
  const scriptsDir = join(cwd, 'scripts');
  const childEnv = {
    LANG: 'C',
    TZ: 'UTC',
  };

  try {
    await mkdir(scriptsDir);
    await symlink(GATE_SCRIPT, join(scriptsDir, 'handoff-blockers-gate.mjs'));
    await symlink(GATE_HELPERS_DIR, join(scriptsDir, 'handoff-blockers'), 'dir');
    await writeFile(join(cwd, '.env.local'), envFile(vars), { mode: 0o600 });
    if (options.prepareCwd) {
      await options.prepareCwd(cwd);
    }

    const result = await new Promise((resolve, reject) => {
      const child = spawn(
        process.execPath,
        ['scripts/handoff-blockers-gate.mjs', ...args, `--base=${baseUrl}`],
        {
          cwd,
          env: childEnv,
          stdio: ['ignore', 'pipe', 'pipe'],
        },
      );
      let stdout = '';
      let stderr = '';
      let timedOut = false;
      const timeout = setTimeout(() => {
        timedOut = true;
        child.kill('SIGTERM');
      }, 10_000);

      child.stdout.setEncoding('utf8');
      child.stderr.setEncoding('utf8');
      child.stdout.on('data', (chunk) => {
        stdout += chunk;
      });
      child.stderr.on('data', (chunk) => {
        stderr += chunk;
      });
      child.on('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
      child.on('close', (code, signal) => {
        clearTimeout(timeout);
        resolve({ code, signal, stdout, stderr, timedOut });
      });
    });

    if (options.readOutputPath) {
      const outputFile = join(cwd, options.readOutputPath);
      const outputText = await readFile(outputFile, 'utf8');
      const outputMode = (await stat(outputFile)).mode & 0o777;
      return { ...result, outputText, outputMode };
    }

    return result;
  } finally {
    await rm(cwd, { recursive: true, force: true });
  }
}

function assertNoValuesEchoed(output, vars) {
  for (const [key, value] of Object.entries(vars)) {
    assert.equal(output.includes(value), false, `${key} value leaked`);
  }
}

function parseJsonStdout(result) {
  assert.equal(result.stderr, '');
  const trimmed = result.stdout.trim();
  assert.match(trimmed, /^\{.*\}$/s);
  assert.equal(result.stdout.split('\n').filter(Boolean).length, 1);
  return JSON.parse(trimmed);
}

function assertLegacyPayloadShape(payload) {
  assert.deepEqual(Object.keys(payload).sort(), ['baseUrl', 'counts', 'ok', 'results']);
  assert.equal('generatedAt' in payload, false);
  assert.equal('softOpen' in payload, false);
  assert.equal('effectiveExitCode' in payload, false);
  assert.equal('actionItems' in payload, false);
}

function assertMetadata(payload, { softOpen, effectiveExitCode }) {
  assert.equal(typeof payload.generatedAt, 'string');
  const generatedAtTime = Date.parse(payload.generatedAt);
  assert.equal(Number.isNaN(generatedAtTime), false);
  assert.equal(new Date(generatedAtTime).toISOString(), payload.generatedAt);
  assert.equal(payload.softOpen, softOpen);
  assert.equal(payload.effectiveExitCode, effectiveExitCode);
}

function assertEmptyActionItems(payload) {
  assert.deepEqual(payload.actionItems, { open: [], warn: [] });
}

function actionItemByCode(payload, section, code) {
  const item = payload.actionItems[section].find((candidate) => candidate.code === code);
  assert.ok(item, `${section} action item ${code} missing`);
  return item;
}

test('actionItemsFor reads private row metadata rather than line prose', () => {
  const results = [];
  addResult(
    results,
    'OPEN',
    'intentionally non-matching prose missing value-that-should-not-be-parsed',
    false,
    actionItemMetadata({
      code: 'structured_only',
      category: 'test_category',
      owner: 'operator',
      requiresSecret: true,
      missing: ['STRUCTURED_ENV_GROUP'],
    }),
  );

  assert.deepEqual(actionItemsFor(results), {
    open: [{
      status: 'OPEN',
      line: 'OPEN intentionally non-matching prose missing value-that-should-not-be-parsed',
      code: 'structured_only',
      category: 'test_category',
      owner: 'operator',
      requiresSecret: true,
      missing: ['STRUCTURED_ENV_GROUP'],
    }],
    warn: [],
  });
  assert.deepEqual(Object.keys(results[0]), ['status', 'line', 'ok']);
  assert.deepEqual(JSON.parse(JSON.stringify(results[0])), {
    status: 'OPEN',
    line: 'OPEN intentionally non-matching prose missing value-that-should-not-be-parsed',
    ok: false,
  });
});

test('actionItemsFor uses unknown fallback only for included rows without metadata', () => {
  const results = [];
  addResult(results, 'OPEN', 'not mapped by structured metadata', false);
  addResult(results, 'FAIL', 'not an action item', false);

  assert.deepEqual(actionItemsFor(results), {
    open: [{
      status: 'OPEN',
      line: 'OPEN not mapped by structured metadata',
      code: 'unknown',
      category: 'unknown',
      owner: 'developer',
      requiresSecret: false,
      missing: [],
    }],
    warn: [],
  });
});

test('all fake providers and accepted local auth pass without echoing values', async () => {
  const server = await startGateServer();
  try {
    const vars = { ...AUTH_ENV, ...PROVIDER_ENV };
    const result = await runGate(server.baseUrl, vars);
    const output = result.stdout + result.stderr;

    assert.equal(result.timedOut, false);
    assert.equal(result.signal, null);
    assert.equal(result.code, 0);
    assert.equal(result.stderr, '');
    assert.match(result.stdout, /PASS static \/images\/placeholder-article-hero\.jpg status=200 content-type=image\/jpeg/);
    assert.match(result.stdout, /PASS static \/_next\/image\?url=%2Fimages%2Fplaceholder-article-hero\.jpg&w=1200&q=75 status=200 content-type=image\/jpeg/);
    assert.match(result.stdout, /PASS auth no-auth \/ko\/admin-builder returned 401/);
    assert.match(result.stdout, /PASS auth smoke \/ko\/admin-builder accepted one local credential candidate/);
    assert.match(result.stdout, /PASS handoff blocker gate: 0 open, 0 fail, 0 warn/);
    assertNoValuesEchoed(output, vars);
  } finally {
    await server.close();
  }
});

test('missing provider keys leave OPEN provider rows while local checks pass', async () => {
  const server = await startGateServer();
  try {
    const result = await runGate(server.baseUrl, AUTH_ENV);
    const output = result.stdout + result.stderr;

    assert.equal(result.timedOut, false);
    assert.equal(result.signal, null);
    assert.equal(result.code, 1);
    assert.equal(result.stderr, '');
    assert.match(result.stdout, /PASS static \/images\/placeholder-article-hero\.jpg status=200 content-type=image\/jpeg/);
    assert.match(result.stdout, /PASS static \/_next\/image\?url=%2Fimages%2Fplaceholder-article-hero\.jpg&w=1200&q=75 status=200 content-type=image\/jpeg/);
    assert.match(result.stdout, /PASS auth no-auth \/ko\/admin-builder returned 401/);
    assert.match(result.stdout, /PASS auth smoke \/ko\/admin-builder accepted one local credential candidate/);
    assert.match(result.stdout, /OPEN provider Stripe booking\/payment missing STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET/);
    assert.match(result.stdout, /OPEN provider Zoom missing ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET/);
    assert.match(result.stdout, /OPEN provider Translation\/AI OpenAI missing OPENAI_API_KEY/);
    assert.match(result.stdout, /FAIL handoff blocker gate: \d+ open, 0 fail, 0 warn/);
    assertNoValuesEchoed(output, AUTH_ENV);
  } finally {
    await server.close();
  }
});

test('json mode reports full pass payload without echoing values', async () => {
  const server = await startGateServer();
  try {
    const vars = { ...AUTH_ENV, ...PROVIDER_ENV };
    const result = await runGate(server.baseUrl, vars, ['--json']);
    const output = result.stdout + result.stderr;

    assert.equal(result.timedOut, false);
    assert.equal(result.signal, null);
    assert.equal(result.code, 0);
    const payload = parseJsonStdout(result);

    assertLegacyPayloadShape(payload);
    assert.equal(payload.ok, true);
    assert.equal(payload.baseUrl, server.baseUrl);
    assert.deepEqual(payload.counts, { open: 0, fail: 0, warn: 0 });
    assert.ok(Array.isArray(payload.results));
    assert.ok(payload.results.length > 0);
    assert.deepEqual([...new Set(payload.results.map((row) => row.status))], ['PASS']);
    assert.equal(payload.results.every((row) => row.ok === true), true);
    assertNoValuesEchoed(output, vars);
  } finally {
    await server.close();
  }
});

test('metadata json all-pass has empty action item lists', async () => {
  const server = await startGateServer();
  try {
    const vars = { ...AUTH_ENV, ...PROVIDER_ENV };
    const result = await runGate(server.baseUrl, vars, ['--json', '--metadata']);
    const output = result.stdout + result.stderr;

    assert.equal(result.timedOut, false);
    assert.equal(result.signal, null);
    assert.equal(result.code, 0);
    const payload = parseJsonStdout(result);

    assert.equal(payload.ok, true);
    assertMetadata(payload, { softOpen: false, effectiveExitCode: 0 });
    assertEmptyActionItems(payload);
    assertNoValuesEchoed(output, vars);
  } finally {
    await server.close();
  }
});

test('json mode rejects non-loopback http base before fetching or echoing values', async () => {
  const vars = { ...AUTH_ENV, ...PROVIDER_ENV };
  const result = await runGate('http://example.com', vars, ['--json']);
  const output = result.stdout + result.stderr;

  assert.equal(result.timedOut, false);
  assert.equal(result.signal, null);
  assert.equal(result.code, 1);
  const payload = parseJsonStdout(result);

  assert.equal(payload.ok, false);
  assert.equal(payload.baseUrl, 'http://example.com');
  assert.deepEqual(payload.counts, { open: 0, fail: 1, warn: 0 });
  assert.equal(payload.results.length, 1);
  assert.equal(
    payload.results[0].line,
    'FAIL handoff blocker gate: --base must use https unless it is loopback http',
  );
  assertNoValuesEchoed(output, vars);
});

test('json output file matches stdout payload on full pass', async () => {
  const server = await startGateServer();
  try {
    const vars = { ...AUTH_ENV, ...PROVIDER_ENV };
    const outputPath = join('artifacts', 'handoff-blockers-pass.json');
    const result = await runGate(
      server.baseUrl,
      vars,
      ['--json', `--output=${outputPath}`],
      { readOutputPath: outputPath },
    );
    const output = result.stdout + result.stderr + result.outputText;

    assert.equal(result.timedOut, false);
    assert.equal(result.signal, null);
    assert.equal(result.code, 0);

    const stdoutPayload = parseJsonStdout(result);
    const filePayload = JSON.parse(result.outputText);
    assert.deepEqual(filePayload, stdoutPayload);
    assert.match(result.outputText, /\n$/);
    assertNoValuesEchoed(output, vars);
  } finally {
    await server.close();
  }
});

test('json output file rewrites existing artifact with private permissions', async () => {
  const server = await startGateServer();
  try {
    const vars = { ...AUTH_ENV, ...PROVIDER_ENV };
    const outputPath = join('artifacts', 'handoff-blockers-existing.json');
    const result = await runGate(
      server.baseUrl,
      vars,
      ['--json', `--output=${outputPath}`],
      {
        readOutputPath: outputPath,
        prepareCwd: async (cwd) => {
          const outputFile = join(cwd, outputPath);
          await mkdir(dirname(outputFile), { recursive: true });
          await writeFile(outputFile, '{"old":true}\n', { mode: 0o644 });
          await chmod(outputFile, 0o644);
        },
      },
    );
    const output = result.stdout + result.stderr + result.outputText;

    assert.equal(result.timedOut, false);
    assert.equal(result.signal, null);
    assert.equal(result.code, 0);
    assert.equal(result.outputMode, 0o600);

    const stdoutPayload = parseJsonStdout(result);
    const filePayload = JSON.parse(result.outputText);
    assert.deepEqual(filePayload, stdoutPayload);
    assertNoValuesEchoed(output, vars);
  } finally {
    await server.close();
  }
});

test('json mode reports provider blockers as open rows', async () => {
  const server = await startGateServer();
  try {
    const result = await runGate(server.baseUrl, AUTH_ENV, ['--json']);
    const output = result.stdout + result.stderr;

    assert.equal(result.timedOut, false);
    assert.equal(result.signal, null);
    assert.equal(result.code, 1);
    const payload = parseJsonStdout(result);

    assert.equal(payload.ok, false);
    assert.equal(payload.baseUrl, server.baseUrl);
    assert.ok(payload.counts.open > 0);
    assert.equal(payload.counts.fail, 0);
    assert.ok(payload.results.some((row) => (
      row.status === 'OPEN' &&
      row.ok === false &&
      row.line === 'OPEN provider Stripe booking/payment missing STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET'
    )));
    assertNoValuesEchoed(output, AUTH_ENV);
  } finally {
    await server.close();
  }
});

test('json output file is written when provider blockers are open', async () => {
  const server = await startGateServer();
  try {
    const outputPath = join('nested', 'evidence', 'handoff-blockers-open.json');
    const result = await runGate(
      server.baseUrl,
      AUTH_ENV,
      ['--json', `--output=${outputPath}`],
      { readOutputPath: outputPath },
    );
    const output = result.stdout + result.stderr + result.outputText;

    assert.equal(result.timedOut, false);
    assert.equal(result.signal, null);
    assert.equal(result.code, 1);

    const stdoutPayload = parseJsonStdout(result);
    const filePayload = JSON.parse(result.outputText);
    assert.deepEqual(filePayload, stdoutPayload);
    assert.equal(filePayload.ok, false);
    assert.ok(filePayload.counts.open > 0);
    assert.equal(filePayload.counts.fail, 0);
    assert.ok(filePayload.results.some((row) => (
      row.status === 'OPEN' &&
      row.ok === false &&
      row.line === 'OPEN provider Stripe booking/payment missing STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET'
    )));
    assertNoValuesEchoed(output, AUTH_ENV);
  } finally {
    await server.close();
  }
});

test('json soft-open writes open provider payload but exits zero', async () => {
  const server = await startGateServer();
  try {
    const outputPath = join('nested', 'evidence', 'handoff-blockers-soft-open.json');
    const result = await runGate(
      server.baseUrl,
      AUTH_ENV,
      ['--json', '--soft-open', `--output=${outputPath}`],
      { readOutputPath: outputPath },
    );
    const output = result.stdout + result.stderr + result.outputText;

    assert.equal(result.timedOut, false);
    assert.equal(result.signal, null);
    assert.equal(result.code, 0);

    const stdoutPayload = parseJsonStdout(result);
    const filePayload = JSON.parse(result.outputText);
    assert.deepEqual(filePayload, stdoutPayload);
    assert.equal(filePayload.ok, false);
    assert.ok(filePayload.counts.open > 0);
    assert.equal(filePayload.counts.fail, 0);
    assert.ok(filePayload.results.some((row) => (
      row.status === 'OPEN' &&
      row.ok === false &&
      row.line === 'OPEN provider Stripe booking/payment missing STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET'
    )));
    assert.match(result.outputText, /\n$/);
    assertNoValuesEchoed(output, AUTH_ENV);
  } finally {
    await server.close();
  }
});

test('metadata json soft-open includes scheduler fields and matching output file', async () => {
  const server = await startGateServer();
  try {
    const outputPath = join('nested', 'evidence', 'handoff-blockers-metadata-soft-open.json');
    const result = await runGate(
      server.baseUrl,
      AUTH_ENV,
      ['--json', '--metadata', '--soft-open', `--output=${outputPath}`],
      { readOutputPath: outputPath },
    );
    const output = result.stdout + result.stderr + result.outputText;

    assert.equal(result.timedOut, false);
    assert.equal(result.signal, null);
    assert.equal(result.code, 0);

    const stdoutPayload = parseJsonStdout(result);
    const filePayload = JSON.parse(result.outputText);
    assert.deepEqual(filePayload, stdoutPayload);
    assert.equal(stdoutPayload.ok, false);
    assert.ok(stdoutPayload.counts.open > 0);
    assert.equal(stdoutPayload.counts.fail, 0);
    assertMetadata(stdoutPayload, { softOpen: true, effectiveExitCode: 0 });
    assert.match(result.outputText, /\n$/);
    assertNoValuesEchoed(output, AUTH_ENV);
  } finally {
    await server.close();
  }
});

test('metadata json soft-open classifies provider action items without echoing values', async () => {
  const server = await startGateServer();
  try {
    const vars = {
      ...AUTH_ENV,
      SMTP_HOST: 'smtp.local.test',
      SMTP_USER: 'fake-smtp-user-do-not-print',
      SMTP_PASS: 'fake-smtp-password-do-not-print',
    };
    const outputPath = join('nested', 'evidence', 'handoff-blockers-action-items.json');
    const result = await runGate(
      server.baseUrl,
      vars,
      ['--json', '--metadata', '--soft-open', `--output=${outputPath}`],
      { readOutputPath: outputPath },
    );
    const output = result.stdout + result.stderr + result.outputText;

    assert.equal(result.timedOut, false);
    assert.equal(result.signal, null);
    assert.equal(result.code, 0);

    const payload = parseJsonStdout(result);
    const filePayload = JSON.parse(result.outputText);
    assert.deepEqual(filePayload, payload);
    assertMetadata(payload, { softOpen: true, effectiveExitCode: 0 });

    const stripe = actionItemByCode(payload, 'open', 'stripe_booking_payment');
    assert.equal(stripe.status, 'OPEN');
    assert.equal(stripe.category, 'provider_credentials');
    assert.equal(stripe.owner, 'client');
    assert.equal(stripe.requiresSecret, true);
    assert.deepEqual(stripe.missing, ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET']);

    assert.deepEqual(actionItemByCode(payload, 'open', 'zoom').missing, [
      'ZOOM_ACCOUNT_ID',
      'ZOOM_CLIENT_ID',
      'ZOOM_CLIENT_SECRET',
    ]);
    assert.deepEqual(actionItemByCode(payload, 'open', 'google_calendar').missing, [
      'GOOGLE_OAUTH_CLIENT_ID',
      'GOOGLE_OAUTH_CLIENT_SECRET',
      'GOOGLE_OAUTH_REDIRECT_URI',
      'OAUTH_STATE_SECRET or CRON_SECRET',
    ]);
    assert.deepEqual(actionItemByCode(payload, 'open', 'marketing_mail').missing, [
      'RESEND_API_KEY',
      'MAILCHIMP_TRANSACTIONAL_API_KEY',
      'MANDRILL_API_KEY',
    ]);
    assert.deepEqual(actionItemByCode(payload, 'open', 'translation_ai_openai').missing, ['OPENAI_API_KEY']);
    assert.deepEqual(actionItemByCode(payload, 'open', 'upstash_rate_limit').missing, [
      'UPSTASH_REDIS_REST_URL',
      'UPSTASH_REDIS_REST_TOKEN',
    ]);
    assert.deepEqual(actionItemByCode(payload, 'open', 'blob_persistence').missing, ['BLOB_READ_WRITE_TOKEN']);

    const resend = actionItemByCode(payload, 'warn', 'booking_form_mail_resend_alternate');
    assert.equal(resend.status, 'WARN');
    assert.equal(resend.category, 'provider_alternate');
    assert.equal(resend.owner, 'client');
    assert.equal(resend.requiresSecret, true);
    assert.deepEqual(resend.missing, ['RESEND_API_KEY']);
    assert.equal(resend.line, 'WARN provider Booking/form mail Resend alternate missing RESEND_API_KEY');

    assertNoValuesEchoed(output, vars);
  } finally {
    await server.close();
  }
});

test('metadata json strict open-only payload exits one with effective exit code', async () => {
  const server = await startGateServer();
  try {
    const result = await runGate(server.baseUrl, AUTH_ENV, ['--json', '--metadata']);
    const output = result.stdout + result.stderr;

    assert.equal(result.timedOut, false);
    assert.equal(result.signal, null);
    assert.equal(result.code, 1);

    const payload = parseJsonStdout(result);
    assert.equal(payload.ok, false);
    assert.ok(payload.counts.open > 0);
    assert.equal(payload.counts.fail, 0);
    assertMetadata(payload, { softOpen: false, effectiveExitCode: 1 });
    assert.ok(payload.actionItems.open.length > 0);
    assert.deepEqual(payload.actionItems.warn, []);
    assert.deepEqual(actionItemByCode(payload, 'open', 'booking_form_mail').missing, [
      'RESEND_API_KEY',
      'SMTP_HOST/SMTP_USER/SMTP_PASS',
    ]);
    assertNoValuesEchoed(output, AUTH_ENV);
  } finally {
    await server.close();
  }
});

test('human soft-open prints blocker summary but exits zero for open rows', async () => {
  const server = await startGateServer();
  try {
    const result = await runGate(server.baseUrl, AUTH_ENV, ['--soft-open']);
    const output = result.stdout + result.stderr;

    assert.equal(result.timedOut, false);
    assert.equal(result.signal, null);
    assert.equal(result.code, 0);
    assert.equal(result.stderr, '');
    assert.match(result.stdout, /OPEN provider Stripe booking\/payment missing STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET/);
    assert.match(result.stdout, /OPEN provider Translation\/AI OpenAI missing OPENAI_API_KEY/);
    assert.match(result.stdout, /FAIL handoff blocker gate: \d+ open, 0 fail, 0 warn/);
    assertNoValuesEchoed(output, AUTH_ENV);
  } finally {
    await server.close();
  }
});

test('metadata does not change human output', async () => {
  const server = await startGateServer();
  try {
    const withoutMetadata = await runGate(server.baseUrl, AUTH_ENV, ['--soft-open']);
    const withMetadata = await runGate(server.baseUrl, AUTH_ENV, ['--metadata', '--soft-open']);

    assert.equal(withoutMetadata.timedOut, false);
    assert.equal(withMetadata.timedOut, false);
    assert.equal(withoutMetadata.signal, null);
    assert.equal(withMetadata.signal, null);
    assert.equal(withoutMetadata.code, 0);
    assert.equal(withMetadata.code, 0);
    assert.equal(withoutMetadata.stderr, '');
    assert.equal(withMetadata.stderr, '');
    assert.equal(withMetadata.stdout, withoutMetadata.stdout);
  } finally {
    await server.close();
  }
});

test('--base with credentials fails closed without echoing credentials', async () => {
  const server = await startGateServer();
  try {
    const embeddedUser = 'embedded-user-do-not-print';
    const embeddedPassword = 'embedded-password-do-not-print';
    const baseWithCredentials = server.baseUrl.replace(
      'http://',
      `http://${embeddedUser}:${embeddedPassword}@`,
    );
    const result = await runGate(baseWithCredentials, { ...AUTH_ENV, ...PROVIDER_ENV });
    const output = result.stdout + result.stderr;

    assert.equal(result.timedOut, false);
    assert.equal(result.signal, null);
    assert.equal(result.code, 1);
    assert.equal(result.stdout, '');
    assert.match(result.stderr, /FAIL handoff blocker gate: --base must not include credentials/);
    assert.equal(output.includes(embeddedUser), false, 'embedded username leaked');
    assert.equal(output.includes(embeddedPassword), false, 'embedded password leaked');
    assertNoValuesEchoed(output, { ...AUTH_ENV, ...PROVIDER_ENV });
    assert.equal(server.requests.length, 0);
  } finally {
    await server.close();
  }
});

test('metadata json --base with credentials fails closed with sanitized metadata and no requests', async () => {
  const server = await startGateServer();
  try {
    const embeddedUser = 'embedded-metadata-user-do-not-print';
    const embeddedPassword = 'embedded-metadata-password-do-not-print';
    const baseWithCredentials = server.baseUrl.replace(
      'http://',
      `http://${embeddedUser}:${embeddedPassword}@`,
    );
    const vars = { ...AUTH_ENV, ...PROVIDER_ENV };
    const result = await runGate(baseWithCredentials, vars, ['--json', '--metadata']);
    const output = result.stdout + result.stderr;

    assert.equal(result.timedOut, false);
    assert.equal(result.signal, null);
    assert.equal(result.code, 1);
    const payload = parseJsonStdout(result);

    assert.equal(payload.ok, false);
    assert.equal(payload.baseUrl, server.baseUrl);
    assert.deepEqual(payload.counts, { open: 0, fail: 1, warn: 0 });
    assert.equal(payload.results.length, 1);
    assert.equal(payload.results[0].line, 'FAIL handoff blocker gate: --base must not include credentials');
    assertMetadata(payload, { softOpen: false, effectiveExitCode: 1 });
    assertEmptyActionItems(payload);
    assert.equal(output.includes(embeddedUser), false, 'embedded username leaked');
    assert.equal(output.includes(embeddedPassword), false, 'embedded password leaked');
    assertNoValuesEchoed(output, vars);
    assert.equal(server.requests.length, 0);
  } finally {
    await server.close();
  }
});

test('metadata json unknown argument fails without echoing argument text or credentials', async () => {
  const server = await startGateServer();
  try {
    const embeddedUser = 'embedded-unknown-user-do-not-print';
    const embeddedPassword = 'embedded-unknown-password-do-not-print';
    const unknownArg = '--unknown-token=unknown-token-value-do-not-print';
    const baseWithCredentials = server.baseUrl.replace(
      'http://',
      `http://${embeddedUser}:${embeddedPassword}@`,
    );
    const vars = { ...AUTH_ENV, ...PROVIDER_ENV };
    const result = await runGate(baseWithCredentials, vars, ['--json', '--metadata', unknownArg]);
    const output = result.stdout + result.stderr;

    assert.equal(result.timedOut, false);
    assert.equal(result.signal, null);
    assert.equal(result.code, 1);
    const payload = parseJsonStdout(result);

    assert.equal(payload.ok, false);
    assert.equal(payload.baseUrl, server.baseUrl);
    assert.deepEqual(payload.counts, { open: 0, fail: 1, warn: 0 });
    assert.equal(payload.results.length, 1);
    assert.equal(payload.results[0].line, 'FAIL handoff blocker gate: Unknown argument');
    assertMetadata(payload, { softOpen: false, effectiveExitCode: 1 });
    assertEmptyActionItems(payload);
    assert.equal(output.includes(unknownArg), false, 'unknown argument leaked');
    assert.equal(output.includes(embeddedUser), false, 'embedded username leaked');
    assert.equal(output.includes(embeddedPassword), false, 'embedded password leaked');
    assertNoValuesEchoed(output, vars);
    assert.equal(server.requests.length, 0);
  } finally {
    await server.close();
  }
});

test('json soft-open --base with credentials still fails closed without requests', async () => {
  const server = await startGateServer();
  try {
    const embeddedUser = 'embedded-soft-user-do-not-print';
    const embeddedPassword = 'embedded-soft-password-do-not-print';
    const baseWithCredentials = server.baseUrl.replace(
      'http://',
      `http://${embeddedUser}:${embeddedPassword}@`,
    );
    const vars = { ...AUTH_ENV, ...PROVIDER_ENV };
    const result = await runGate(baseWithCredentials, vars, ['--json', '--soft-open']);
    const output = result.stdout + result.stderr;

    assert.equal(result.timedOut, false);
    assert.equal(result.signal, null);
    assert.equal(result.code, 1);
    const payload = parseJsonStdout(result);

    assert.equal(payload.ok, false);
    assert.equal(payload.baseUrl, server.baseUrl);
    assert.deepEqual(payload.counts, { open: 0, fail: 1, warn: 0 });
    assert.equal(payload.results.length, 1);
    assert.equal(payload.results[0].line, 'FAIL handoff blocker gate: --base must not include credentials');
    assert.equal(output.includes(embeddedUser), false, 'embedded username leaked');
    assert.equal(output.includes(embeddedPassword), false, 'embedded password leaked');
    assertNoValuesEchoed(output, vars);
    assert.equal(server.requests.length, 0);
  } finally {
    await server.close();
  }
});

test('json mode --base with credentials fails closed without echoing credentials', async () => {
  const server = await startGateServer();
  try {
    const embeddedUser = 'embedded-json-user-do-not-print';
    const embeddedPassword = 'embedded-json-password-do-not-print';
    const baseWithCredentials = server.baseUrl.replace(
      'http://',
      `http://${embeddedUser}:${embeddedPassword}@`,
    );
    const vars = { ...AUTH_ENV, ...PROVIDER_ENV };
    const result = await runGate(baseWithCredentials, vars, ['--json']);
    const output = result.stdout + result.stderr;

    assert.equal(result.timedOut, false);
    assert.equal(result.signal, null);
    assert.equal(result.code, 1);
    const payload = parseJsonStdout(result);

    assert.equal(payload.ok, false);
    assert.equal(payload.baseUrl, server.baseUrl);
    assert.deepEqual(payload.counts, { open: 0, fail: 1, warn: 0 });
    assert.equal(payload.results.length, 1);
    assert.equal(payload.results[0].line, 'FAIL handoff blocker gate: --base must not include credentials');
    assert.equal(output.includes(embeddedUser), false, 'embedded username leaked');
    assert.equal(output.includes(embeddedPassword), false, 'embedded password leaked');
    assertNoValuesEchoed(output, vars);
    assert.equal(server.requests.length, 0);
  } finally {
    await server.close();
  }
});
