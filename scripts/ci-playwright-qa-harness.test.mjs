import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const repositoryRoot = path.resolve(import.meta.dirname, '..');

const targets = [
  '.github/workflows/builder-quality.yml',
  '.github/workflows/builder-visual.yml',
  'scripts/visual-baselines-docker.sh',
];

for (const relativePath of targets) {
  test(`${relativePath} runs Playwright through the attested isolated QA harness`, () => {
    const source = readFileSync(path.join(repositoryRoot, relativePath), 'utf8');

    assert.match(source, /http:\/\/127\.0\.0\.1:3000/u);
    assert.doesNotMatch(
      source,
      /\bBASE_URL\s*(?::|=)\s*['"]?http:\/\/localhost(?::|\/|['"])/u,
      'Playwright BASE_URL must use the exact 127.0.0.1 origin required by playwright.config.ts',
    );
    assert.doesNotMatch(
      source,
      /\bnpm run start\b/u,
      'Playwright CI must not bypass the attested QA harness with a plain Next start',
    );
    assert.match(source, /NEXT_DIST_DIR(?:=|:)\s*['"]?\.next-build/u);
    assert.match(source, /\.\/scripts\/start-qa-server\.sh/u);
    assert.match(source, /manifest-path[\s\S]*state === "ready"/u);
    assert.match(source, /trap cleanup_qa_harness EXIT/u);
    assert.match(source, /kill -TERM "\$QA_HARNESS_PID"/u);
    assert.match(
      source,
      /wait "\$QA_HARNESS_PID"/u,
      'the wrapper must wait for the harness checksum teardown before exiting',
    );
  });
}

test('builder quality keeps LHCI outside the Playwright harness lifecycle', () => {
  const source = readFileSync(
    path.join(repositoryRoot, '.github/workflows/builder-quality.yml'),
    'utf8',
  );

  assert.match(source, /^\s+- run: npm run lhci$/mu);
  assert.ok(
    source.indexOf('- run: npm run lhci') > source.indexOf('trap cleanup_qa_harness EXIT'),
    'LHCI must remain a separate step after the attested Playwright lifecycle',
  );
});

test('builder quality runs release-config checks for every release configuration input', () => {
  const source = readFileSync(
    path.join(repositoryRoot, '.github/workflows/builder-quality.yml'),
    'utf8',
  );

  assert.match(source, /^\s+- run: npm run test:release-config$/mu);

  for (const triggerPath of [
    '.github/workflows/builder-quality.yml',
    '.env.example',
    'next.config.mjs',
    'vercel.json',
    'tsconfig.json',
    'vitest.config.ts',
    'package.json',
    'package-lock.json',
    'scripts/ci-playwright-qa-harness.test.mjs',
    'scripts/security-headers-config.test.mjs',
  ]) {
    assert.ok(
      source.includes(`      - '${triggerPath}'`),
      `${triggerPath} must explicitly trigger release-config CI`,
    );
  }
});
