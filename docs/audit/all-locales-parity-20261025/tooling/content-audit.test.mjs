import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { auditBatch } from './content-audit.mjs';

const repoRoot = fileURLToPath(new URL('../../../../', import.meta.url));
const sourceFile = '704-taiwan-arc-first-application.md';
const acceptedSource = readFileSync(path.join(repoRoot, 'src/content/columns-en', sourceFile), 'utf8');

function fixture(t, transform = (raw) => raw) {
  const dir = mkdtempSync(path.join(tmpdir(), 'column-content-audit-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const contentRoot = path.join(dir, 'content');
  for (const name of ['columns-en', 'columns-nl']) mkdirSync(path.join(contentRoot, name), { recursive: true });
  writeFileSync(path.join(contentRoot, 'columns-en', sourceFile), acceptedSource);
  const target = path.join(contentRoot, 'columns-nl', sourceFile);
  const raw = acceptedSource.replace(/audience:.*\n/, 'audience: ["nl"]\n');
  writeFileSync(target, transform(raw));
  return { repoRoot, contentRoot, files: [target], sourceLocale: 'en', target };
}

test('a missing official citation is an error even if a sources heading and other links remain', async (t) => {
  const sourceUrl = 'https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=22';
  assert.ok(acceptedSource.includes(sourceUrl), 'accepted-source fixture changed: inspect the cited law');
  const options = fixture(t, (raw) => raw.replaceAll(sourceUrl, 'https://example.org/replacement'));
  const result = await auditBatch(options);
  assert.ok(result.files[0].errors.some((item) => item.code === 'source-url-missing' && item.url === sourceUrl));
  assert.equal(result.automatedStatus, 'FAIL');
});

test('a nonexistent same-language column link fails against the on-disk full-slug inventory', async (t) => {
  const options = fixture(t, (raw) => `${raw}\n[Other article](/nl/columns/does-not-exist)\n`);
  const result = await auditBatch(options);
  assert.ok(result.files[0].errors.some((item) => item.code === 'internal-link-missing' && item.href === '/nl/columns/does-not-exist'));
});

test('removing a legal condition cannot become a semantic pass when source URLs and numbers survive', async (t) => {
  const condition = 'Only if the actual job and employer are covered by the permit or exemption that applies to you.';
  assert.ok(acceptedSource.includes(condition), 'accepted-source fixture changed: inspect the work-permission condition');
  const options = fixture(t, (raw) => raw.replace(condition, 'An ARC gives you work rights.'));
  const result = await auditBatch(options);
  const review = result.files[0].reviews.find((item) => item.code === 'legal-conditions');
  assert.ok(review, 'legal conditions must have an unresolved source-to-target review record');
  assert.equal(result.semanticStatus, 'REVIEW_REQUIRED');
  assert.equal(review.status, 'REQUIRED');
  assert.ok(review.sourcePassages.some((item) => item.text.includes(condition)));
  assert.ok(!review.targetPassages.some((item) => item.text.includes(condition)));
});

test('an omitted source FAQ is an error even when the remaining FAQ entries parse', async (t) => {
  const options = fixture(t, (raw) => raw.replace(/faq:\n  - q:.*\n    a:.*\n/, 'faq:\n'));
  const result = await auditBatch(options);
  const omitted = result.files[0].errors.find((item) => item.code === 'faq-source-omitted');
  assert.ok(omitted);
  assert.equal(omitted.sourceCount, 3);
  assert.equal(omitted.targetCount, 2);
});

test('a heading with a changed statutory number is preserved in the required numeric review', async (t) => {
  const options = fixture(t, (raw) => `${raw}\n## A 9999-day deadline\n`);
  const result = await auditBatch(options);
  const review = result.files[0].reviews.find((item) => item.code === 'numbers-dates-currencies');
  assert.ok(review.targetOnly.some((item) => item.token === '9999' && item.count === 1));
  assert.ok(review.targetEvidence.some((item) => item.text === 'A 9999-day deadline'));
});

test('a translated category that moves the article to company formation fails its real category identity', async (t) => {
  const options = fixture(t, (raw) => raw.replace('categories: ["Taiwan Legal Information"]', 'categories: ["Oprichting van een vennootschap in Taiwan"]'));
  const result = await auditBatch(options);
  const mismatch = result.files[0].errors.find((item) => item.code === 'source-category-changed');
  assert.ok(mismatch);
  assert.equal(mismatch.source, 'legal');
  assert.equal(mismatch.target, 'formation');
});

test('changed numeric tokens remain visible review evidence, never zero-filled or silently waived', async (t) => {
  const options = fixture(t, (raw) => `${raw}\nThe deadline is 9999 days.\n`);
  const result = await auditBatch(options);
  const review = result.files[0].reviews.find((item) => item.code === 'numbers-dates-currencies');
  assert.ok(review, 'numeric differences must have an unresolved review record');
  assert.equal(review.status, 'REQUIRED');
  assert.ok(review.targetOnly.some((item) => item.token === '9999' && item.count === 1));
  assert.ok(review.targetEvidence.some((item) => item.text.includes('9999 days')));
});

test('selected new columns without the correct audience fail; unselected legacy columns are not rewritten or gated', async (t) => {
  const options = fixture(t, (raw) => raw.replace(/audience:.*\n/, 'audience: ["ko"]\n'));
  const legacy = path.join(options.contentRoot, 'columns-nl', '010-taiwan-gym-injury-lawsuit.md');
  writeFileSync(legacy, '---\ntitle: "legacy"\n---\nLegacy body.\n');
  const result = await auditBatch(options);
  assert.ok(result.files[0].errors.some((item) => item.code === 'audience-not-local'));
  assert.ok(result.files[0].errors.some((item) => item.code === 'board-hidden'));
  assert.equal(result.files.length, 1);
  assert.equal(readFileSync(legacy, 'utf8'), '---\ntitle: "legacy"\n---\nLegacy body.\n');
});

test('duplicate full slugs fail even with different numeric prefixes; equal numbers with different slugs do not collide', async (t) => {
  const options = fixture(t);
  writeFileSync(path.join(options.contentRoot, 'columns-nl', '999-taiwan-arc-first-application.md'), acceptedSource);
  writeFileSync(path.join(options.contentRoot, 'columns-nl', '704-entirely-different-topic.md'), acceptedSource);
  const result = await auditBatch(options);
  const duplicate = result.files[0].errors.find((item) => item.code === 'duplicate-locale-slug');
  assert.ok(duplicate, 'two filenames resolve to the same public URL');
  assert.equal(duplicate.paths.length, 2);
  assert.ok(duplicate.paths.every((name) => name.endsWith('taiwan-arc-first-application.md')));
});

test('malformed YAML is rejected instead of accepting fields found by a regex', async (t) => {
  const options = fixture(t, (raw) => raw.replace(/audience:.*\n/, 'audience: ["nl"\n'));
  const result = await auditBatch(options);
  assert.ok(result.files[0].errors.some((item) => item.code === 'frontmatter-parse'));
  assert.equal(result.automatedStatus, 'FAIL');
});
