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
import { readFile, writeFile, mkdir, rename, rm } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const PLACEHOLDER = '<redacted>';
const DEFAULT_PREFIX = 'builder-site';
const DEFAULT_ENV = '.env.local';
const DEFAULT_OUT = 'runtime-data-prod-mirror';

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
  for (const arg of argv.slice(2)) {
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

function relPathOf(pathname, prefix) {
  // <prefix>/<siteId>/... -> <siteId>/... (or whatever follows the prefix)
  if (pathname.startsWith(`${prefix}/`)) return pathname.slice(prefix.length + 1);
  if (pathname.startsWith(`${prefix}`)) return pathname.slice(prefix.length);
  return pathname;
}

async function streamToText(stream) {
  // @vercel/blob v2 private get() returns a web ReadableStream<Uint8Array>.
  const buf = await new Response(stream).arrayBuffer();
  return new TextDecoder('utf-8').decode(buf);
}

async function listAll(prefix, limit, secret) {
  const all = [];
  let cursor;
  let page = 0;
  for (;;) {
    page += 1;
    const result = await list({ prefix, limit, cursor });
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

async function writeAtomic(targetPath, text) {
  await mkdir(path.dirname(targetPath), { recursive: true });
  const tmpPath = `${targetPath}.tmp-${process.pid}-${Math.random().toString(36).slice(2)}`;
  try {
    await writeFile(tmpPath, text, 'utf8');
    await rename(tmpPath, targetPath);
  } catch (error) {
    await rm(tmpPath, { force: true }).catch(() => {});
    throw error;
  }
}

/**
 * Mirror one blob prefix into outDir. READ-ONLY: list + get only.
 *
 * @param {{ label: string, prefix: string, outDir: string, classify?: (rel: string) => string, filter?: (rel: string) => boolean }} target
 * @param {number}   limit  page size for list()
 * @param {string}   token  BLOB_READ_WRITE_TOKEN (for error scrubbing only)
 * @returns {Promise<{ label: string, prefix: string, listed: number, written: number, skipped: number, filtered: number, bytes: number, byKind: Record<string, number> | null, sample: Array<{ pathname: string, bytes: number, kind: string | null }> }>}
 */
async function mirrorStore(target, limit, token) {
  const { label, prefix, outDir, classify, filter } = target;

  process.stdout.write(`\n[list] ${label}\n`);
  process.stdout.write(`  prefix : ${prefix}/  (Vercel Blob, list+get only — no put/del/copy)\n`);
  process.stdout.write(`  outDir : ${outDir}\n`);

  const blobs = await listAll(`${prefix}/`, limit, token);
  if (blobs.length === 0) {
    process.stdout.write(`  -> no blobs found under "${prefix}/".\n`);
    return { label, prefix, listed: 0, written: 0, skipped: 0, filtered: 0, bytes: 0, byKind: null, sample: [] };
  }

  // De-dup by pathname (defensive; list never returns duplicates).
  const byPath = new Map();
  for (const b of blobs) {
    if (!byPath.has(b.pathname)) byPath.set(b.pathname, b);
  }
  const uniq = Array.from(byPath.values());
  process.stdout.write(`  -> ${uniq.length} unique blob(s)\n`);

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
    const relPath = relPathOf(pathname, prefix);

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
      result = await get(pathname, { access: 'private', useCache: false });
    } catch (error) {
      const msg = scrub(error instanceof Error ? error.message : String(error), token);
      process.stderr.write(`  [get ERROR] ${pathname}: ${msg} — skipped\n`);
      skipped += 1;
      continue;
    }
    if (!result || result.statusCode !== 200 || !result.stream) {
      process.stderr.write(`  [get missing] ${pathname} (statusCode=${result?.statusCode ?? 'n/a'}) — skipped\n`);
      skipped += 1;
      continue;
    }

    const text = await streamToText(result.stream);
    const targetPath = path.join(outDir, relPath);
    await writeAtomic(targetPath, text);

    const bytes = Buffer.byteLength(text, 'utf8');
    totalBytes += bytes;
    written += 1;
    sample.push({ pathname, bytes, kind });
  }

  process.stdout.write(
    `  -> written=${written}` +
      `${skipped ? ` skipped=${skipped}` : ''}` +
      `${filtered ? ` filtered=${filtered}` : ''}` +
      ` bytes=${totalBytes}\n`,
  );
  if (byKind) {
    process.stdout.write(
      `  by kind: site=${byKind.site} ` +
        `page.draft=${byKind['page-draft']} ` +
        `page.published=${byKind['page-published']} ` +
        `lightbox=${byKind.lightbox} ` +
        `global=${byKind.global} ` +
        `other=${byKind.other}\n`,
    );
  }
  if (sample.length > 0) {
    process.stdout.write(`  sample pathnames:\n`);
    for (const s of sample.slice(0, 8)) {
      process.stdout.write(`    ${s.pathname}  (${s.bytes} B)\n`);
    }
    if (sample.length > 8) {
      process.stdout.write(`    ... and ${sample.length - 8} more\n`);
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
    const outDir = explicitOut ? mirrorRoot : path.join(mirrorRoot, prefix);
    return [{ label: prefix, prefix, outDir, classify: classifierFor(prefix) }];
  }
  return MIRROR_TARGETS.map((t) => ({ ...t, outDir: path.join(mirrorRoot, t.prefix) }));
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    process.stdout.write(HELP);
    return;
  }

  const token = await loadTokenFromEnvFile(args.envPath);
  process.env.BLOB_READ_WRITE_TOKEN = token;

  const argv = process.argv;
  const explicitPrefix = argv.some((a) => a.startsWith('--prefix='));
  const explicitOut = argv.some((a) => a.startsWith('--out='));

  const mirrorRoot = path.resolve(process.cwd(), args.outDir);
  const targets = resolveTargets(args, explicitPrefix, explicitOut, mirrorRoot);
  const mode = explicitPrefix ? 'single-store' : 'multi-store';

  process.stdout.write(
    `[pull-prod-builder-data] READ-ONLY mirror (${mode})\n` +
      `  mirror root : ${mirrorRoot}\n` +
      `  env file    : ${path.resolve(process.cwd(), args.envPath)} (token ${PLACEHOLDER})\n` +
      `  stores      : ${targets.map((t) => t.prefix).join(', ')}\n` +
      `  contract    : list+get only — NEVER put/del/copy\n`,
  );

  if (args.purge) {
    process.stdout.write(`  purge       : removing existing mirror root before mirroring\n`);
    await rm(mirrorRoot, { recursive: true, force: true });
  }

  let totalListed = 0;
  let totalWritten = 0;
  let totalSkipped = 0;
  let totalFiltered = 0;
  let totalBytes = 0;
  const perStore = [];

  for (const target of targets) {
    const r = await mirrorStore(target, args.limit, token);
    totalListed += r.listed;
    totalWritten += r.written;
    totalSkipped += r.skipped;
    totalFiltered += r.filtered;
    totalBytes += r.bytes;
    perStore.push(r);
  }

  // Grand summary
  process.stdout.write(`\n[mirror complete]\n`);
  process.stdout.write(`  stores        : ${perStore.length}\n`);
  process.stdout.write(`  blobs listed  : ${totalListed}\n`);
  process.stdout.write(`  files written : ${totalWritten}\n`);
  if (totalSkipped > 0) process.stdout.write(`  files skipped : ${totalSkipped}\n`);
  if (totalFiltered > 0) process.stdout.write(`  files filtered: ${totalFiltered} (e.g. search query logs)\n`);
  process.stdout.write(`  total bytes   : ${totalBytes}\n`);
  process.stdout.write(`\n  per store:\n`);
  for (const r of perStore) {
    process.stdout.write(
      `    ${r.prefix.padEnd(26)} listed=${r.listed} written=${r.written}` +
        `${r.skipped ? ` skipped=${r.skipped}` : ''}${r.filtered ? ` filtered=${r.filtered}` : ''}` +
        ` bytes=${r.bytes}\n`,
    );
  }
}

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
  process.exit(1);
});
