#!/usr/bin/env node
/**
 * pull-prod-builder-data.mjs — READ-ONLY production blob mirror.
 *
 * Mirrors the production Vercel Blob content stores that the PUBLIC site
 * renders from into a local directory, so a dev server can serve the real
 * site content off the file backend without hitting production Blob.
 *
 * Mirrored stores (one blob prefix each → <mirrorRoot>/<prefix>/...). The
 * on-disk layout under each prefix matches the corresponding file-backend
 * root in src (runtime-data/<prefix>/...), so pointing the matching env
 * var at the mirror dir makes dev read the mirrored content:
 *
 *   builder-site/            → site/pages/lightboxes/global header+footer
 *                              (env: BUILDER_SITE_ROOT)
 *                              key scheme mirrors src/lib/builder/site/persistence.ts
 *                              (BLOB_PREFIX = 'builder-site'):
 *                                builder-site/<siteId>/site.json
 *                                builder-site/<siteId>/pages/<pageId>.draft.json
 *                                builder-site/<siteId>/pages/<pageId>.published.json
 *                                builder-site/<siteId>/lightboxes/<lightboxId>.json
 *                                builder-site/<siteId>/global/header.json | footer.json
 *
 *   consultation-columns/    → lawyer-authored legal column posts
 *                              (env: CONSULTATION_COLUMNS_DIR)
 *                              key scheme mirrors src/lib/builder/columns/storage.ts
 *                              (COLUMN_BLOB_PREFIX = 'consultation-columns'):
 *                                consultation-columns/<locale>/<slug>.published.json
 *                                consultation-columns/<locale>/<slug>.json (draft)
 *
 *   search/                  → site search index (site-index.json).
 *                              (file backend root: runtime-data/search — no env
 *                              override; the index is the public-relevant file.)
 *                              Query logs under search/queries/ are admin
 *                              analytics, NOT rendered by public pages, so they
 *                              are deliberately skipped. Mirrors
 *                              src/lib/builder/search/index-storage.ts.
 *
 *   builder-faq/             → native FAQ app items
 *                              (env: BUILDER_FAQ_ROOT)
 *                              key scheme mirrors src/lib/builder/faq/faq-engine.ts
 *                              (FAQ_PREFIX = 'builder-faq/items/'):
 *                                builder-faq/items/<faqId>.json
 *
 *   consultation-embeddings/ → semantic column-embedding snapshot
 *                              (consultation-embeddings/column-embeddings.json).
 *                              NOTE: the file backend for embeddings reads the
 *                              committed seed at src/content/column-embeddings.json,
 *                              NOT runtime-data; this mirror is a faithful prod
 *                              snapshot (the consultation chat reads it via Blob in
 *                              prod). Mirrors src/lib/consultation/embeddings-store.ts.
 *
 * READ-ONLY CONTRACT: this script imports ONLY `list` and `get` from
 * @vercel/blob. It must NEVER import or call `put`, `del`, or `copy`.
 *
 * SECURITY: BLOB_READ_WRITE_TOKEN is read from .env.local (manually parsed)
 * and set on process.env. The token value is never printed/logged; any error
 * string is scrubbed of the token before display.
 *
 * Idempotent: re-running overwrites each mirrored file in place. Stale local
 * files whose source blob was deleted in production are NOT removed (safe
 * default; pass --purge to wipe the mirror root first).
 *
 * Usage:
 *   node scripts/pull-prod-builder-data.mjs [--env=.env.local] \
 *     [--out=runtime-data-prod-mirror] [--limit=1000] [--purge]
 *
 * Single-store override (legacy): pass --prefix=<prefix> to mirror just one
 * store. With both --prefix and --out it mirrors that prefix straight into the
 * given directory (pathnames stripped of the prefix); with --prefix only it
 * lands under <out>/<prefix>/...
 */

// Intentionally limited to read-only blob APIs.
import { list, get } from '@vercel/blob';
import { spawn } from 'node:child_process';
import { constants as fsConstants } from 'node:fs';
import { createHash, randomUUID } from 'node:crypto';
import { lstat, open, readFile, readdir, realpath, rename, rmdir } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import {
  atomicWriteLocalJson,
  withLocalJsonWriteLease,
} from '../src/lib/builder/storage/local-json-write-lease.mjs';

const PLACEHOLDER = '<redacted>';
const DEFAULT_PREFIX = 'builder-site';
const DEFAULT_ENV = '.env.local';
const DEFAULT_OUT = 'runtime-data-prod-mirror';
const SCRIPT_PATH = fileURLToPath(import.meta.url);
const REPO_ROOT = path.resolve(path.dirname(SCRIPT_PATH), '..');
const REPO_RUNTIME_DATA_ROOT = path.join(REPO_ROOT, 'runtime-data');
const PATH_SAFETY_ERROR = 'Unsafe mirror path: target must stay physically contained without symlink parents.';
const CANONICAL_OVERLAP_ERROR = 'Mirror root overlaps an active content or canonical runtime-data root.';
const MIRROR_MARKER_NAME = 'pull-prod-builder-data-mirror.owner.json';
const LEGACY_MIRROR_MARKER_NAME = '.pull-prod-builder-data-mirror.json';
const MIRROR_MARKER_KIND = 'pull-prod-builder-data-mirror';
const RESERVED_MIRROR_SEGMENTS = new Set([
  MIRROR_MARKER_NAME,
  LEGACY_MIRROR_MARKER_NAME,
  '.local-json-write-leases',
]);
const BOUND_PURGE_SOURCE = String.raw`
const fs = require('node:fs');
const expectedRoot = JSON.parse(fs.readFileSync(0, 'utf8'));
const sameObject = (stats, expected) => String(stats.dev) === expected.dev && String(stats.ino) === expected.ino;
const assertCwd = (expected) => {
  const stats = fs.lstatSync('.', { bigint: true });
  if (stats.isSymbolicLink() || !stats.isDirectory() || !sameObject(stats, expected)) {
    throw new Error('bound purge directory changed');
  }
};
const cleanBoundDirectory = (expected) => {
  assertCwd(expected);
  for (const name of fs.readdirSync('.')) {
    const stats = fs.lstatSync(name, { bigint: true });
    if (stats.isSymbolicLink() || stats.isFile()) {
      fs.unlinkSync(name);
      continue;
    }
    if (!stats.isDirectory()) throw new Error('unsupported mirror entry');
    const child = { dev: String(stats.dev), ino: String(stats.ino) };
    process.chdir(name);
    assertCwd(child);
    cleanBoundDirectory(child);
    process.chdir('..');
    assertCwd(expected);
    const after = fs.lstatSync(name, { bigint: true });
    if (after.isSymbolicLink() || !after.isDirectory() || !sameObject(after, child)) {
      throw new Error('bound purge child changed');
    }
    fs.rmdirSync(name);
  }
  assertCwd(expected);
};
cleanBoundDirectory(expectedRoot);
`;
const BOUND_MKDIR_SOURCE = String.raw`
const fs = require('node:fs');
const payload = JSON.parse(fs.readFileSync(0, 'utf8'));
const sameObject = (stats, expected) => String(stats.dev) === expected.dev && String(stats.ino) === expected.ino;
const assertCwd = (expected) => {
  const stats = fs.lstatSync('.', { bigint: true });
  if (stats.isSymbolicLink() || !stats.isDirectory() || !sameObject(stats, expected)) {
    throw new Error('bound mkdir directory changed');
  }
};
let expected = payload.rootIdentity;
assertCwd(expected);
for (const segment of payload.segments) {
  if (!/^[^/\\\0]+$/.test(segment) || segment === '.' || segment === '..') {
    throw new Error('unsafe directory segment');
  }
  try { fs.mkdirSync(segment, { mode: 0o700 }); }
  catch (error) { if (error?.code !== 'EEXIST') throw error; }
  const child = fs.lstatSync(segment, { bigint: true });
  if (child.isSymbolicLink() || !child.isDirectory()) throw new Error('unsafe directory');
  expected = { dev: String(child.dev), ino: String(child.ino) };
  process.chdir(segment);
  assertCwd(expected);
}
`;

// ─── Mirror plan ────────────────────────────────────────────────────
//
// Every public-facing content store the live site renders from. Each entry
// mirrors one blob prefix into <mirrorRoot>/<prefix>/..., reproducing the
// file-backend layout so a dev server pointed at the mirror serves real
// content. Add a new public content store here when one ships.

/**
 * Classify a builder-site blob by its path relative to the 'builder-site'
 * prefix. Only used to enrich the builder-site summary; other stores use a
 * plain file count.
 */
function classifyBuilderSiteBlob(relPath) {
  const parts = relPath.split('/');
  // parts[0] = siteId, then kind by next segment + filename.
  if (parts.length === 2 && parts[1] === 'site.json') return 'site';
  if (parts.length === 3 && parts[1] === 'pages' && parts[2].endsWith('.draft.json')) return 'page-draft';
  if (parts.length === 3 && parts[1] === 'pages' && parts[2].endsWith('.published.json')) return 'page-published';
  if (parts.length === 3 && parts[1] === 'lightboxes' && parts[2].endsWith('.json')) return 'lightbox';
  if (parts.length === 3 && parts[1] === 'global' && (parts[2] === 'header.json' || parts[2] === 'footer.json')) {
    return 'global';
  }
  return 'other';
}

const MIRROR_TARGETS = [
  {
    label: 'Builder site (pages/lightboxes/global header+footer)',
    prefix: 'builder-site',
    classify: classifyBuilderSiteBlob,
  },
  {
    label: 'Consultation columns (lawyer-authored legal column posts)',
    prefix: 'consultation-columns',
  },
  {
    label: 'Search index (site-index.json; query logs excluded)',
    prefix: 'search',
    // Public pages only read search/site-index.json (loadSearchIndex). The
    // search/queries/* tree is admin analytics — skip it to keep the pull
    // fast and focused on rendered content.
    filter: (relPath) => !relPath.startsWith('queries/'),
  },
  {
    label: 'Builder FAQ items',
    prefix: 'builder-faq',
  },
  {
    label: 'Consultation column embeddings (semantic-search snapshot)',
    prefix: 'consultation-embeddings',
  },
];

// ─── CLI args ───────────────────────────────────────────────────────

function parseArgs(argv) {
  const out = {
    envPath: DEFAULT_ENV,
    outDir: DEFAULT_OUT,
    prefix: DEFAULT_PREFIX,
    limit: 1000,
    purge: false,
    help: false,
  };
  for (const arg of argv) {
    if (arg === '--help' || arg === '-h') {
      out.help = true;
    } else if (arg === '--purge') {
      out.purge = true;
    } else if (arg.startsWith('--env=')) {
      out.envPath = arg.slice('--env='.length);
    } else if (arg.startsWith('--out=')) {
      out.outDir = arg.slice('--out='.length);
    } else if (arg.startsWith('--prefix=')) {
      out.prefix = arg.slice('--prefix='.length);
    } else if (arg.startsWith('--limit=')) {
      const n = Number(arg.slice('--limit='.length));
      if (Number.isFinite(n) && n > 0) out.limit = Math.floor(n);
    } else {
      throw new Error(`Unknown argument: ${arg} (see --help)`);
    }
  }
  return out;
}

const HELP = `Usage: node scripts/pull-prod-builder-data.mjs [options]

READ-ONLY mirror of the production Vercel Blob content stores the public site
renders from, into a local directory. Mirrors builder-site, consultation-columns,
search (index only), builder-faq, and consultation-embeddings. Never prints
BLOB_READ_WRITE_TOKEN.

Options:
  --env=<path>      .env file to read BLOB_READ_WRITE_TOKEN from (default: .env.local)
  --out=<dir>       mirror root directory (default: runtime-data-prod-mirror);
                    each store lands at <dir>/<prefix>/...
  --prefix=<p>      mirror only this one blob prefix (single-store mode). With
                    --out, mirrors straight into <dir>; otherwise into <dir>/<prefix>/
  --limit=<n>       page size for list() per store (default: 1000)
  --purge           wipe the mirror root before mirroring (default: off — overwrite only)
  -h, --help        show this help

Serve the mirror locally with:
  BUILDER_SITE_ROOT=<abs>/runtime-data-prod-mirror/builder-site \\
  CONSULTATION_COLUMNS_DIR=<abs>/runtime-data-prod-mirror/consultation-columns \\
  BUILDER_FAQ_ROOT=<abs>/runtime-data-prod-mirror/builder-faq \\
  npm run dev
`;

// ─── .env.local parser (manual; dotenv not a dependency) ────────────

function parseEnvFile(text) {
  const env = {};
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    const raw = lines[i];
    const trimmed = raw.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('#')) continue;
    // Optional leading `export `.
    let line = trimmed;
    if (line.startsWith('export ') || line.startsWith('export\t')) {
      line = line.slice('export'.length).trimStart();
    }
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    if (!key) continue;
    let value = line.slice(eq + 1).trim();
    // Strip a single trailing inline comment that is clearly separated by
    // whitespace (only when value is NOT fully quoted).
    if (value.length >= 2 && (value[0] === '"' || value[0] === "'")) {
      const quote = value[0];
      // Find the matching closing quote (allow escaped quotes for ").
      let end = -1;
      for (let j = 1; j < value.length; j += 1) {
        if (quote === '"' && value[j] === '\\' && j + 1 < value.length) {
          j += 1;
          continue;
        }
        if (value[j] === quote) {
          end = j;
          break;
        }
      }
      if (end !== -1) {
        const inner = value.slice(1, end);
        env[key] = quote === '"' ? inner.replace(/\\"/g, '"').replace(/\\n/g, '\n') : inner;
        continue;
      }
    }
    // Unquoted: drop an optional trailing comment.
    const hash = value.search(/\s+#/);
    if (hash !== -1) value = value.slice(0, hash).trim();
    env[key] = value;
  }
  return env;
}

async function loadTokenFromEnvFile(envPath) {
  let text;
  try {
    text = await readFile(envPath, 'utf8');
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      throw new Error(
        `Could not find env file at ${envPath}. Pass --env=<path> to point at a file containing BLOB_READ_WRITE_TOKEN.`,
      );
    }
    throw error;
  }
  const env = parseEnvFile(text);
  const token = env.BLOB_READ_WRITE_TOKEN;
  if (!token || typeof token !== 'string') {
    throw new Error(`BLOB_READ_WRITE_TOKEN is not defined in ${envPath}.`);
  }
  return token;
}

// ─── helpers ────────────────────────────────────────────────────────

/** Replace any occurrence of `secret` in a string with a placeholder. */
function scrub(value, secret) {
  if (!secret) return value;
  if (typeof value !== 'string') return value;
  return value.split(secret).join(PLACEHOLDER);
}

function isPathWithinOrEqual(parentPath, childPath) {
  const relative = path.relative(parentPath, childPath);
  return relative === '' || (relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative));
}

function pathsOverlap(leftPath, rightPath) {
  return isPathWithinOrEqual(leftPath, rightPath) || isPathWithinOrEqual(rightPath, leftPath);
}

async function lstatIfExists(targetPath) {
  try {
    return await lstat(targetPath);
  } catch (error) {
    if (error?.code === 'ENOENT') return null;
    throw error;
  }
}

async function resolvePhysicalCandidate(targetPath) {
  const absolute = path.resolve(targetPath);
  let current = absolute;
  const missingSegments = [];
  for (;;) {
    const stats = await lstatIfExists(current);
    if (stats) {
      const physical = await realpath(current);
      return path.resolve(physical, ...missingSegments.reverse());
    }
    const parent = path.dirname(current);
    if (parent === current) throw new Error(PATH_SAFETY_ERROR);
    missingSegments.push(path.basename(current));
    current = parent;
  }
}

async function assertExistingComponentsHaveNoSymlinks(targetPath) {
  const absolute = path.resolve(targetPath);
  const parsed = path.parse(absolute);
  const components = absolute.slice(parsed.root.length).split(path.sep).filter(Boolean);
  let current = parsed.root;
  for (let index = 0; index < components.length; index += 1) {
    current = path.join(current, components[index]);
    const stats = await lstatIfExists(current);
    if (!stats) break;
    if (stats.isSymbolicLink()) throw new Error(PATH_SAFETY_ERROR);
    if (index < components.length - 1 && !stats.isDirectory()) throw new Error(PATH_SAFETY_ERROR);
  }
}

function safeBlobRelativePath(pathname, prefix) {
  if (typeof pathname !== 'string' || !pathname.startsWith(`${prefix}/`)) {
    throw new Error(`Unsafe blob pathname for prefix "${prefix}".`);
  }
  const relative = pathname.slice(prefix.length + 1);
  const segments = relative.split('/');
  const isReservedSegment = (segment) => {
    const folded = segment.normalize('NFC').toLocaleLowerCase('en-US');
    return RESERVED_MIRROR_SEGMENTS.has(folded) ||
      /^\..+\.writer\.(?:lock|reclaim)$/.test(folded) ||
      /^\..+\.txn-[^.]+\.(?:manifest|candidate|previous|detached)$/.test(folded) ||
      /^\..+\.tmp$/.test(folded);
  };
  if (
    !relative || path.isAbsolute(relative) ||
    segments.some((segment) => !segment || segment === '.' || segment === '..' || isReservedSegment(segment))
  ) {
    throw new Error(`Unsafe blob pathname for prefix "${prefix}".`);
  }
  for (const segment of segments) {
    let decoded;
    try {
      decoded = decodeURIComponent(segment);
    } catch {
      throw new Error(`Unsafe blob pathname for prefix "${prefix}".`);
    }
    if (
      segment.includes('\\') || segment.includes('\0') || decoded === '.' || decoded === '..' ||
      decoded.includes('/') || decoded.includes('\\') || decoded.includes('\0')
    ) {
      throw new Error(`Unsafe blob pathname for prefix "${prefix}".`);
    }
  }
  return segments.join(path.sep);
}

export function resolveMirrorTargetPath(outDir, pathname, prefix) {
  const absoluteOutDir = path.resolve(outDir);
  const relative = safeBlobRelativePath(pathname, prefix);
  const targetPath = path.resolve(absoluteOutDir, relative);
  if (!isPathWithinOrEqual(absoluteOutDir, targetPath) || targetPath === absoluteOutDir) {
    throw new Error(`Unsafe blob pathname for prefix "${prefix}".`);
  }
  return targetPath;
}

function resolveCanonicalContentRoots(cwd, environment, repoRuntimeDataRoot) {
  const configuredBuilderRoot = environment.BUILDER_SITE_ROOT?.trim();
  const configuredColumnsRoot = environment.CONSULTATION_COLUMNS_DIR?.trim();
  const configuredFaqRoot = environment.BUILDER_FAQ_ROOT?.trim();
  return [
    path.resolve(cwd, 'runtime-data'),
    configuredBuilderRoot ? path.resolve(cwd, configuredBuilderRoot) : null,
    configuredColumnsRoot ? path.resolve(cwd, configuredColumnsRoot) : null,
    configuredFaqRoot ? path.resolve(cwd, configuredFaqRoot) : null,
    path.resolve(repoRuntimeDataRoot),
  ].filter(Boolean);
}

export async function assertMirrorRootIsIsolated(
  mirrorRoot,
  {
    cwd = process.cwd(),
    environment = process.env,
    repoRuntimeDataRoot = REPO_RUNTIME_DATA_ROOT,
  } = {},
) {
  const absoluteMirrorRoot = path.resolve(cwd, mirrorRoot);
  const canonicalRoots = resolveCanonicalContentRoots(cwd, environment, repoRuntimeDataRoot);

  await assertExistingComponentsHaveNoSymlinks(absoluteMirrorRoot);
  const physicalMirrorRoot = await resolvePhysicalCandidate(absoluteMirrorRoot);
  for (const canonicalRoot of canonicalRoots) {
    const physicalCanonicalRoot = await resolvePhysicalCandidate(canonicalRoot);
    if (
      pathsOverlap(absoluteMirrorRoot, canonicalRoot) ||
      pathsOverlap(physicalMirrorRoot, physicalCanonicalRoot)
    ) {
      throw new Error(CANONICAL_OVERLAP_ERROR);
    }
  }
  return absoluteMirrorRoot;
}

function sameObjectIdentity(left, right) {
  return left.dev === right.dev && left.ino === right.ino;
}

async function ensureBoundDirectory(rootPath, targetPath) {
  const root = path.resolve(rootPath);
  const target = path.resolve(targetPath);
  if (!isPathWithinOrEqual(root, target)) throw new Error(PATH_SAFETY_ERROR);
  await assertExistingComponentsHaveNoSymlinks(root);
  const rootStats = await lstatIfExists(root);
  if (!rootStats || rootStats.isSymbolicLink() || !rootStats.isDirectory()) {
    throw new Error('Mirror parent directory must already exist and be physical.');
  }
  const relative = path.relative(root, target);
  if (!relative) return realpath(root);
  const segments = relative.split(path.sep).filter(Boolean);

  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['-e', BOUND_MKDIR_SOURCE], {
      cwd: root,
      stdio: ['pipe', 'ignore', 'ignore'],
    });
    child.once('error', reject);
    child.once('exit', (code, signal) => {
      if (code === 0 && signal === null) resolve();
      else reject(new Error('Bound mirror directory creation failed closed.'));
    });
    child.stdin.end(JSON.stringify({
      rootIdentity: { dev: String(rootStats.dev), ino: String(rootStats.ino) },
      segments,
    }));
  });

  await assertExistingComponentsHaveNoSymlinks(target);
  const physicalRoot = await realpath(root);
  const physicalTarget = await realpath(target);
  if (!isPathWithinOrEqual(physicalRoot, physicalTarget)) throw new Error(PATH_SAFETY_ERROR);
  return physicalTarget;
}

async function ensureDirectoryFromNearestExistingAncestor(targetPath) {
  const target = path.resolve(targetPath);
  let ancestor = target;
  for (;;) {
    const stats = await lstatIfExists(ancestor);
    if (stats) {
      if (stats.isSymbolicLink() || !stats.isDirectory()) {
        throw new Error('Mirror output ancestor must be a physical directory.');
      }
      return ensureBoundDirectory(ancestor, target);
    }
    const parent = path.dirname(ancestor);
    if (parent === ancestor) throw new Error(PATH_SAFETY_ERROR);
    ancestor = parent;
  }
}

function mirrorRootLeaseTarget(mirrorRoot, leaseControlRoot) {
  const digest = createHash('sha256').update(mirrorRoot).digest('hex').slice(0, 24);
  return path.join(leaseControlRoot, `pull-prod-builder-data-${digest}.root-lease.json`);
}

function mirrorMarkerPayload(mirrorRoot) {
  return JSON.stringify({
    schemaVersion: 1,
    kind: MIRROR_MARKER_KIND,
    mirrorRoot,
  });
}

async function readOwnedMirrorMarker(mirrorRoot) {
  for (const markerName of [MIRROR_MARKER_NAME, LEGACY_MIRROR_MARKER_NAME]) {
    const markerPath = path.join(mirrorRoot, markerName);
    const markerStats = await lstatIfExists(markerPath);
    if (!markerStats) continue;
    if (markerStats.isSymbolicLink() || !markerStats.isFile()) throw new Error('Mirror ownership marker is unsafe.');

    let handle;
    try {
      handle = await open(markerPath, fsConstants.O_RDONLY | fsConstants.O_NOFOLLOW);
      const before = await handle.stat();
      if (!sameObjectIdentity(markerStats, before)) throw new Error('Mirror ownership marker changed.');
      const raw = await handle.readFile('utf8');
      const after = await handle.stat();
      if (!sameObjectIdentity(before, after) || before.size !== after.size || before.mtimeMs !== after.mtimeMs) {
        throw new Error('Mirror ownership marker changed.');
      }
      const parsed = JSON.parse(raw);
      if (
        parsed?.schemaVersion !== 1 || parsed?.kind !== MIRROR_MARKER_KIND ||
        parsed?.mirrorRoot !== mirrorRoot
      ) {
        throw new Error('Mirror ownership marker does not match this mirror root.');
      }
      return parsed;
    } catch (error) {
      if (error instanceof SyntaxError) throw new Error('Mirror ownership marker is invalid.');
      throw error;
    } finally {
      await handle?.close().catch(() => {});
    }
  }
  return null;
}

async function ensureOwnedMirrorMarker(mirrorRoot, allowedRoot, writeFileAtomic) {
  if (await readOwnedMirrorMarker(mirrorRoot)) return;
  const existingEntries = await readdir(mirrorRoot);
  if (existingEntries.length > 0) {
    throw new Error('Refusing to claim a nonempty directory that is not already an owned production mirror.');
  }
  const markerPath = path.join(mirrorRoot, MIRROR_MARKER_NAME);
  await writeFileAtomic(markerPath, mirrorMarkerPayload(mirrorRoot), {
    allowedRoot,
    expectedGeneration: null,
  });
  if (!await readOwnedMirrorMarker(mirrorRoot)) throw new Error('Mirror ownership marker was not installed.');
}

async function writeWithLocalJsonLease(targetPath, data, options) {
  return withLocalJsonWriteLease(targetPath, options, async (lease) => {
    let expectedGeneration = options.expectedGeneration;
    if (!Object.prototype.hasOwnProperty.call(options, 'expectedGeneration')) {
      const snapshot = await lease.read();
      expectedGeneration = snapshot.kind === 'missing' ? null : snapshot.generation;
    }
    return atomicWriteLocalJson(lease, data, { expectedGeneration });
  });
}

async function restoreQuarantinedRoot(quarantinePath, mirrorRoot, expectedIdentity) {
  const current = await lstatIfExists(quarantinePath);
  if (
    !current || current.isSymbolicLink() || !current.isDirectory() ||
    !sameObjectIdentity(current, expectedIdentity)
  ) {
    throw new Error('Quarantined mirror data changed and was preserved.');
  }
  if (await lstatIfExists(mirrorRoot)) {
    throw new Error('Purge aborted because the mirror namespace changed; quarantined data was preserved.');
  }
  await rename(quarantinePath, mirrorRoot);
  const restored = await lstatIfExists(mirrorRoot);
  if (!restored || !sameObjectIdentity(restored, expectedIdentity)) {
    throw new Error('Quarantined mirror data could not be safely restored.');
  }
}

async function emptyBoundMirrorDirectory(quarantinePath, expectedIdentity) {
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['-e', BOUND_PURGE_SOURCE], {
      cwd: quarantinePath,
      stdio: ['pipe', 'ignore', 'ignore'],
    });
    child.once('error', reject);
    child.once('exit', (code, signal) => {
      if (code === 0 && signal === null) resolve();
      else reject(new Error('Bound mirror purge failed closed.'));
    });
    child.stdin.end(JSON.stringify({
      dev: String(expectedIdentity.dev),
      ino: String(expectedIdentity.ino),
    }));
  });
}

async function purgeIsolatedMirrorRoot(mirrorRoot, safetyOptions, testHook) {
  const before = await lstatIfExists(mirrorRoot);
  if (!before) return;
  if (before.isSymbolicLink() || !before.isDirectory()) throw new Error(PATH_SAFETY_ERROR);
  if (!await readOwnedMirrorMarker(mirrorRoot)) {
    throw new Error('Refusing --purge because this directory is not an owned production mirror.');
  }
  const protectedRoots = [];
  for (const root of resolveCanonicalContentRoots(
    safetyOptions.cwd,
    safetyOptions.environment,
    safetyOptions.repoRuntimeDataRoot,
  )) {
    const stats = await lstatIfExists(root);
    if (stats && !stats.isSymbolicLink() && stats.isDirectory()) protectedRoots.push({ root, stats });
  }

  const quarantinePath = path.join(
    path.dirname(mirrorRoot),
    `.${path.basename(mirrorRoot)}.purge-${process.pid}-${randomUUID()}`,
  );
  if (await lstatIfExists(quarantinePath)) throw new Error('Purge quarantine path already exists.');
  if (testHook) await testHook({ phase: 'before-purge-rename', mirrorRoot, quarantinePath });

  await rename(mirrorRoot, quarantinePath);
  const quarantined = await lstatIfExists(quarantinePath);
  if (!quarantined || quarantined.isSymbolicLink() || !quarantined.isDirectory() || !sameObjectIdentity(before, quarantined)) {
    if (quarantined) {
      const displacedProtectedRoot = protectedRoots.find(({ stats }) => sameObjectIdentity(stats, quarantined));
      await restoreQuarantinedRoot(
        quarantinePath,
        displacedProtectedRoot?.root ?? mirrorRoot,
        quarantined,
      );
    }
    throw new Error('Purge aborted because the mirror root changed during safety validation.');
  }

  try {
    await assertMirrorRootIsIsolated(quarantinePath, safetyOptions);
  } catch (error) {
    await restoreQuarantinedRoot(quarantinePath, mirrorRoot, quarantined);
    throw error;
  }
  await emptyBoundMirrorDirectory(quarantinePath, quarantined);
  const emptied = await lstatIfExists(quarantinePath);
  if (!emptied || emptied.isSymbolicLink() || !emptied.isDirectory() || !sameObjectIdentity(emptied, quarantined)) {
    throw new Error('Purged mirror root changed before final removal.');
  }
  await rmdir(quarantinePath);
}

async function streamToText(stream) {
  // @vercel/blob v2 private get() returns a web ReadableStream<Uint8Array>.
  const buf = await new Response(stream).arrayBuffer();
  return new TextDecoder('utf-8').decode(buf);
}

async function listAll(prefix, limit, provider) {
  const all = [];
  let cursor;
  let page = 0;
  for (;;) {
    page += 1;
    const result = await provider.list({ prefix, limit, cursor });
    if (Array.isArray(result?.blobs)) {
      for (const b of result.blobs) {
        if (b && typeof b.pathname === 'string') all.push(b);
      }
    }
    cursor = result?.cursor;
    if (!result?.hasMore) break;
    if (page > 1000) {
      throw new Error(`Aborted: list() returned >1000 pages for prefix "${prefix}" (unexpected).`);
    }
  }
  return all;
}

/**
 * Mirror one blob prefix into outDir. READ-ONLY: list + get only.
 *
 * @param {{ label: string, prefix: string, outDir: string, classify?: (rel: string) => string, filter?: (rel: string) => boolean }} target
 * @param {number}   limit  page size for list()
 * @param {string}   token  BLOB_READ_WRITE_TOKEN (for error scrubbing only)
 * @returns {Promise<{ label: string, prefix: string, listed: number, written: number, skipped: number, filtered: number, bytes: number, byKind: Record<string, number> | null, sample: Array<{ pathname: string, bytes: number, kind: string | null }> }>}
 */
async function mirrorStore(target, limit, token, { provider, stdout, stderr, writeFileAtomic }) {
  const { label, prefix, outDir, allowedRoot, classify, filter } = target;
  const safeLog = (value) => scrub(String(value), token);

  stdout.write(`\n[list] ${safeLog(label)}\n`);
  stdout.write(`  prefix : ${safeLog(prefix)}/  (Vercel Blob, list+get only — no put/del/copy)\n`);
  stdout.write(`  outDir : ${safeLog(outDir)}\n`);

  const blobs = await listAll(`${prefix}/`, limit, provider);
  if (blobs.length === 0) {
    stdout.write(`  -> no blobs found under "${safeLog(prefix)}/".\n`);
    return { label, prefix, listed: 0, written: 0, skipped: 0, filtered: 0, bytes: 0, byKind: null, sample: [] };
  }

  // De-dup by pathname (defensive; list never returns duplicates).
  const byPath = new Map();
  for (const b of blobs) {
    if (!byPath.has(b.pathname)) byPath.set(b.pathname, b);
  }
  const uniq = Array.from(byPath.values()).sort((left, right) => (
    Buffer.compare(Buffer.from(left.pathname), Buffer.from(right.pathname))
  ));
  stdout.write(`  -> ${uniq.length} unique blob(s)\n`);

  let written = 0;
  let skipped = 0;
  let filtered = 0;
  let totalBytes = 0;
  const byKind = classify
    ? { site: 0, 'page-draft': 0, 'page-published': 0, lightbox: 0, global: 0, other: 0 }
    : null;
  const sample = [];

  for (const blob of uniq) {
    const { pathname } = blob;
    const targetPath = resolveMirrorTargetPath(outDir, pathname, prefix);
    const relPath = path.relative(outDir, targetPath).split(path.sep).join('/');
    await assertExistingComponentsHaveNoSymlinks(targetPath);

    if (filter && !filter(relPath)) {
      filtered += 1;
      continue;
    }

    const kind = classify ? classify(relPath) : null;
    if (byKind && kind && Object.prototype.hasOwnProperty.call(byKind, kind)) {
      byKind[kind] += 1;
    }

    let result;
    try {
      result = await provider.get(pathname, { access: 'private', useCache: false });
    } catch (error) {
      const msg = scrub(error instanceof Error ? error.message : String(error), token);
      stderr.write(`  [get ERROR] ${safeLog(pathname)}: ${msg} — skipped\n`);
      skipped += 1;
      continue;
    }
    if (!result || result.statusCode !== 200 || !result.stream) {
      stderr.write(
        `  [get missing] ${safeLog(pathname)} ` +
          `(statusCode=${safeLog(result?.statusCode ?? 'n/a')}) — skipped\n`,
      );
      skipped += 1;
      continue;
    }

    const text = await streamToText(result.stream);
    await writeFileAtomic(targetPath, text, { allowedRoot });

    const bytes = Buffer.byteLength(text, 'utf8');
    totalBytes += bytes;
    written += 1;
    sample.push({ pathname, bytes, kind });
  }

  stdout.write(
    `  -> written=${written}` +
      `${skipped ? ` skipped=${skipped}` : ''}` +
      `${filtered ? ` filtered=${filtered}` : ''}` +
      ` bytes=${totalBytes}\n`,
  );
  if (byKind) {
    stdout.write(
      `  by kind: site=${byKind.site} ` +
        `page.draft=${byKind['page-draft']} ` +
        `page.published=${byKind['page-published']} ` +
        `lightbox=${byKind.lightbox} ` +
        `global=${byKind.global} ` +
        `other=${byKind.other}\n`,
    );
  }
  if (sample.length > 0) {
    stdout.write(`  sample pathnames:\n`);
    for (const s of sample.slice(0, 8)) {
      stdout.write(`    ${safeLog(s.pathname)}  (${s.bytes} B)\n`);
    }
    if (sample.length > 8) {
      stdout.write(`    ... and ${sample.length - 8} more\n`);
    }
  }

  return { label, prefix, listed: uniq.length, written, skipped, filtered, bytes: totalBytes, byKind, sample };
}

// ─── main ───────────────────────────────────────────────────────────

/**
 * Resolve which stores to mirror based on CLI flags.
 *
 * - No --prefix → multi-store: every MIRROR_TARGET, each into <root>/<prefix>.
 * - --prefix only → single store into <root>/<prefix>.
 * - --prefix + --out → legacy direct override: mirror <prefix> straight into <out>.
 */
function resolveTargets(args, explicitPrefix, explicitOut, mirrorRoot) {
  const classifierFor = (prefix) => (prefix === 'builder-site' ? classifyBuilderSiteBlob : undefined);
  if (explicitPrefix) {
    const prefix = args.prefix.endsWith('/') ? args.prefix.slice(0, -1) : args.prefix;
    const prefixSegments = prefix.split('/');
    if (
      !prefix || prefix.includes('\\') || prefix.includes('\0') ||
      prefixSegments.some((segment) => !segment || segment === '.' || segment === '..')
    ) {
      throw new Error('Unsafe blob prefix.');
    }
    const outDir = explicitOut ? mirrorRoot : path.join(mirrorRoot, prefix);
    return [{ label: prefix, prefix, outDir, classify: classifierFor(prefix) }];
  }
  return MIRROR_TARGETS.map((t) => ({ ...t, outDir: path.join(mirrorRoot, t.prefix) }));
}

export async function runPullProdBuilderData({
  args: rawArgs = [],
  cwd = process.cwd(),
  environment = process.env,
  provider = { list, get },
  stdout = process.stdout,
  stderr = process.stderr,
  token: providedToken,
  repoRuntimeDataRoot = REPO_RUNTIME_DATA_ROOT,
  writeFileAtomic = writeWithLocalJsonLease,
  withRootLease = withLocalJsonWriteLease,
  testHook,
} = {}) {
  const args = parseArgs(rawArgs);
  if (args.help) {
    stdout.write(HELP);
    return { help: true, totalListed: 0, totalWritten: 0, totalSkipped: 0, totalFiltered: 0, totalBytes: 0, perStore: [] };
  }

  if (!writeFileAtomic || !withRootLease) throw new Error('Local JSON atomic writer is unavailable.');
  const envPath = path.resolve(cwd, args.envPath);
  const token = providedToken ?? await loadTokenFromEnvFile(envPath);
  environment.BLOB_READ_WRITE_TOKEN = token;

  const explicitPrefix = rawArgs.some((arg) => arg.startsWith('--prefix='));
  const explicitOut = rawArgs.some((arg) => arg.startsWith('--out='));

  const safetyOptions = { cwd, environment, repoRuntimeDataRoot };
  const mirrorRoot = await assertMirrorRootIsIsolated(args.outDir, safetyOptions);
  const targets = resolveTargets(args, explicitPrefix, explicitOut, mirrorRoot);
  const mode = explicitPrefix ? 'single-store' : 'multi-store';
  const safeLog = (value) => scrub(String(value), token);
  const mirrorParent = path.dirname(mirrorRoot);
  await ensureDirectoryFromNearestExistingAncestor(mirrorParent);
  await assertMirrorRootIsIsolated(mirrorRoot, safetyOptions);
  const physicalTempRoot = await realpath(os.tmpdir());
  const leaseControlRoot = path.join(physicalTempRoot, 'tseng-law-pull-prod-mirror-leases');
  const allowedLeaseRoot = await ensureBoundDirectory(physicalTempRoot, leaseControlRoot);
  const rootLeaseTarget = mirrorRootLeaseTarget(mirrorRoot, allowedLeaseRoot);
  if (testHook) await testHook({ phase: 'before-root-lease', mirrorRoot, rootLeaseTarget });

  return withRootLease(rootLeaseTarget, { allowedRoot: allowedLeaseRoot }, async () => {
    if (testHook) await testHook({ phase: 'after-root-lease', mirrorRoot, rootLeaseTarget });
    await assertMirrorRootIsIsolated(mirrorRoot, safetyOptions);
    stdout.write(
      `[pull-prod-builder-data] READ-ONLY mirror (${mode})\n` +
        `  mirror root : ${safeLog(mirrorRoot)}\n` +
        `  env file    : ${safeLog(envPath)} (token ${PLACEHOLDER})\n` +
        `  stores      : ${safeLog(targets.map((t) => t.prefix).join(', '))}\n` +
        `  contract    : list+get only — NEVER put/del/copy\n`,
    );

    if (args.purge) {
      stdout.write(`  purge       : removing existing mirror root before mirroring\n`);
      await purgeIsolatedMirrorRoot(mirrorRoot, safetyOptions, testHook);
    }
    await ensureBoundDirectory(mirrorParent, mirrorRoot);
    await assertMirrorRootIsIsolated(mirrorRoot, safetyOptions);
    const physicalMirrorRoot = await realpath(mirrorRoot);
    await ensureOwnedMirrorMarker(mirrorRoot, physicalMirrorRoot, writeFileAtomic);

    for (const target of targets) {
      if (!isPathWithinOrEqual(mirrorRoot, target.outDir)) throw new Error(PATH_SAFETY_ERROR);
      const physicalTargetRoot = await ensureBoundDirectory(mirrorRoot, target.outDir);
      if (!isPathWithinOrEqual(physicalMirrorRoot, physicalTargetRoot)) throw new Error(PATH_SAFETY_ERROR);
      target.allowedRoot = physicalMirrorRoot;
    }

    let totalListed = 0;
    let totalWritten = 0;
    let totalSkipped = 0;
    let totalFiltered = 0;
    let totalBytes = 0;
    const perStore = [];

    for (const target of targets) {
      const r = await mirrorStore(target, args.limit, token, { provider, stdout, stderr, writeFileAtomic });
      totalListed += r.listed;
      totalWritten += r.written;
      totalSkipped += r.skipped;
      totalFiltered += r.filtered;
      totalBytes += r.bytes;
      perStore.push(r);
    }

    // Grand summary
    stdout.write(`\n[mirror complete]\n`);
    stdout.write(`  stores        : ${perStore.length}\n`);
    stdout.write(`  blobs listed  : ${totalListed}\n`);
    stdout.write(`  files written : ${totalWritten}\n`);
    if (totalSkipped > 0) stdout.write(`  files skipped : ${totalSkipped}\n`);
    if (totalFiltered > 0) stdout.write(`  files filtered: ${totalFiltered} (e.g. search query logs)\n`);
    stdout.write(`  total bytes   : ${totalBytes}\n`);
    stdout.write(`\n  per store:\n`);
    for (const r of perStore) {
      stdout.write(
        `    ${safeLog(r.prefix).padEnd(26)} listed=${r.listed} written=${r.written}` +
          `${r.skipped ? ` skipped=${r.skipped}` : ''}${r.filtered ? ` filtered=${r.filtered}` : ''}` +
          ` bytes=${r.bytes}\n`,
      );
    }
    return { help: false, totalListed, totalWritten, totalSkipped, totalFiltered, totalBytes, perStore };
  });
}

async function main() {
  await runPullProdBuilderData({ args: process.argv.slice(2) });
}

if (process.argv[1] && path.resolve(process.argv[1]) === SCRIPT_PATH) {
  main().catch((error) => {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    const raw = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;
    const msg = scrub(raw, token);
    process.stderr.write(`\n[pull-prod-builder-data] FAILED: ${msg}\n`);
    if (stack) {
      // Scrub token from stack too, then print for diagnosis (token-safe).
      process.stderr.write(scrub(stack, token) + '\n');
    }
    process.exitCode = 1;
  });
}
