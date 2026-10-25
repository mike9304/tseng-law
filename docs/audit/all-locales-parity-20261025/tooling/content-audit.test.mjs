import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
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


test('ordinary Portuguese and Spanish todo in prose and titles is not an unfinished marker', async (t) => {
  const options = fixture(t, (raw) => raw.replace(/^title:.*$/m, 'title: "Todo o arquivo foi lido"') + '\nO arquivo reúne todo o material. Todo documento tem um número. El informe explica todo el recorrido.\n');
  const result = await auditBatch(options);
  assert.equal(result.files[0].errors.filter((item) => item.code === 'placeholder').length, 0);
});

test('explicit TODO markers and existing unfinished text remain errors', async (t) => {
  for (const text of ['TODO', 'Draft TODO remains.', 'todo: add a conclusion', '[todo]', 'TBD', 'lorem ipsum', '[TRANSLATE]', '待補充']) {
    const result = await auditBatch(fixture(t, (raw) => raw + '\n' + text + '\n'));
    assert.ok(result.files[0].errors.some((item) => item.code === 'placeholder'), text);
  }
});

test('explicit legacy pages resolve without treating their cross-language label or meaning as approved', async (t) => {
  for (const href of ['/en/contact', '/ko/contact', '/zh-hant/contact', '/ja/contact', '/en/about', '/de/contact']) {
    const result = await auditBatch(fixture(t, (raw) => `${raw}\n[Contact information in its destination language](${href})\n`));
    assert.ok(!result.files[0].errors.some((item) => item.code === 'internal-link-missing' && item.href === href), href);
    assert.ok(result.files[0].reviews.some((item) => item.code === 'cross-language-link' && item.href === href), href);
    assert.equal(result.semanticStatus, 'REVIEW_REQUIRED');
    assert.equal(result.publicationReady, false);
  }
});

test('unregistered catch-all paths, extra segments and unsupported locales still fail', async (t) => {
  for (const href of ['/en/nonexistent', '/en/contact/nonexistent', '/en/Contact', '/ja/nonexistent', '/de/nonexistent', '/zz/contact']) {
    const result = await auditBatch(fixture(t, (raw) => `${raw}\n[Unknown page](${href})\n`));
    assert.ok(result.files[0].errors.some((item) => item.code === 'internal-link-missing' && item.href === href), href);
  }
});

function legacyContractFixture(t, transform) {
  const root = mkdtempSync(path.join(tmpdir(), 'column-legacy-contract-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const localApp = path.join(root, 'src/app/[locale]');
  mkdirSync(path.join(localApp, '(legacy)'), { recursive: true });
  mkdirSync(path.join(localApp, '[[...slug]]'), { recursive: true });
  for (const name of ['lib', 'data']) symlinkSync(path.join(repoRoot, 'src', name), path.join(root, 'src', name));
  symlinkSync(path.join(repoRoot, 'public'), path.join(root, 'public'));
  const originalLegacy = path.join(repoRoot, 'src/app/[locale]/(legacy)');
  for (const name of readdirSync(originalLegacy)) {
    if (name !== 'index.tsx') symlinkSync(path.join(originalLegacy, name), path.join(localApp, '(legacy)', name));
  }
  writeFileSync(path.join(localApp, '(legacy)/index.tsx'), transform(readFileSync(path.join(originalLegacy, 'index.tsx'), 'utf8')));
  writeFileSync(path.join(localApp, '[[...slug]]/page.tsx'), readFileSync(path.join(repoRoot, 'src/app/[locale]/[[...slug]]/page.tsx')));
  return root;
}

test('legacy resolution follows the render registration rather than a contact allowlist or metadata-only case', async (t) => {
  const changedRoot = legacyContractFixture(t, (raw) => raw.replace("case 'contact':\n      return <ContactLegacyPage", "case 'fixture-contact':\n      return <ContactLegacyPage"));
  const options = fixture(t, (raw) => `${raw}\n[Registered destination](/en/fixture-contact)\n[Metadata alone](/en/contact)\n[Outside the Japanese static policy](/ja/fixture-contact)\n`);
  const result = await auditBatch({ ...options, repoRoot: changedRoot });
  const missing = result.files[0].errors.filter((item) => item.code === 'internal-link-missing');
  assert.ok(!missing.some((item) => item.href === '/en/fixture-contact'));
  assert.ok(missing.some((item) => item.href === '/en/contact'));
  assert.ok(missing.some((item) => item.href === '/ja/fixture-contact'));
});

test('a literal legacy case returning null is not an available page', async (t) => {
  const changedRoot = legacyContractFixture(t, (raw) => raw.replace('return <ContactLegacyPage locale={locale} />;', 'return null;'));
  const options = fixture(t, (raw) => `${raw}\n[No rendered page](/en/contact)\n`);
  const result = await auditBatch({ ...options, repoRoot: changedRoot });
  assert.ok(result.files[0].errors.some((item) => item.code === 'internal-link-missing' && item.href === '/en/contact'));
});
