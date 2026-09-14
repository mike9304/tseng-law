import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

import {
  DESIGN_REVIEW_STATES,
  classifyBlockedRequest,
  parseArgs,
  selectStates,
} from './capture-design-review.mjs';

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(TEST_DIR, 'capture-design-review.mjs');
const ROUTE_PATTERN = /^\/(?:ko|en|ja|zh-hant)(?:\/[A-Za-z0-9._-]+)*$/;

const EXPECTED_IDS = [
  'home-ko-390-body',
  'home-ko-1440-body',
  'home-en-390-body',
  'home-en-1440-body',
  'home-ja-390-body',
  'home-ja-1440-body',
  'home-zh-hant-390-body',
  'home-zh-hant-1440-body',
  'journey-en-390-services',
  'journey-en-390-profile',
  'journey-en-390-pricing',
  'journey-en-390-contact',
  'representative-en-390-article',
  'representative-en-390-search',
  'representative-en-390-checkout',
  'representative-ja-1440-services-menu',
  'july-zh-hant-1024-office-0-detail',
  'july-zh-hant-1024-office-1-detail',
  'july-zh-hant-1024-office-2-detail',
  'july-zh-hant-1024-office-3-detail',
];

function runCli(args, { timeoutMs = 8_000 } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [SCRIPT, ...args], {
      cwd: join(TEST_DIR, '..'),
      env: { ...process.env, LANG: 'C' },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    const timeout = setTimeout(() => {
      timedOut = true;
      child.kill('SIGTERM');
    }, timeoutMs);
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
}

test('상태 목록은 최종 20개 id/route/viewport 를 유지한다', () => {
  assert.equal(DESIGN_REVIEW_STATES.length, 20);
  assert.deepEqual(
    DESIGN_REVIEW_STATES.map((state) => state.id),
    EXPECTED_IDS,
  );

  for (const state of DESIGN_REVIEW_STATES) {
    assert.equal(typeof state.id, 'string');
    assert.equal(typeof state.route, 'string');
    assert.equal(typeof state.locale, 'string');
    assert.equal(typeof state.viewport?.width, 'number');
    assert.equal(typeof state.viewport?.height, 'number');
    assert.ok(state.viewport.width > 0);
    assert.ok(state.viewport.height > 0);
    assert.match(state.capture, /^(viewport|office-section|services-menu)$/);
  }

  assert.equal(
    DESIGN_REVIEW_STATES.find((state) => state.id === 'home-ko-390-body')?.route,
    '/ko',
  );
  assert.deepEqual(
    DESIGN_REVIEW_STATES.find((state) => state.id === 'home-ko-390-body')?.viewport,
    { width: 390, height: 844 },
  );
  assert.equal(
    DESIGN_REVIEW_STATES.find((state) => state.id === 'journey-en-390-profile')?.route,
    '/en/lawyers/wei-tseng',
  );
  assert.equal(
    DESIGN_REVIEW_STATES.find((state) => state.id === 'representative-en-390-article')?.route,
    '/en/columns/taiwan-labor-severance-law',
  );
  assert.equal(
    DESIGN_REVIEW_STATES.find((state) => state.id === 'representative-ja-1440-services-menu')
      ?.capture,
    'services-menu',
  );
  assert.equal(
    DESIGN_REVIEW_STATES.find((state) => state.id === 'representative-ja-1440-services-menu')
      ?.route,
    '/ja',
  );

  for (let index = 0; index < 4; index += 1) {
    const state = DESIGN_REVIEW_STATES.find(
      (row) => row.id === `july-zh-hant-1024-office-${index}-detail`,
    );
    assert.equal(state?.route, '/zh-hant');
    assert.equal(state?.locale, 'zh-hant');
    assert.equal(state?.capture, 'office-section');
    assert.equal(state?.officeIndex, index);
    assert.deepEqual(state?.viewport, { width: 1024, height: 1000 });
  }
});

test('상태 id 는 유일하다', () => {
  const ids = DESIGN_REVIEW_STATES.map((state) => state.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('route 는 locale 접두 공개 경로 형식이다', () => {
  for (const state of DESIGN_REVIEW_STATES) {
    assert.match(state.route, ROUTE_PATTERN);
    assert.ok(state.route.startsWith(`/${state.locale}`));
    assert.equal(state.route.includes('?'), false);
    assert.equal(state.route.includes('#'), false);
  }
});

test('parseArgs / selectStates / 차단 분류', () => {
  const parsed = parseArgs([
    '--base-url',
    'http://127.0.0.1:4173',
    '--out',
    '/tmp/review-out',
    '--only',
    'home-ko-390-body,representative-ja-1440-services-menu',
    '--dry-run',
  ]);
  assert.equal(parsed.baseUrl, 'http://127.0.0.1:4173');
  assert.equal(parsed.out, '/tmp/review-out');
  assert.equal(parsed.dryRun, true);
  assert.deepEqual(parsed.only, [
    'home-ko-390-body',
    'representative-ja-1440-services-menu',
  ]);

  const selected = selectStates(DESIGN_REVIEW_STATES, parsed.only);
  assert.deepEqual(
    selected.map((state) => state.id),
    parsed.only,
  );

  assert.throws(() => parseArgs(['--out', '/tmp/x']), /--base-url/);
  assert.throws(() => parseArgs(['--base-url', 'http://127.0.0.1:1']), /--out/);
  assert.throws(
    () => parseArgs(['--base-url', 'http://127.0.0.1:1', '--out', '/tmp/x', '--nope']),
    /unknown argument/,
  );
  assert.throws(
    () =>
      selectStates(DESIGN_REVIEW_STATES, ['home-ko-390-body', 'not-a-state']),
    /unknown state id/,
  );

  assert.equal(
    classifyBlockedRequest('https://maps.google.com/maps?q=25.05,121.51&z=16&output=embed'),
    'map',
  );
  assert.equal(
    classifyBlockedRequest('https://www.google.com/maps/embed?pb=!1m14'),
    'map',
  );
  assert.equal(classifyBlockedRequest('https://maps.googleapis.com/maps/api/js'), 'map');
  assert.equal(classifyBlockedRequest('https://www.youtube.com/embed/abc'), 'video');
  assert.equal(classifyBlockedRequest('https://www.youtube-nocookie.com/embed/abc'), 'video');
  assert.equal(classifyBlockedRequest('http://127.0.0.1:4173/ko'), null);
  assert.equal(classifyBlockedRequest('http://127.0.0.1:4173/_next/static/chunk.js'), null);
});

test('--dry-run 은 20상태를 JSON 으로 출력하고 파일을 쓰지 않는다', async () => {
  const outDir = await mkdtemp(join(tmpdir(), 'capture-design-review-dry-'));
  try {
    const result = await runCli([
      '--dry-run',
      '--base-url',
      'http://127.0.0.1:1',
      '--out',
      outDir,
    ]);
    assert.equal(result.timedOut, false, result.stderr);
    assert.equal(result.code, 0, result.stderr);
    const report = JSON.parse(result.stdout);
    assert.equal(report.dryRun, true);
    assert.equal(report.baseUrl, 'http://127.0.0.1:1');
    assert.equal(report.out, outDir);
    assert.equal(report.count, 20);
    assert.deepEqual(
      report.states.map((state) => state.id),
      EXPECTED_IDS,
    );
    for (const state of report.states) {
      assert.match(state.route, ROUTE_PATTERN);
      assert.equal(typeof state.viewport.width, 'number');
      assert.equal(typeof state.viewport.height, 'number');
    }
    const written = await readdir(outDir);
    assert.deepEqual(written, []);
  } finally {
    await rm(outDir, { recursive: true, force: true });
  }
});

test('--only 는 dry-run 목록을 필터한다', async () => {
  const result = await runCli([
    '--dry-run',
    '--base-url',
    'http://127.0.0.1:1',
    '--out',
    '/tmp/x',
    '--only',
    'home-en-390-body,july-zh-hant-1024-office-2-detail',
  ]);
  assert.equal(result.code, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.deepEqual(
    report.states.map((state) => state.id),
    ['home-en-390-body', 'july-zh-hant-1024-office-2-detail'],
  );
  assert.equal(report.count, 2);
});
