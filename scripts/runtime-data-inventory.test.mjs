import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, readdir, rm, stat, symlink } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { spawn } from 'node:child_process';
import { inventoryRuntimeData, walkTree } from './runtime-data-inventory.mjs';

async function fixtureRoot() {
  const root = await mkdtemp(path.join(os.tmpdir(), 'wb-r03-'));
  const site = path.join(root, 'builder-site', 'tseng-law-main-site');
  await mkdir(path.join(site, 'pages'), { recursive: true });
  await mkdir(path.join(root, 'builder-revisions', 'page-1'), { recursive: true });
  await writeFile(path.join(root, 'builder-revisions', 'page-1', 'revision.json'), 'secret-like payload');
  return { root, site };
}

async function writeSite(site, data) {
  await writeFile(path.join(site, 'site.json'), JSON.stringify(data));
}

async function writePage(site, id, state = 'draft', payload = {}) {
  await writeFile(path.join(site, 'pages', `${id}.${state}.json`), JSON.stringify({ document: payload }));
}

async function treeDigest(root) {
  const entries = [];
  async function walk(dir) {
    const children = await readdir(dir, { withFileTypes: true });
    children.sort((a, b) => a.name.localeCompare(b.name));
    for (const child of children) {
      const absolute = path.join(dir, child.name);
      const relative = path.relative(root, absolute);
      if (child.isDirectory()) await walk(absolute);
      else entries.push(`${relative}:${(await stat(absolute)).size}:${(await readFile(absolute)).toString('hex')}`);
    }
  }
  await walk(root);
  return entries.join('\n');
}

test('happy path inventories canonical metadata, pages, revisions, and stable checksums', async (t) => {
  const { root, site } = await fixtureRoot();
  t.after(() => rm(root, { recursive: true, force: true }));
  await writeSite(site, {
    siteId: 'tseng-law-main-site', name: 'Fixture', locale: 'ko',
    pages: [{ pageId: 'page-home', slug: '', locale: 'ko', isHomePage: true }, { pageId: 'page-about', slug: 'about', locale: 'ko' }],
    navigation: [{ pageId: 'page-home' }],
  });
  await writePage(site, 'page-home', 'draft');
  await writePage(site, 'page-home', 'published');
  await writePage(site, 'page-about', 'draft');
  const before = await treeDigest(root);
  const first = await inventoryRuntimeData(root);
  const second = await inventoryRuntimeData(root);
  const after = await treeDigest(root);
  assert.equal(first.canonicalSite.siteId, 'tseng-law-main-site');
  assert.deepEqual(first.draftPublishedCounts, { draft: 2, published: 1 });
  assert.deepEqual(first.pageIdsReferencedBySiteMetadata, ['page-about', 'page-home']);
  assert.deepEqual(first.canonicalPageFileIds, ['page-about', 'page-home']);
  assert.equal(first.builderRevisions.directoryCount, 1);
  assert.equal(first.builderRevisions.fileCount, 1);
  assert.equal(first.builderRevisions.bytes, Buffer.byteLength('secret-like payload'));
  assert.equal(first.builderRevisions.manifest.length, 1);
  assert.equal(typeof first.builderRevisions.manifestSha256, 'string');
  assert.equal(first.checksums.canonicalSiteJsonSha256, second.checksums.canonicalSiteJsonSha256);
  assert.equal(first.checksums.canonicalManifestSha256, second.checksums.canonicalManifestSha256);
  assert.ok(first.canonicalManifest.some((item) => item.path === 'pages/page-home.draft.json'));
  assert.ok(first.candidates.some((item) => item.path === 'builder-site/tseng-law-main-site/site.json'));
  assert.ok(first.candidates.some((item) => item.path === 'builder-site/tseng-law-main-site/pages/page-home.draft.json'));
  assert.equal(after, before);
});

test('canonical manifest hashes every regular file, not only JSON', async (t) => {
  const { root, site } = await fixtureRoot();
  t.after(() => rm(root, { recursive: true, force: true }));
  await writeSite(site, { siteId: 'tseng-law-main-site', locale: 'ko', pages: [] });
  await writeFile(path.join(site, 'asset.bin'), Buffer.from([0, 1, 2, 255]));
  const report = await inventoryRuntimeData(root);
  const asset = report.canonicalManifest.find((item) => item.path === 'asset.bin');
  assert.equal(asset.bytes, 4);
  assert.match(asset.sha256, /^[a-f0-9]{64}$/);
});

test('reference set excludes arbitrary nested navigation pageIds and includes only pages plus linked ids', async (t) => {
  const { root, site } = await fixtureRoot();
  t.after(() => rm(root, { recursive: true, force: true }));
  await writeSite(site, {
    siteId: 'tseng-law-main-site', locale: 'ko',
    pages: [{ pageId: 'page-home', slug: '', locale: 'ko', isHomePage: true, linkedPageIds: { en: 'page-home-en' } }],
    navigation: [{ pageId: 'page-home', children: [{ pageId: 'external-services-ip' }] }],
  });
  await writePage(site, 'page-home');
  await writePage(site, 'page-home-en');
  const report = await inventoryRuntimeData(root);
  assert.deepEqual(report.pageIdsReferencedBySiteMetadata, ['page-home', 'page-home-en']);
  assert.deepEqual(report.pagePayloads.missingReferenced, []);
  assert.equal(report.pagePayloads.missingReferenced.includes('external-services-ip'), false);
});

test('reports same-locale duplicate slug and home violations', async (t) => {
  const { root, site } = await fixtureRoot();
  t.after(() => rm(root, { recursive: true, force: true }));
  await writeSite(site, {
    siteId: 'tseng-law-main-site', locale: 'ko',
    pages: [
      { pageId: 'a', slug: 'same', locale: 'ko', isHomePage: true },
      { pageId: 'b', slug: 'same', locale: 'ko', isHomePage: true },
      { pageId: 'c', slug: '', locale: 'ko', isHomePage: false },
    ],
  });
  await writePage(site, 'a'); await writePage(site, 'b'); await writePage(site, 'c');
  const report = await inventoryRuntimeData(root);
  assert.equal(report.sameLocaleDuplicateSlugViolations.length, 1);
  assert.ok(report.sameLocaleHomeViolations.length >= 1);
  assert.equal(report.violations.some((item) => item.type === 'duplicate-slug'), true);
});

test('slugByLocale participates in locale duplicate checks and missing expected-locale homes are explicit', async (t) => {
  const { root, site } = await fixtureRoot();
  t.after(() => rm(root, { recursive: true, force: true }));
  await writeSite(site, {
    siteId: 'tseng-law-main-site', locale: 'ko',
    pages: [
      { pageId: 'home', locale: 'ko', slug: '', isHomePage: true },
      { pageId: 'a', locale: 'ko', slugByLocale: { ko: 'a', en: 'same' }, isHomePage: false, linkedPageIds: { en: 'b' } },
      { pageId: 'b', locale: 'en', slugByLocale: { en: 'same' }, isHomePage: false },
    ],
  });
  await writePage(site, 'home'); await writePage(site, 'a'); await writePage(site, 'b');
  const report = await inventoryRuntimeData(root);
  assert.deepEqual(report.expectedLocales.values, ['en', 'ko']);
  assert.match(report.expectedLocales.source, /slugByLocale/);
  assert.equal(report.sameLocaleDuplicateSlugViolations.length, 1);
  assert.deepEqual(report.missingExpectedLocaleHomeViolations.map((item) => item.locale), ['en']);
});

test('slugByLocale retains the authored base slug when its locale has no override', async (t) => {
  const { root, site } = await fixtureRoot();
  t.after(() => rm(root, { recursive: true, force: true }));
  await writeSite(site, {
    siteId: 'tseng-law-main-site', locale: 'ko',
    pages: [
      { pageId: 'a', locale: 'ko', slug: 'base', slugByLocale: { en: 'english' }, isHomePage: false },
      { pageId: 'b', locale: 'ko', slug: 'base', isHomePage: false },
    ],
  });
  await writePage(site, 'a'); await writePage(site, 'b');
  const report = await inventoryRuntimeData(root);
  assert.equal(report.sameLocaleDuplicateSlugViolations.length, 1);
  assert.equal(report.sameLocaleDuplicateSlugViolations[0][0].locale, 'ko');
});

test('projected linked and slug locales do not create false missing-home findings', async (t) => {
  const { root, site } = await fixtureRoot();
  t.after(() => rm(root, { recursive: true, force: true }));
  await writeSite(site, {
    siteId: 'tseng-law-main-site', locale: 'ko',
    pages: [{ pageId: 'home', locale: 'ko', slug: '', slugByLocale: { en: '' }, linkedPageIds: { en: 'home' }, isHomePage: true }],
  });
  await writePage(site, 'home');
  const report = await inventoryRuntimeData(root);
  assert.deepEqual(report.expectedLocales.values, ['en', 'ko']);
  assert.deepEqual(report.expectedHomeLocales.values, ['ko']);
  assert.deepEqual(report.missingExpectedLocaleHomeViolations, []);
});

test('corrupt page JSON is machine-readable, sanitized, and never KEEP', async (t) => {
  const { root, site } = await fixtureRoot();
  t.after(() => rm(root, { recursive: true, force: true }));
  await writeSite(site, { siteId: 'tseng-law-main-site', locale: 'ko', pages: [{ pageId: 'bad', slug: 'bad', locale: 'ko' }] });
  await writeFile(path.join(site, 'pages', 'bad.draft.json'), '{private-token: SECRET_VALUE');
  const report = await inventoryRuntimeData(root);
  assert.deepEqual(report.pagePayloads.invalid, [{
    path: 'builder-site/tseng-law-main-site/pages/bad.draft.json',
    type: 'page-json-parse',
    reason: 'invalid JSON in canonical page payload',
  }]);
  assert.equal(JSON.stringify(report).includes('SECRET_VALUE'), false);
  assert.equal(report.candidates.find((item) => item.path.endsWith('/bad.draft.json')).classification, 'REVIEW');
});

test('unusable site JSON suppresses missing/orphan conclusions and makes every page REVIEW', async (t) => {
  const { root, site } = await fixtureRoot();
  t.after(() => rm(root, { recursive: true, force: true }));
  await writeFile(path.join(site, 'site.json'), '{customer-secret: DO_NOT_ECHO');
  await writePage(site, 'otherwise-orphan');
  const report = await inventoryRuntimeData(root);
  assert.equal(report.canonicalSite.usable, false);
  assert.equal(report.pagePayloads.analysisStatus, 'unknown');
  assert.equal(report.pagePayloads.conclusionsSuppressed, true);
  assert.equal(report.pagePayloads.missingReferenced, null);
  assert.equal(report.pagePayloads.orphan, null);
  assert.equal(report.blockingViolations.some((item) => item.type === 'site-json-parse'), true);
  assert.equal(JSON.stringify(report).includes('DO_NOT_ECHO'), false);
  assert.ok(report.candidates.filter((item) => item.path.includes('/pages/')).every((item) => item.classification === 'REVIEW'));
});

test('site schema failure also suppresses orphan conclusions', async (t) => {
  const { root, site } = await fixtureRoot();
  t.after(() => rm(root, { recursive: true, force: true }));
  await writeSite(site, { siteId: 'tseng-law-main-site', pages: 'not-an-array' });
  await writePage(site, 'unknown');
  const report = await inventoryRuntimeData(root);
  assert.equal(report.pagePayloads.analysisStatus, 'unknown');
  assert.equal(report.blockingViolations.some((item) => item.type === 'site-schema'), true);
  assert.equal(report.candidates.find((item) => item.path.endsWith('/unknown.draft.json')).classification, 'REVIEW');
});

test('invalid page metadata makes site reference conclusions unknown', async (t) => {
  const { root, site } = await fixtureRoot();
  t.after(() => rm(root, { recursive: true, force: true }));
  await writeSite(site, { siteId: 'tseng-law-main-site', locale: 'ko', pages: [{ slug: 'missing-id' }] });
  await writePage(site, 'unknown');
  const report = await inventoryRuntimeData(root);
  assert.equal(report.pagePayloads.analysisStatus, 'unknown');
  assert.equal(report.blockingViolations.some((item) => item.type === 'site-page-schema'), true);
  assert.equal(report.candidates.find((item) => item.path.endsWith('/unknown.draft.json')).classification, 'REVIEW');
});

test('siteId mismatch and duplicate pageIds are blocking and suppress conclusions', async (t) => {
  for (const [name, data, expectedType] of [
    ['mismatch', { siteId: 'wrong-site', pages: [] }, 'site-id-mismatch'],
    ['duplicates', { siteId: 'tseng-law-main-site', pages: [{ pageId: 'same' }, { pageId: 'same' }] }, 'duplicate-page-id'],
  ]) {
    await t.test(name, async (st) => {
      const { root, site } = await fixtureRoot();
      st.after(() => rm(root, { recursive: true, force: true }));
      await writeSite(site, data);
      const report = await inventoryRuntimeData(root);
      assert.equal(report.canonicalSite.usable, false);
      assert.equal(report.pagePayloads.analysisStatus, 'unknown');
      assert.equal(report.blockingViolations.some((item) => item.type === expectedType), true);
    });
  }
});

test('missing draft and published variants are reported independently', async (t) => {
  const { root, site } = await fixtureRoot();
  t.after(() => rm(root, { recursive: true, force: true }));
  await writeSite(site, { siteId: 'tseng-law-main-site', locale: 'ko', pages: [{ pageId: 'draft-only', locale: 'ko' }, { pageId: 'published-only', locale: 'ko' }] });
  await writePage(site, 'draft-only', 'draft');
  await writePage(site, 'published-only', 'published');
  const report = await inventoryRuntimeData(root);
  assert.deepEqual(report.pagePayloads.missingDraft, ['published-only']);
  assert.deepEqual(report.pagePayloads.missingPublished, ['draft-only']);
  assert.equal(report.blockingViolations.some((item) => item.type === 'missing-draft-page-payload' && item.pageId === 'published-only'), true);
  assert.equal(report.blockingViolations.some((item) => item.type === 'missing-published-page-payload'), false);
  assert.equal(report.violations.some((item) => item.type === 'missing-published-page-payload' && item.pageId === 'draft-only'), true);
});

test('unsafe canonicalSiteId is rejected before any outside namespace can be inspected', async (t) => {
  const { root, site } = await fixtureRoot();
  t.after(() => rm(root, { recursive: true, force: true }));
  await writeSite(site, { siteId: 'tseng-law-main-site', pages: [] });
  await assert.rejects(() => inventoryRuntimeData(root, { canonicalSiteId: '../outside' }), /safe path segment/i);
  await assert.rejects(() => inventoryRuntimeData(root, { canonicalSiteId: '/tmp/outside' }), /safe path segment/i);
});

test('walkTree reports a sanitized incomplete scan when a file disappears mid-walk', async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'wb-r03-race-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const target = path.join(root, 'vanish.json');
  await writeFile(target, '{secret-race-value}');
  let removed = false;
  const report = await walkTree(root, {
    hashFiles: true,
    beforeEntry: async ({ absolute }) => {
      if (!removed && absolute === target) { removed = true; await rm(target); }
    },
  });
  assert.equal(report.incomplete, true);
  assert.equal(report.manifestSha256, null);
  assert.deepEqual(report.errors, [{ type: 'tree-scan-error', operation: 'read', path: 'vanish.json', reason: 'regular file could not be inventoried' }]);
  assert.equal(JSON.stringify(report).includes('secret-race-value'), false);
});

test('walkTree rejects a regular-file to symlink swap before opening', async (t) => {
  const base = await mkdtemp(path.join(os.tmpdir(), 'wb-r03-swap-'));
  const root = path.join(base, 'root');
  const outside = path.join(base, 'outside-secret.json');
  await mkdir(root);
  const target = path.join(root, 'payload.json');
  await writeFile(target, JSON.stringify({ safe: true }));
  await writeFile(outside, 'OUTSIDE_SECRET_MUST_NOT_BE_READ');
  t.after(() => rm(base, { recursive: true, force: true }));
  let swapped = false;
  const report = await walkTree(root, {
    hashFiles: true,
    beforeEntry: async ({ absolute }) => {
      if (!swapped && absolute === target) {
        swapped = true;
        await rm(target);
        await symlink(outside, target, 'file');
      }
    },
  });
  assert.equal(report.incomplete, true);
  assert.equal(report.manifestSha256, null);
  assert.equal(report.files.some((file) => file.path === 'payload.json'), false);
  assert.deepEqual(report.errors, [{ type: 'tree-scan-error', operation: 'read', path: 'payload.json', reason: 'regular file could not be inventoried' }]);
  assert.equal(JSON.stringify(report).includes('OUTSIDE_SECRET_MUST_NOT_BE_READ'), false);
});

test('directory to external symlink swap discards all child names and blocks inventory', async (t) => {
  const { root, site } = await fixtureRoot();
  const external = await mkdtemp(path.join(os.tmpdir(), 'wb-r03-external-dir-'));
  await writeFile(path.join(external, 'customer-token-name.json'), 'CUSTOMER_TOKEN_VALUE');
  t.after(() => Promise.all([rm(root, { recursive: true, force: true }), rm(external, { recursive: true, force: true })]));
  await writeSite(site, { siteId: 'tseng-law-main-site', locale: 'ko', pages: [] });
  const pages = path.join(site, 'pages');
  let swapped = false;
  const report = await inventoryRuntimeData(root, {
    beforeCanonicalEntry: async ({ absolute }) => {
      if (!swapped && absolute === pages) {
        swapped = true;
        await rm(pages, { recursive: true, force: true });
        await symlink(external, pages, 'dir');
      }
    },
  });
  const serialized = JSON.stringify(report);
  assert.equal(report.canonicalManifestIncomplete, true);
  assert.equal(report.checksums.canonicalManifestSha256, null);
  assert.equal(report.blockingViolations.some((item) => item.type === 'canonical-tree-scan-error'), true);
  assert.equal(serialized.includes('customer-token-name'), false);
  assert.equal(serialized.includes('CUSTOMER_TOKEN_VALUE'), false);
  assert.equal(report.canonicalManifest.some((item) => item.path.includes('customer-token-name')), false);
});

test('canonical core changes between parse and verification invalidate the snapshot', async (t) => {
  const { root, site } = await fixtureRoot();
  t.after(() => rm(root, { recursive: true, force: true }));
  await writeSite(site, { siteId: 'tseng-law-main-site', locale: 'ko', pages: [{ pageId: 'page', locale: 'ko' }] });
  await writePage(site, 'page');
  const report = await inventoryRuntimeData(root, {
    afterCanonicalManifest: async () => {
      await writePage(site, 'page', 'draft', { changedGeneration: true });
    },
  });
  assert.equal(report.canonicalManifestIncomplete, true);
  assert.equal(report.checksums.canonicalManifestSha256, null);
  assert.equal(report.canonicalSite.usable, false);
  assert.equal(report.pagePayloads.analysisStatus, 'unknown');
  assert.equal(report.blockingViolations.some((item) => item.type === 'canonical-snapshot-mismatch'), true);
  assert.ok(report.candidates.filter((item) => item.path.includes('/pages/')).every((item) => item.classification === 'REVIEW'));
});

test('reports missing/orphan payloads and classifies explicit/probe candidates', async (t) => {
  const { root, site } = await fixtureRoot();
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, 'builder-site', 'undefined.stale-orphan-20260702'), { recursive: true });
  await mkdir(path.join(root, 'builder-site', 'codex-siteid-probe'), { recursive: true });
  await mkdir(path.join(root, 'builder-site', 'customer-copy'), { recursive: true });
  await writeSite(site, { siteId: 'tseng-law-main-site', locale: 'ko', pages: [{ pageId: 'missing', slug: 'missing', locale: 'ko' }] });
  await writePage(site, 'orphan');
  const report = await inventoryRuntimeData(root);
  assert.deepEqual(report.pagePayloads.missingReferenced, ['missing']);
  assert.deepEqual(report.pagePayloads.orphan, ['builder-site/tseng-law-main-site/pages/orphan.draft.json']);
  const stale = report.candidates.find((item) => item.siteId === 'undefined.stale-orphan-20260702');
  const probe = report.candidates.find((item) => item.siteId === 'codex-siteid-probe');
  const sibling = report.candidates.find((item) => item.siteId === 'customer-copy');
  assert.equal(stale.classification, 'QUARANTINE-CANDIDATE');
  assert.equal(stale.manualApprovalRequired, true);
  assert.equal(probe.classification, 'QUARANTINE-CANDIDATE');
  assert.equal(sibling.classification, 'REVIEW');
});

test('CLI rejects --output entirely and does not mutate any tree', async (t) => {
  const { root, site } = await fixtureRoot();
  const outside = await mkdtemp(path.join(os.tmpdir(), 'wb-r03-no-output-'));
  t.after(() => Promise.all([rm(root, { recursive: true, force: true }), rm(outside, { recursive: true, force: true })]));
  await writeSite(site, { siteId: 'tseng-law-main-site', locale: 'ko', pages: [] });
  const before = await treeDigest(root);
  const script = path.resolve('scripts/runtime-data-inventory.mjs');
  const output = path.join(outside, 'report.json');
  const result = await new Promise((resolve) => {
    const child = spawn(process.execPath, [script, '--root', root, '--output', output], { cwd: path.resolve('.') });
    let stderr = '';
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('close', (code) => resolve({ code, stderr }));
  });
  assert.notEqual(result.code, 0);
  assert.match(result.stderr, /--output is unsupported/i);
  assert.equal(await stat(output).then(() => true, () => false), false);
  assert.equal(await treeDigest(root), before);
});

test('CLI always emits a report to stdout and leaves the runtime tree unchanged', async (t) => {
  const { root, site } = await fixtureRoot();
  t.after(() => rm(root, { recursive: true, force: true }));
  await writeSite(site, { siteId: 'tseng-law-main-site', locale: 'ko', pages: [] });
  const before = await treeDigest(root);
  const script = path.resolve('scripts/runtime-data-inventory.mjs');
  const result = await new Promise((resolve) => {
    const child = spawn(process.execPath, [script, '--root', root, '--dry-run'], { cwd: path.resolve('.') });
    let stdout = ''; let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('close', (code) => resolve({ code, stdout, stderr }));
  });
  assert.equal(result.code, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.dryRun, true);
  assert.equal(await treeDigest(root), before);
});

test('builder-site, canonical-site, and site.json symlinks are not followed', async (t) => {
  const cases = ['builder-site', 'canonical-site', 'site-json'];
  for (const kind of cases) {
    await t.test(kind, async (st) => {
      const base = await mkdtemp(path.join(os.tmpdir(), 'wb-r03-link-input-'));
      const root = path.join(base, 'runtime-data');
      const outside = path.join(base, 'outside');
      await mkdir(root, { recursive: true });
      await mkdir(path.join(outside, 'pages'), { recursive: true });
      await writeFile(path.join(outside, 'site.json'), JSON.stringify({ siteId: 'outside-secret', pages: [] }));
      st.after(() => rm(base, { recursive: true, force: true }));
      if (kind === 'builder-site') {
        await symlink(outside, path.join(root, 'builder-site'), 'dir');
      } else {
        await mkdir(path.join(root, 'builder-site'), { recursive: true });
        if (kind === 'canonical-site') await symlink(outside, path.join(root, 'builder-site', 'tseng-law-main-site'), 'dir');
        else {
          const canonical = path.join(root, 'builder-site', 'tseng-law-main-site');
          await mkdir(path.join(canonical, 'pages'), { recursive: true });
          await symlink(path.join(outside, 'site.json'), path.join(canonical, 'site.json'), 'file');
        }
      }
      const report = await inventoryRuntimeData(root);
      assert.equal(report.canonicalSite.usable, false);
      assert.equal(report.canonicalSite.siteId, null);
      assert.ok(report.blockingViolations.length > 0);
      assert.equal(report.candidates[0].classification, 'REVIEW');
    });
  }
});

test('runtime root symlink is rejected by inventory', async (t) => {
  const { root, site } = await fixtureRoot();
  const outside = await mkdtemp(path.join(os.tmpdir(), 'wb-r03-root-link-'));
  t.after(() => Promise.all([rm(root, { recursive: true, force: true }), rm(outside, { recursive: true, force: true })]));
  await writeSite(site, { siteId: 'tseng-law-main-site', locale: 'ko', pages: [] });
  const rootLink = path.join(outside, 'runtime-link');
  await symlink(root, rootLink, 'dir');
  await assert.rejects(() => inventoryRuntimeData(rootLink), /refusing symlink runtime-data root/i);
});
