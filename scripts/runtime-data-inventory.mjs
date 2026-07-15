#!/usr/bin/env node

/**
 * WB-R03 read-only runtime-data inventory.
 *
 * Safety invariants:
 * - never moves or deletes runtime data;
 * - never follows symlinks while inventorying runtime data;
 * - parses JSON content only below the physical builder-site directory;
 * - always writes its report to stdout; persistence is the caller's redirect;
 * - uncertainty is REVIEW, never a quarantine recommendation.
 */

import { createHash } from 'node:crypto';
import { constants } from 'node:fs';
import { lstat, open, opendir, realpath } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const CANONICAL_SITE_ID = 'tseng-law-main-site';
export const CLASSIFICATIONS = Object.freeze({
  KEEP: 'KEEP',
  REVIEW: 'REVIEW',
  QUARANTINE_CANDIDATE: 'QUARANTINE-CANDIDATE',
});

export const KNOWN_PROBE_PREFIXES = Object.freeze([
  'codex-', 'm173-', 'visual-', 'reviews-', 'db-probe-', 'probe-', 'pw-',
  'ui-publish-', 'g-editor-', 'nested-', 'dataset-', 'manual-save-',
  'save-section-', 'custom-preview-', 'unused-',
]);

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_ROOT = path.resolve(SCRIPT_DIR, '..', 'runtime-data');
const SITE_PARSE_REASON = 'invalid JSON in canonical site metadata';
const PAGE_PARSE_REASON = 'invalid JSON in canonical page payload';

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function slash(value) {
  return value.split(path.sep).join('/');
}

function relativeFromRoot(root, absolute) {
  return slash(path.relative(root, absolute));
}

function normalizeLocale(value, fallback = '') {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function normalizeSlug(value) {
  return typeof value === 'string' ? value.trim().replace(/^\/+|\/+$/g, '') : '';
}

function sortStrings(values) {
  return [...values].sort((a, b) => a.localeCompare(b));
}

function pathIsInside(candidate, parent) {
  const relative = path.relative(parent, candidate);
  return relative === '' || (relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative));
}

async function pathType(absolute) {
  try {
    const info = await lstat(absolute);
    if (info.isSymbolicLink()) return 'symlink';
    if (info.isDirectory()) return 'directory';
    if (info.isFile()) return 'file';
    return 'other';
  } catch (error) {
    if (error && typeof error === 'object' && error.code === 'ENOENT') return 'missing';
    throw error;
  }
}

async function safeRegularFile(absolute, containmentRoot, options = {}) {
  const { read = true } = options;
  let handle;
  try {
    const containmentPhysical = await realpath(containmentRoot);
    handle = await open(absolute, constants.O_RDONLY | constants.O_NOFOLLOW);
    const opened = await handle.stat();
    if (!opened.isFile()) throw new Error('not-regular');
    const resolved = await realpath(absolute);
    if (!pathIsInside(resolved, containmentPhysical)) throw new Error('containment');
    const named = await lstat(absolute);
    if (!named.isFile() || named.dev !== opened.dev || named.ino !== opened.ino) throw new Error('identity');
    const bytes = read ? await handle.readFile() : null;
    const openedAfter = await handle.stat();
    const resolvedAfter = await realpath(absolute);
    const namedAfter = await lstat(absolute);
    if (openedAfter.dev !== opened.dev || openedAfter.ino !== opened.ino || openedAfter.size !== opened.size
      || openedAfter.mtimeMs !== opened.mtimeMs || openedAfter.ctimeMs !== opened.ctimeMs
      || resolvedAfter !== resolved || !namedAfter.isFile() || namedAfter.dev !== opened.dev || namedAfter.ino !== opened.ino) {
      throw new Error('changed');
    }
    return { ok: true, bytes, size: opened.size, sha256: bytes ? sha256(bytes) : null };
  } catch {
    return { ok: false, reason: 'regular file failed containment or identity validation' };
  } finally {
    await handle?.close().catch(() => {});
  }
}

function violation(type, targetPath, reason, blocking = false) {
  return { type, path: targetPath, reason, blocking };
}

export async function walkTree(root, options = {}) {
  const { hashFiles = false, beforeEntry = null } = options;
  let rootPhysical = null;

  async function directoryIdentity(dir) {
    try {
      const info = await lstat(dir);
      if (!info.isDirectory() || info.isSymbolicLink()) return null;
      const resolved = await realpath(dir);
      if (!pathIsInside(resolved, rootPhysical)) return null;
      return { dev: info.dev, ino: info.ino, resolved };
    } catch {
      return null;
    }
  }

  function sameDirectory(left, right) {
    return Boolean(left && right && left.dev === right.dev && left.ino === right.ino && left.resolved === right.resolved);
  }

  async function visit(dir, trustedPath) {
    const failure = () => ({
      valid: false,
      fileCount: 0,
      byteCount: 0,
      directoryCount: 0,
      files: [],
      symlinks: [],
      errors: [{ type: 'tree-scan-error', operation: 'readdir', path: trustedPath, reason: 'directory failed containment or identity validation' }],
    });
    const before = await directoryIdentity(dir);
    if (!before) return failure();
    let handle;
    const entries = [];
    try {
      handle = await opendir(dir);
      const afterOpen = await directoryIdentity(dir);
      if (!sameDirectory(before, afterOpen)) return failure();
      for await (const entry of handle) entries.push(entry);
      handle = null;
    } catch {
      return failure();
    } finally {
      await handle?.close().catch(() => {});
    }
    entries.sort((a, b) => a.name.localeCompare(b.name));
    const local = { valid: true, fileCount: 0, byteCount: 0, directoryCount: 0, files: [], symlinks: [], errors: [] };
    for (const entry of entries) {
      const absolute = path.join(dir, entry.name);
      const relativePath = relativeFromRoot(root, absolute);
      if (beforeEntry) await beforeEntry({ absolute, relativePath, entry });
      if (entry.isSymbolicLink()) {
        local.symlinks.push(relativePath);
      } else if (entry.isDirectory()) {
        const nested = await visit(absolute, relativePath);
        local.errors.push(...nested.errors);
        if (nested.valid) {
          local.directoryCount += 1 + nested.directoryCount;
          local.fileCount += nested.fileCount;
          local.byteCount += nested.byteCount;
          local.files.push(...nested.files);
          local.symlinks.push(...nested.symlinks);
        }
      } else if (entry.isFile()) {
        const inspected = await safeRegularFile(absolute, rootPhysical, { read: hashFiles });
        if (!inspected.ok) {
          local.errors.push({ type: 'tree-scan-error', operation: hashFiles ? 'read' : 'stat', path: relativePath, reason: 'regular file could not be inventoried' });
        } else {
          const item = { path: relativePath, bytes: inspected.size };
          if (hashFiles) item.sha256 = inspected.sha256;
          local.files.push(item);
          local.fileCount += 1;
          local.byteCount += inspected.size;
        }
      }
    }
    const after = await directoryIdentity(dir);
    if (!sameDirectory(before, after)) return failure();
    return local;
  }

  let rootType;
  try {
    rootType = await pathType(root);
    if (rootType === 'directory') rootPhysical = await realpath(root);
  } catch {
    rootType = null;
  }
  const result = rootType === 'directory' && rootPhysical
    ? await visit(root, '.')
    : { valid: false, fileCount: 0, byteCount: 0, directoryCount: 0, files: [], symlinks: [], errors: [{ type: 'tree-scan-error', operation: 'stat', path: '.', reason: 'tree root could not be inspected' }] };
  result.files.sort((a, b) => a.path.localeCompare(b.path));
  result.symlinks.sort((a, b) => a.localeCompare(b));
  const incomplete = result.errors.length > 0 || !result.valid;
  return {
    fileCount: result.fileCount,
    byteCount: result.byteCount,
    directoryCount: result.directoryCount,
    files: result.files,
    symlinks: result.symlinks,
    errors: result.errors,
    incomplete,
    manifestSha256: hashFiles && !incomplete ? sha256(JSON.stringify(result.files)) : null,
  };
}

async function safeDirectoryEntries(root, containmentRoot, trustedPath, options = {}) {
  const { allowMissing = false } = options;
  if (allowMissing && await pathType(root) === 'missing') return { entries: [], errors: [], incomplete: false };
  let handle;
  try {
    const containmentPhysical = await realpath(containmentRoot);
    const before = await lstat(root);
    if (!before.isDirectory() || before.isSymbolicLink()) throw new Error('not-directory');
    const resolved = await realpath(root);
    if (!pathIsInside(resolved, containmentPhysical)) throw new Error('containment');
    handle = await opendir(root);
    const opened = await lstat(root);
    const openedResolved = await realpath(root);
    if (!opened.isDirectory() || opened.dev !== before.dev || opened.ino !== before.ino || openedResolved !== resolved) throw new Error('identity');
    const entries = [];
    for await (const entry of handle) entries.push(entry);
    handle = null;
    const after = await lstat(root);
    const afterResolved = await realpath(root);
    if (!after.isDirectory() || after.dev !== before.dev || after.ino !== before.ino || afterResolved !== resolved) throw new Error('changed');
    entries.sort((a, b) => a.name.localeCompare(b.name));
    return { entries, errors: [], incomplete: false };
  } catch {
    return {
      entries: [],
      errors: [{ type: 'tree-scan-error', operation: 'readdir', path: trustedPath, reason: 'directory failed containment or identity validation' }],
      incomplete: true,
    };
  } finally {
    await handle?.close().catch(() => {});
  }
}

async function immediateDirectories(root, containmentRoot, trustedPath, options = {}) {
  const scanned = await safeDirectoryEntries(root, containmentRoot, trustedPath, options);
  return {
    directories: sortStrings(scanned.entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name)),
    symlinks: sortStrings(scanned.entries.filter((entry) => entry.isSymbolicLink()).map((entry) => entry.name)),
    errors: scanned.errors,
    incomplete: scanned.incomplete,
  };
}

function parseJsonSafely(text, kind, targetPath) {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch {
    return {
      ok: false,
      issue: {
        type: `${kind}-json-parse`,
        path: targetPath,
        reason: kind === 'site' ? SITE_PARSE_REASON : PAGE_PARSE_REASON,
        blocking: kind === 'site',
      },
    };
  }
}

function pageFileInfo(name) {
  const match = /^(.*?)\.(draft|published)\.json$/.exec(name);
  return match ? { pageId: match[1], state: match[2] } : null;
}

function validateSite(site, sitePath, expectedSiteId) {
  const issues = [];
  if (!site || typeof site !== 'object' || Array.isArray(site)) {
    issues.push(violation('site-schema', sitePath, 'canonical site metadata must be an object', true));
    return { usable: false, issues, pages: [] };
  }
  if (!Array.isArray(site.pages)) {
    issues.push(violation('site-schema', sitePath, 'canonical site pages must be an array', true));
    return { usable: false, issues, pages: [] };
  }
  if (typeof site.siteId !== 'string' || !site.siteId.trim()) {
    issues.push(violation('site-schema', sitePath, 'canonical site metadata requires a non-empty siteId', true));
  } else if (site.siteId !== expectedSiteId) {
    issues.push(violation('site-id-mismatch', sitePath, 'canonical siteId does not match the requested canonical namespace', true));
  }
  const seenPageIds = new Set();
  const pages = [];
  site.pages.forEach((page, index) => {
    if (!page || typeof page !== 'object' || Array.isArray(page) || typeof page.pageId !== 'string' || !page.pageId.trim()) {
      issues.push(violation('site-page-schema', `${sitePath}#pages[${index}]`, 'site page metadata requires a non-empty pageId', true));
      return;
    }
    const pageId = page.pageId.trim();
    if (seenPageIds.has(pageId)) {
      issues.push(violation('duplicate-page-id', `${sitePath}#pages[${index}]`, 'site page metadata contains a duplicate pageId', true));
      return;
    }
    seenPageIds.add(pageId);
    pages.push(page);
  });
  return { usable: issues.length === 0, issues, pages };
}

function validatePagePayload(value, targetPath) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return violation('page-payload-schema', targetPath, 'canonical page payload must be an object', false);
  }
  if (!Object.prototype.hasOwnProperty.call(value, 'document') || !value.document || typeof value.document !== 'object' || Array.isArray(value.document)) {
    return violation('page-payload-schema', targetPath, 'canonical page payload requires an object document', false);
  }
  return null;
}

function referencedPageIds(pages) {
  const ids = new Set();
  for (const page of pages) {
    ids.add(page.pageId.trim());
    const linked = page.linkedPageIds;
    if (linked && typeof linked === 'object' && !Array.isArray(linked)) {
      for (const id of Object.values(linked)) {
        if (typeof id === 'string' && id.trim()) ids.add(id.trim());
      }
    }
  }
  return ids;
}

function expectedLocaleInfo(site, pages) {
  const locales = new Set();
  const sources = ['site.locale', 'pages[].locale', 'pages[].slugByLocale keys', 'pages[].linkedPageIds keys'];
  const siteLocale = normalizeLocale(site?.locale);
  if (siteLocale) locales.add(siteLocale);
  for (const page of pages) {
    const locale = normalizeLocale(page.locale, siteLocale);
    if (locale) locales.add(locale);
    if (page.slugByLocale && typeof page.slugByLocale === 'object' && !Array.isArray(page.slugByLocale)) {
      Object.keys(page.slugByLocale).filter(Boolean).forEach((item) => locales.add(item));
    }
    if (page.linkedPageIds && typeof page.linkedPageIds === 'object' && !Array.isArray(page.linkedPageIds)) {
      Object.keys(page.linkedPageIds).filter(Boolean).forEach((item) => locales.add(item));
    }
  }
  return { source: sources.join('; '), values: sortStrings(locales) };
}

function expectedHomeLocaleInfo(site, pages) {
  const siteLocale = normalizeLocale(site?.locale);
  const locales = new Set();
  for (const page of pages) {
    const locale = normalizeLocale(page.locale, siteLocale);
    if (locale) locales.add(locale);
  }
  return { source: 'authored pages[].locale (falling back to site.locale)', values: sortStrings(locales) };
}

function localizedPageRows(site, pages) {
  const siteLocale = normalizeLocale(site?.locale);
  const rows = [];
  for (const page of pages) {
    const baseLocale = normalizeLocale(page.locale, siteLocale);
    const slugByLocale = page.slugByLocale && typeof page.slugByLocale === 'object' && !Array.isArray(page.slugByLocale)
      ? page.slugByLocale
      : null;
    if (slugByLocale && Object.keys(slugByLocale).length > 0) {
      for (const [locale, slug] of Object.entries(slugByLocale)) {
        if (locale) rows.push({ pageId: page.pageId, locale, slug: normalizeSlug(slug), isHomePage: page.isHomePage === true });
      }
      if (baseLocale && !Object.prototype.hasOwnProperty.call(slugByLocale, baseLocale)) {
        rows.push({ pageId: page.pageId, locale: baseLocale, slug: normalizeSlug(page.slug), isHomePage: page.isHomePage === true });
      }
    } else {
      rows.push({ pageId: page.pageId, locale: baseLocale, slug: normalizeSlug(page.slug), isHomePage: page.isHomePage === true });
    }
  }
  return rows;
}

function duplicateGroups(rows, keyForRow) {
  const groups = new Map();
  for (const row of rows) {
    const key = keyForRow(row);
    if (key == null) continue;
    const group = groups.get(key) ?? [];
    group.push(row);
    groups.set(key, group);
  }
  return [...groups.values()].filter((group) => group.length > 1)
    .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
}

function localeViolations(site, pages) {
  const rows = localizedPageRows(site, pages);
  const expectedLocales = expectedLocaleInfo(site, pages);
  const expectedHomeLocales = expectedHomeLocaleInfo(site, pages);
  const duplicateSlugs = duplicateGroups(rows, (row) => row.slug ? `${row.locale}\0${row.slug}` : null);
  const duplicateHomes = duplicateGroups(rows, (row) => row.isHomePage ? row.locale : null);
  const emptySlugHomes = duplicateGroups(rows, (row) => row.slug === '' ? row.locale : null);
  const homeCounts = new Map(expectedHomeLocales.values.map((locale) => [locale, 0]));
  for (const row of rows) {
    if (row.isHomePage) homeCounts.set(row.locale, (homeCounts.get(row.locale) ?? 0) + 1);
  }
  const missingHomes = expectedHomeLocales.values
    .filter((locale) => (homeCounts.get(locale) ?? 0) === 0)
    .map((locale) => ({ locale, expectedFrom: expectedHomeLocales.source }));
  return { rows, expectedLocales, expectedHomeLocales, duplicateSlugs, duplicateHomes, emptySlugHomes, missingHomes };
}

function candidateForSite(siteId) {
  if (/^undefined\.stale-orphan-/i.test(siteId)) {
    return { classification: CLASSIFICATIONS.QUARANTINE_CANDIDATE, reason: 'explicit undefined.stale-orphan namespace', manualApprovalRequired: true };
  }
  if (KNOWN_PROBE_PREFIXES.some((prefix) => siteId.toLowerCase().startsWith(prefix))) {
    return { classification: CLASSIFICATIONS.QUARANTINE_CANDIDATE, reason: 'known probe/test namespace prefix', manualApprovalRequired: true };
  }
  return { classification: CLASSIFICATIONS.REVIEW, reason: 'noncanonical builder-site sibling', manualApprovalRequired: true };
}

function pageCandidate(targetPath, pageId, state, siteUsable, referenced, valid) {
  if (!valid) {
    return { path: targetPath, pageId, state, classification: CLASSIFICATIONS.REVIEW, reason: 'canonical page payload is invalid', manualApprovalRequired: true };
  }
  if (!siteUsable) {
    return { path: targetPath, pageId, state, classification: CLASSIFICATIONS.REVIEW, reason: 'reference status unknown because canonical site metadata is unusable', manualApprovalRequired: true };
  }
  if (referenced) {
    return { path: targetPath, pageId, state, classification: CLASSIFICATIONS.KEEP, reason: 'canonical page payload referenced by site page metadata', manualApprovalRequired: false };
  }
  return { path: targetPath, pageId, state, classification: CLASSIFICATIONS.QUARANTINE_CANDIDATE, reason: 'canonical page payload is orphaned from site page metadata', manualApprovalRequired: true };
}

async function inspectCanonical(root, canonicalDir, sitePath, canonicalSiteId, structuralViolations, options = {}) {
  const canonicalTree = await walkTree(canonicalDir, { hashFiles: true, beforeEntry: options.beforeCanonicalEntry });
  for (const error of canonicalTree.errors) {
    structuralViolations.push({ ...error, type: 'canonical-tree-scan-error', path: relativeFromRoot(root, path.join(canonicalDir, error.path === '.' ? '' : error.path)), blocking: true });
  }
  for (const symlink of canonicalTree.symlinks) {
    structuralViolations.push(violation('canonical-symlink', relativeFromRoot(root, path.join(canonicalDir, symlink)), 'symlink is not followed and requires review', true));
  }

  const siteRelative = relativeFromRoot(root, sitePath);
  let siteBytes = null;
  let site = null;
  let siteUsable = false;
  let pages = [];
  const parseIssues = [];
  if (await pathType(sitePath) !== 'file') {
    parseIssues.push(violation('site-unavailable', siteRelative, 'canonical site metadata is missing or not a regular file', true));
  } else {
    const inspected = await safeRegularFile(sitePath, canonicalDir, { read: true });
    if (!inspected.ok) {
      parseIssues.push(violation('site-read-error', siteRelative, 'canonical site metadata failed containment or identity validation', true));
    } else {
      siteBytes = inspected.bytes;
      const manifestSite = canonicalTree.files.find((file) => file.path === 'site.json');
      if (!manifestSite || manifestSite.sha256 !== inspected.sha256) {
        parseIssues.push(violation('canonical-snapshot-mismatch', siteRelative, 'canonical site metadata changed after the initial manifest', true));
      } else {
        const parsed = parseJsonSafely(siteBytes.toString('utf8'), 'site', siteRelative);
        if (!parsed.ok) parseIssues.push(parsed.issue);
        else {
          site = parsed.value;
          const schema = validateSite(site, siteRelative, canonicalSiteId);
          siteUsable = schema.usable && !canonicalTree.incomplete;
          pages = schema.pages;
          parseIssues.push(...schema.issues);
        }
      }
    }
  }

  const pageDir = path.join(canonicalDir, 'pages');
  const pageFiles = [];
  let pageReadIncomplete = false;
  if (await pathType(pageDir) === 'directory') {
    const scannedPages = await safeDirectoryEntries(pageDir, canonicalDir, relativeFromRoot(root, pageDir));
    const entries = scannedPages.entries;
    if (scannedPages.incomplete) {
      pageReadIncomplete = true;
      parseIssues.push(violation('canonical-pages-scan-error', relativeFromRoot(root, pageDir), 'canonical pages directory could not be read', true));
    }
    entries.sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
      const parsedName = pageFileInfo(entry.name);
      if (!parsedName) continue;
      const absolute = path.join(pageDir, entry.name);
      const targetPath = relativeFromRoot(root, absolute);
      if (entry.isSymbolicLink()) {
        const issue = violation('page-payload-symlink', targetPath, 'page payload symlink is not followed', true);
        parseIssues.push(issue);
        pageFiles.push({ ...parsedName, path: targetPath, valid: false, issue });
        continue;
      }
      if (!entry.isFile()) continue;
      try {
        const inspected = await safeRegularFile(absolute, canonicalDir, { read: true });
        if (!inspected.ok) throw new Error('unsafe-read');
        const bytes = inspected.bytes;
        const manifestPath = slash(path.relative(canonicalDir, absolute));
        const manifestFile = canonicalTree.files.find((file) => file.path === manifestPath);
        if (!manifestFile || manifestFile.sha256 !== inspected.sha256) throw new Error('snapshot-mismatch');
        const parsed = parseJsonSafely(bytes.toString('utf8'), 'page', targetPath);
        const issue = parsed.ok ? validatePagePayload(parsed.value, targetPath) : parsed.issue;
        if (issue) parseIssues.push(issue);
        pageFiles.push({ ...parsedName, path: targetPath, bytes: bytes.byteLength, sha256: sha256(bytes), valid: !issue, issue: issue ?? null });
      } catch {
        pageReadIncomplete = true;
        const issue = violation('page-payload-read-error', targetPath, 'canonical page payload could not be read', true);
        parseIssues.push(issue);
        pageFiles.push({ ...parsedName, path: targetPath, valid: false, issue });
      }
    }
  }

  if (options.afterCanonicalManifest) await options.afterCanonicalManifest();
  const verificationTree = await walkTree(canonicalDir, { hashFiles: true });
  const isCore = (file) => file.path === 'site.json' || /^pages\/.*\.(draft|published)\.json$/.test(file.path);
  const firstCore = canonicalTree.files.filter(isCore);
  const finalCore = verificationTree.files.filter(isCore);
  const snapshotChanged = verificationTree.incomplete || JSON.stringify(firstCore) !== JSON.stringify(finalCore);
  if (snapshotChanged) {
    pageReadIncomplete = true;
    parseIssues.push(violation('canonical-snapshot-mismatch', relativeFromRoot(root, canonicalDir), 'canonical site or page payload set changed during inventory', true));
    canonicalTree.incomplete = true;
    canonicalTree.manifestSha256 = null;
    canonicalTree.errors.push(...verificationTree.errors);
  }

  if (pageReadIncomplete) siteUsable = false;

  const refs = siteUsable ? referencedPageIds(pages) : new Set();
  const pageFileIds = new Set(pageFiles.map((file) => file.pageId));
  const draftIds = new Set(pageFiles.filter((file) => file.state === 'draft').map((file) => file.pageId));
  const publishedIds = new Set(pageFiles.filter((file) => file.state === 'published').map((file) => file.pageId));
  const missing = siteUsable ? sortStrings([...refs].filter((id) => !pageFileIds.has(id))) : null;
  const missingDraft = siteUsable ? sortStrings([...refs].filter((id) => !draftIds.has(id))) : null;
  const missingPublished = siteUsable ? sortStrings([...refs].filter((id) => !publishedIds.has(id))) : null;
  const orphan = siteUsable ? pageFiles.filter((file) => !refs.has(file.pageId)).map((file) => file.path).sort() : null;
  const localeAudit = siteUsable ? localeViolations(site, pages) : {
    expectedLocales: { source: 'unavailable because canonical site metadata is unusable', values: [] },
    expectedHomeLocales: { source: 'unavailable because canonical site metadata is unusable', values: [] },
    duplicateSlugs: [], duplicateHomes: [], emptySlugHomes: [], missingHomes: [],
  };
  const candidates = [{
    path: siteRelative,
    classification: siteUsable ? CLASSIFICATIONS.KEEP : CLASSIFICATIONS.REVIEW,
    reason: siteUsable ? 'canonical site metadata' : 'canonical site metadata is invalid or unavailable',
    manualApprovalRequired: !siteUsable,
  }, ...pageFiles.map((file) => pageCandidate(file.path, file.pageId, file.state, siteUsable, refs.has(file.pageId), file.valid))];

  return {
    tree: canonicalTree, site, siteBytes, siteUsable, pages, pageFiles, refs,
    missing, missingDraft, missingPublished, orphan, localeAudit, candidates, parseIssues,
  };
}

function isSafeSegment(value) {
  return typeof value === 'string' && value.length > 0 && value !== '.' && value !== '..'
    && path.basename(value) === value && !value.includes('/') && !value.includes('\\');
}

function safeSiteSummary(site, usable) {
  if (!site || typeof site !== 'object' || Array.isArray(site)) {
    return { siteId: null, name: null, locale: null, pageMetadataCount: null, usable };
  }
  return {
    siteId: typeof site.siteId === 'string' ? site.siteId : null,
    name: typeof site.name === 'string' ? site.name : null,
    locale: typeof site.locale === 'string' ? site.locale : null,
    pageMetadataCount: Array.isArray(site.pages) ? site.pages.length : null,
    navigationCount: Array.isArray(site.navigation) ? site.navigation.length : 0,
    usable,
  };
}

export function parseArgs(argv) {
  const options = { root: DEFAULT_ROOT, dryRun: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--dry-run') options.dryRun = true;
    else if (arg === '--output' || arg.startsWith('--output=')) {
      throw new Error('--output is unsupported; redirect stdout to a file outside runtime-data');
    } else if (arg === '--root') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) throw new Error(`${arg} requires a path`);
      options.root = path.resolve(value);
      index += 1;
    } else if (arg.startsWith('--root=')) options.root = path.resolve(arg.slice(7));
    else throw new Error(`unknown argument: ${arg}`);
  }
  return options;
}

export async function inventoryRuntimeData(rootInput = DEFAULT_ROOT, options = {}) {
  const root = path.resolve(rootInput);
  if (await pathType(root) === 'symlink') throw new Error('refusing symlink runtime-data root');
  const rootPhysical = await realpath(root);
  const canonicalSiteId = options.canonicalSiteId ?? CANONICAL_SITE_ID;
  if (!isSafeSegment(canonicalSiteId)) throw new Error('canonicalSiteId must be one safe path segment');
  const builderSiteRoot = path.join(root, 'builder-site');
  const canonicalDir = path.join(builderSiteRoot, canonicalSiteId);
  const sitePath = path.join(canonicalDir, 'site.json');
  const structuralViolations = [];
  const unavailableCanonical = (reason) => ({
    tree: { fileCount: 0, byteCount: 0, files: [], symlinks: [], errors: [], incomplete: true, manifestSha256: null },
    site: null, siteBytes: null, siteUsable: false, pages: [], pageFiles: [], refs: new Set(),
    missing: null, missingDraft: null, missingPublished: null, orphan: null,
    localeAudit: { expectedLocales: { source: reason, values: [] }, expectedHomeLocales: { source: reason, values: [] }, duplicateSlugs: [], duplicateHomes: [], emptySlugHomes: [], missingHomes: [] },
    candidates: [{ path: relativeFromRoot(root, sitePath), classification: CLASSIFICATIONS.REVIEW, reason: 'canonical site path is unsafe or unavailable', manualApprovalRequired: true }],
    parseIssues: [],
  });

  for (const [label, target] of [['builder-site', builderSiteRoot], ['canonical-site', canonicalDir]]) {
    const type = await pathType(target);
    if (type === 'symlink') structuralViolations.push(violation(`${label}-symlink`, relativeFromRoot(root, target), `${label} symlink is not followed`, true));
    else if (type !== 'directory') structuralViolations.push(violation(`${label}-unavailable`, relativeFromRoot(root, target), `${label} is missing or not a directory`, true));
  }

  let canonical;
  if (structuralViolations.some((item) => item.blocking)) {
    canonical = unavailableCanonical('unavailable because canonical site path is unsafe');
  } else {
    const canonicalPhysical = await realpath(canonicalDir);
    if (!pathIsInside(canonicalPhysical, rootPhysical)) {
      structuralViolations.push(violation('canonical-path-escape', relativeFromRoot(root, canonicalDir), 'canonical site resolves outside runtime-data', true));
      canonical = unavailableCanonical('unavailable because canonical site resolves outside runtime-data');
    } else {
      canonical = await inspectCanonical(root, canonicalDir, sitePath, canonicalSiteId, structuralViolations, options);
    }
  }

  const totalTree = await walkTree(root);
  for (const error of totalTree.errors) {
    structuralViolations.push({ ...error, type: 'runtime-tree-scan-error', blocking: true });
  }
  const siblings = await immediateDirectories(builderSiteRoot, root, 'builder-site');
  for (const error of siblings.errors) structuralViolations.push({ ...error, type: 'builder-site-directory-scan-error', blocking: true });
  const siblingCandidates = siblings.directories.filter((name) => name !== canonicalSiteId).map((siteId) => ({
    siteId, path: slash(path.join('builder-site', siteId)), ...candidateForSite(siteId),
  }));
  for (const siteId of siblings.symlinks) {
    siblingCandidates.push({ siteId, path: slash(path.join('builder-site', siteId)), classification: CLASSIFICATIONS.REVIEW, reason: 'noncanonical builder-site symlink is not followed', manualApprovalRequired: true });
  }
  siblingCandidates.sort((a, b) => a.path.localeCompare(b.path));

  const revisionsRoot = path.join(root, 'builder-revisions');
  const revisionTree = await walkTree(revisionsRoot, { hashFiles: true });
  for (const error of revisionTree.errors) {
    structuralViolations.push({ ...error, type: 'revisions-tree-scan-error', path: slash(path.join('builder-revisions', error.path === '.' ? '' : error.path)), blocking: true });
  }
  const revisionDirectories = await immediateDirectories(revisionsRoot, root, 'builder-revisions', { allowMissing: true });
  for (const error of revisionDirectories.errors) structuralViolations.push({ ...error, type: 'revisions-directory-scan-error', blocking: true });
  const parseViolations = [...canonical.parseIssues];
  const duplicateViolations = [
    ...canonical.localeAudit.duplicateSlugs.map((pages) => ({ type: 'duplicate-slug', pages, blocking: false })),
    ...canonical.localeAudit.duplicateHomes.map((pages) => ({ type: 'duplicate-home', pages, blocking: false })),
    ...canonical.localeAudit.emptySlugHomes.map((pages) => ({ type: 'duplicate-home-slug', pages, blocking: false })),
    ...canonical.localeAudit.missingHomes.map((item) => ({ type: 'missing-home', ...item, blocking: false })),
    ...(canonical.missingDraft ?? []).map((pageId) => ({ type: 'missing-draft-page-payload', pageId, path: slash(path.join('builder-site', canonicalSiteId, 'pages', `${pageId}.draft.json`)), reason: 'active page is missing a draft payload', blocking: true })),
    ...(canonical.missingPublished ?? []).map((pageId) => ({ type: 'missing-published-page-payload', pageId, path: slash(path.join('builder-site', canonicalSiteId, 'pages', `${pageId}.published.json`)), reason: 'page has no published payload; unpublished state may be intentional', blocking: false })),
  ];
  const violations = [...structuralViolations, ...parseViolations, ...duplicateViolations];
  const candidates = [...canonical.candidates, ...siblingCandidates].sort((a, b) => a.path.localeCompare(b.path));
  const siteSummary = safeSiteSummary(canonical.site, canonical.siteUsable);
  const draftCount = canonical.pageFiles.filter((file) => file.state === 'draft').length;
  const publishedCount = canonical.pageFiles.filter((file) => file.state === 'published').length;

  return {
    schemaVersion: 2,
    generatedAt: new Date().toISOString(),
    dryRun: options.dryRun !== false,
    root,
    rootPhysical,
    canonicalSiteId,
    canonicalSite: siteSummary,
    canonicalSiteSummary: siteSummary,
    files: {
      count: totalTree.fileCount, bytes: totalTree.byteCount, total: totalTree.fileCount, totalBytes: totalTree.byteCount,
      canonicalSite: { count: canonical.tree.fileCount, bytes: canonical.tree.byteCount },
      incomplete: totalTree.incomplete,
      errors: totalTree.errors,
    },
    fileCount: totalTree.fileCount,
    byteCount: totalTree.byteCount,
    canonicalSiteJson: { path: relativeFromRoot(root, sitePath), bytes: canonical.siteBytes?.byteLength ?? null },
    draftPublishedCounts: { draft: draftCount, published: publishedCount },
    pageIdsReferencedBySiteMetadata: canonical.siteUsable ? sortStrings(canonical.refs) : null,
    canonicalPageFileIds: sortStrings(new Set(canonical.pageFiles.map((file) => file.pageId))),
    pagePayloads: {
      analysisStatus: canonical.siteUsable ? 'complete' : 'unknown',
      conclusionsSuppressed: !canonical.siteUsable,
      missingReferenced: canonical.missing,
      missingDraft: canonical.missingDraft,
      missingPublished: canonical.missingPublished,
      orphan: canonical.orphan,
      invalid: canonical.pageFiles.filter((file) => !file.valid).map((file) => ({ path: file.path, type: file.issue?.type ?? 'page-payload-invalid', reason: file.issue?.reason ?? 'canonical page payload is invalid' })),
    },
    missingReferencedPagePayloads: canonical.missing,
    orphanPagePayloads: canonical.orphan,
    expectedLocales: canonical.localeAudit.expectedLocales,
    expectedHomeLocales: canonical.localeAudit.expectedHomeLocales,
    violations,
    blockingViolations: violations.filter((item) => item.blocking),
    sameLocaleDuplicateSlugViolations: canonical.localeAudit.duplicateSlugs,
    sameLocaleHomeViolations: [...canonical.localeAudit.duplicateHomes, ...canonical.localeAudit.emptySlugHomes],
    missingExpectedLocaleHomeViolations: canonical.localeAudit.missingHomes,
    noncanonicalBuilderSiteSiblings: siblingCandidates,
    builderRevisions: {
      directoryCount: revisionDirectories.directories.length,
      totalDirectoryCount: revisionTree.directoryCount,
      fileCount: revisionTree.fileCount,
      bytes: revisionTree.byteCount,
      manifest: revisionTree.files,
      manifestSha256: revisionTree.manifestSha256,
      incomplete: revisionTree.incomplete,
      errors: revisionTree.errors,
      symlinks: revisionTree.symlinks,
    },
    builderRevisionsDirectoryCount: revisionDirectories.directories.length,
    canonicalManifest: canonical.tree.files,
    canonicalManifestIncomplete: canonical.tree.incomplete,
    checksums: {
      canonicalSiteJsonSha256: canonical.siteBytes ? sha256(canonical.siteBytes) : null,
      canonicalManifestSha256: canonical.tree.manifestSha256,
      canonicalSiteJson: canonical.siteBytes ? sha256(canonical.siteBytes) : null,
      canonicalManifestDigest: canonical.tree.manifestSha256,
      builderRevisionsManifestSha256: revisionTree.manifestSha256,
    },
    canonicalManifestDigest: canonical.tree.manifestSha256,
    candidates,
    policy: {
      classifications: Object.values(CLASSIFICATIONS),
      destructiveActionsTaken: false,
      manualApprovalRequiredForQuarantineCandidates: true,
      contentReadScope: 'JSON content parsed only beneath physical runtime-data/builder-site; regular-file bytes elsewhere used only for size and SHA-256 manifests',
      symlinksFollowed: false,
      reportDestination: 'stdout-only; redirect stdout externally to persist a report',
      filesystemWritesSupported: false,
    },
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const report = await inventoryRuntimeData(options.root, { dryRun: options.dryRun });
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    process.stderr.write(`runtime-data-inventory: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
