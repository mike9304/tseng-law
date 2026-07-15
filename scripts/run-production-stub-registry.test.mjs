// Direct R02 production-stub-registry JSX-text detection proof.
//
// Scope: prove the executable candidate-text scanner detects bare JSX child
// text carrying mock/stub/fake markers (e.g. <span>mock data</span>) and fails
// the real --check gate when those occurrences are unmapped, while ordinary
// human copy in the same position is not spuriously classified and the
// negative-language exemption still suppresses disclaimers like "not a fake".
//
// Every run invokes the real CLI as a subprocess against a throwaway fixture
// repository built under mkdtemp. No persistent state is written.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

const REPO_ROOT = path.resolve(import.meta.dirname, '..');
const CLI = path.join(REPO_ROOT, 'scripts', 'run-production-stub-registry.mjs');

const cleanupRoots = [];
test.after(() => {
  while (cleanupRoots.length) rmSync(cleanupRoots.pop(), { recursive: true, force: true });
});

function track(root) {
  cleanupRoots.push(root);
  return root;
}

// One fully-matched blocked entry. With only Widget.tsx present the gate
// passes (one mapped STUB_MODE occurrence, zero unmapped, zero open rows).
// Adding an unmapped file flips the gate, isolating the contribution of JSX
// child text specifically.
const MANIFEST = {
  version: 1,
  entries: [
    {
      id: 'fixture-widget-stub-mode',
      category: 'widget',
      sourcePath: 'src/Widget.tsx',
      sourcePattern: 'STUB_MODE',
      sourceExpectedOccurrences: 1,
      occurrencePatterns: ['STUB_MODE'],
      expectedOccurrences: 1,
      productionGuardAnchors: [
        {
          sourcePath: 'src/Widget.tsx',
          sourcePattern: 'if \\(isProduction\\(\\)\\) return null;',
          expectedOccurrences: 1,
        },
      ],
      productionPolicy: 'blocked',
      operationalSuccessAllowedInProduction: false,
      owner: 'fixture',
      notes: 'Fixture entry: development-only stub flag fails closed in production.',
    },
  ],
};

const WIDGET_TSX = [
  'const STUB_MODE = true;',
  'function isProduction(): boolean {',
  '  return process.env.NODE_ENV === "production";',
  '}',
  'export function Widget(): null {',
  '  if (isProduction()) return null;',
  '  return null;',
  '}',
  '',
].join('\n');

function buildFixture() {
  const root = realpathSync(track(mkdtempSync(path.join(os.tmpdir(), 'r02-jsx-text-'))));
  mkdirSync(path.join(root, 'src'), { recursive: true });
  mkdirSync(path.join(root, 'docs', 'stub-registry'), { recursive: true });
  writeFileSync(
    path.join(root, 'package.json'),
    `${JSON.stringify({ name: 'fixture', version: '1.0.0', private: true }, null, 2)}\n`,
    'utf8',
  );
  writeFileSync(
    path.join(root, 'docs', 'stub-registry', 'production-stubs.json'),
    `${JSON.stringify(MANIFEST, null, 2)}\n`,
    'utf8',
  );
  writeFileSync(path.join(root, 'src', 'Widget.tsx'), WIDGET_TSX, 'utf8');
  return root;
}

function runCli(fixtureRepo, mode) {
  // cwd stays on the real repo so vite-node can resolve `typescript` and the
  // `../src/...` imports inside the CLI source; --repository-root + --manifest
  // redirect the scan onto the throwaway fixture (same flags CI would pass to
  // scan a alternate tree).
  const manifest = path.join(fixtureRepo, 'docs', 'stub-registry', 'production-stubs.json');
  const result = spawnSync(
    process.execPath,
    [CLI, mode, '--repository-root', fixtureRepo, '--manifest', manifest],
    { cwd: REPO_ROOT, encoding: 'utf8', env: { ...process.env } },
  );
  return {
    status: typeof result.status === 'number' ? result.status : 1,
    stdout: (result.stdout ?? '').trim(),
    stderr: (result.stderr ?? '').trim(),
  };
}

function parseDryRunReport(stdout) {
  const splitAt = stdout.indexOf('\n# Production stub registry');
  const jsonText = splitAt === -1 ? stdout : stdout.slice(0, splitAt);
  return JSON.parse(jsonText);
}

test('baseline fixture with only the mapped stub passes --check', () => {
  const fixture = buildFixture();
  const result = runCli(fixture, '--check');

  assert.equal(result.status, 0, `baseline must pass; stdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
  assert.match(result.stdout, /R02 production stub gate: PASS/);
  assert.match(result.stdout, /unmapped=0/);
});

test('bare JSX child text carrying mock/stub/fake markers is detected and fails --check when unmapped', () => {
  const fixture = buildFixture();
  writeFileSync(
    path.join(fixture, 'src', 'Banner.tsx'),
    [
      'export function Banner() {',
      '  return (',
      '    <div>',
      '      <p>mock preview content</p>',
      '      <span>stub response payload</span>',
      '      <em>fake sample entry</em>',
      '    </div>',
      '  );',
      '}',
      '',
    ].join('\n'),
    'utf8',
  );
  const check = runCli(fixture, '--check');

  assert.notEqual(check.status, 0, 'unmapped JSX-text markers must fail the gate');
  assert.match(check.stdout, /R02 production stub gate: FAIL/);
  assert.match(check.stdout, /unmapped=3$/m);

  // Inspect the full report to prove each JSX child marker is the source of
  // the unmapped occurrence (not some incidental token elsewhere).
  const report = parseDryRunReport(runCli(fixture, '--dry-run').stdout);
  const bannerUnmapped = report.unmappedOccurrences.filter((row) => row.sourcePath === 'src/Banner.tsx');
  assert.equal(
    bannerUnmapped.length,
    3,
    `expected 3 unmapped Banner.tsx JSX-text occurrences; got:\n${JSON.stringify(bannerUnmapped, null, 2)}`,
  );
  for (const marker of ['mock preview content', 'stub response payload', 'fake sample entry']) {
    assert.ok(
      bannerUnmapped.some((row) => row.text.includes(marker)),
      `expected JSX-text marker "${marker}" to be reported as unmapped`,
    );
  }
  assert.equal(report.summary.open, 0, 'detection must not relabel the matched manifest row as open');
});

test('ordinary JSX copy and negative-language disclaimers are not spuriously classified', () => {
  const fixture = buildFixture();
  writeFileSync(
    path.join(fixture, 'src', 'Hero.tsx'),
    [
      'export function Hero() {',
      '  return (',
      '    <section>',
      '      <h1>Experienced Legal Counsel</h1>',
      '      <p>Contact our firm for a consultation today.</p>',
      '      <p>This profile is not a fake review.</p>',
      '    </section>',
      '  );',
      '}',
      '',
    ].join('\n'),
    'utf8',
  );
  const check = runCli(fixture, '--check');

  assert.equal(check.status, 0, `ordinary copy must pass; stdout:\n${check.stdout}\nstderr:\n${check.stderr}`);
  assert.match(check.stdout, /R02 production stub gate: PASS/);
  assert.match(check.stdout, /unmapped=0/);

  const report = parseDryRunReport(runCli(fixture, '--dry-run').stdout);
  const heroOccurrences = [
    ...report.mappedOccurrences,
    ...report.unmappedOccurrences,
  ].filter((row) => row.sourcePath === 'src/Hero.tsx');
  assert.equal(
    heroOccurrences.length,
    0,
    `Hero.tsx must contribute no occurrences; got:\n${JSON.stringify(heroOccurrences, null, 2)}`,
  );
});
