#!/usr/bin/env node
/**
 * Remove the legacy static copy of every section from the published zh-hant home.
 *
 * The published zh-hant home still carries the July decomposition: a static
 * tree per section (`home-<section>-root` and its descendants) next to the live
 * composite (`home-<section>`, rendered from code). The public renderer shows
 * one of the two per section and viewport, so desktop visitors see the stale
 * static copy (old case amount, a Korean mobile number as the contact button)
 * while other widths see the composites. The ko/en homes are already in the
 * "current9" shape: exactly the nine composites, nothing else. User decision
 * 2026-09-28 (5A): clean up and republish; the composite contact block offers
 * e-mail consultation.
 *
 * The kept composites are rebuilt in the exact current9 shape that
 * matchCurrent9PublishedHomeEditorial() recognises (section order, zIndex,
 * zh-hant heights and stage height, default style, no anchorName). Keeping
 * them unchanged is not enough: their `mobile-parity-home-*` anchors are
 * hidden on desktop once the July fingerprint no longer matches.
 *
 * Safety contract (same as patch-zh-hero-2026-07-21.mjs):
 * - dry-run is the default and performs no persistence write;
 * - the plan aborts unless the top level is exactly the composites of the ko
 *   home (same ids and component keys, zh-hant config) plus one
 *   `<composite-id>-root` container per composite, and nothing else;
 * - only the root trees are removed; the nine composites keep their ids and
 *   component keys and are normalised to the current9 geometry;
 * - --apply refuses to write unless matchCurrent9PublishedHomeEditorial()
 *   accepts the validated document;
 * - --apply validates the schema, runs publish checks, writes a complete
 *   published-document backup, saves a guarded draft and calls publishPage.
 *
 * Usage:
 *   node scripts/dedupe-zh-home-2026-09-28.mjs            # dry run
 *   node scripts/dedupe-zh-home-2026-09-28.mjs --apply
 */

import { spawnSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { isDeepStrictEqual } from 'node:util';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const SCRIPT_UPDATED_BY = 'dedupe-zh-home-2026-09-28';
const DEFAULT_SITE_ID = 'tseng-law-main-site';
const TARGET_LOCALE = 'zh-hant';
const SOURCE_LOCALE = 'ko';
const SCRIPT_PATH = fileURLToPath(import.meta.url);
const REPO_ROOT = path.resolve(path.dirname(SCRIPT_PATH), '..');
const DEFAULT_BACKUP_DIR = path.join(REPO_ROOT, 'runtime-data', 'backups');
const VITE_NODE_PATH = path.join(REPO_ROOT, 'node_modules', 'vite-node', 'vite-node.mjs');
const VITE_CONFIG_PATH = path.join(REPO_ROOT, 'vitest.config.ts');
const VITE_NODE_SENTINEL = 'ZH_HOME_DEDUPE_VITE_NODE';

function topLevel(document) {
  return (document?.nodes ?? []).filter((node) => !node.parentId);
}

function compositeSignature(nodes) {
  return nodes
    .filter((node) => node.kind === 'composite')
    .map((node) => `${node.id}:${node?.content?.componentKey}`);
}

function subtreeIds(nodes, rootId) {
  const ids = new Set([rootId]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const node of nodes) {
      if (!ids.has(node.id) && node.parentId && ids.has(node.parentId)) {
        ids.add(node.id);
        changed = true;
      }
    }
  }
  return ids;
}

function textOf(node) {
  const content = node?.content ?? {};
  return [content.text, content.label, content.href, content?.richText?.plainText]
    .filter((value) => typeof value === 'string')
    .join(' ');
}

/**
 * Pure document planner. It never reads or writes persistence.
 */
export function planZhHomeDedupe(zhDocument, koDocument, options = {}) {
  const now = options.now ?? new Date().toISOString();
  const fail = (error) => ({ ok: false, error, document: structuredClone(zhDocument), removed: [], keptIds: [] });
  const nodes = Array.isArray(zhDocument?.nodes) ? zhDocument.nodes : [];
  const zhTop = topLevel(zhDocument);
  const koTop = topLevel(koDocument);

  const koSignature = compositeSignature(koTop);
  if (koSignature.length === 0 || koTop.some((node) => node.kind !== 'composite')) {
    return fail('ko home is not composite-only; refusing to use it as the reference.');
  }
  const zhComposites = zhTop.filter((node) => node.kind === 'composite');
  if (!isDeepStrictEqual(compositeSignature(zhTop), koSignature)) {
    return fail(`zh-hant composites differ from ko: ${JSON.stringify(compositeSignature(zhTop))}`);
  }
  const wrongLocale = zhComposites.filter((node) => node?.content?.config?.locale !== TARGET_LOCALE);
  if (wrongLocale.length > 0) {
    return fail(`zh-hant composites with another locale: ${wrongLocale.map((node) => node.id).join(', ')}`);
  }

  const expectedRoots = new Set(zhComposites.map((node) => `${node.id}-root`));
  const roots = zhTop.filter((node) => node.kind !== 'composite');
  const unexpected = roots.filter((node) => node.kind !== 'container' || !expectedRoots.has(node.id));
  if (unexpected.length > 0) {
    return fail(`unexpected top-level nodes: ${unexpected.map((node) => `${node.id}(${node.kind})`).join(', ')}`);
  }
  if (roots.length === 0) return fail('no legacy root trees found; the home is already deduplicated.');

  const removeIds = new Set();
  const removed = [];
  for (const root of roots) {
    const ids = subtreeIds(nodes, root.id);
    for (const id of ids) removeIds.add(id);
    const flagged = nodes
      .filter((node) => ids.has(node.id))
      .map(textOf)
      .filter((text) => /157|tel:\+82|台灣法律，清楚說明/.test(text));
    removed.push({ rootId: root.id, nodeCount: ids.size, flagged });
  }
  const kept = nodes.filter((node) => !removeIds.has(node.id));
  if (!isDeepStrictEqual(kept.map((node) => node.id), zhComposites.map((node) => node.id))) {
    return fail('nodes outside the root trees would remain; refusing a partial dedupe.');
  }

  // Rebuild the composites in the current9 published shape (see file header).
  const layout = options.layout;
  if (!layout) return fail('current9 layout (section ids, heights, stage height, style) is required.');
  const byId = new Map(zhComposites.map((node) => [node.id, node]));
  if (!isDeepStrictEqual([...byId.keys()].sort(), [...layout.sectionIds].sort())) {
    return fail(`zh-hant composites are not the nine current9 sections: ${[...byId.keys()].join(', ')}`);
  }
  let y = 0;
  const rebuilt = layout.sectionIds.map((id, index) => {
    const height = layout.heights[id];
    const node = {
      id,
      kind: 'composite',
      rect: { x: 0, y, width: layout.stageWidth, height },
      style: structuredClone(layout.style),
      zIndex: index,
      rotation: 0,
      locked: false,
      visible: true,
      content: { componentKey: byId.get(id).content.componentKey, config: { locale: TARGET_LOCALE } },
    };
    y += height;
    return node;
  });
  if (y !== layout.stageHeight) {
    return fail(`current9 section heights sum to ${y}, expected stage height ${layout.stageHeight}.`);
  }

  const document = {
    version: zhDocument.version,
    locale: TARGET_LOCALE,
    updatedAt: now,
    updatedBy: SCRIPT_UPDATED_BY,
    stageWidth: layout.stageWidth,
    stageHeight: layout.stageHeight,
    nodes: rebuilt,
  };
  return { ok: true, document, removed, keptIds: rebuilt.map((node) => node.id) };
}

/** current9 layout for zh-hant, read from the same modules the public renderer uses. */
export function current9LayoutFrom(parity, createDefaultCanvasNodeStyle) {
  const keyById = {
    'home-hero': 'hero',
    'home-insights': 'insights',
    'home-services': 'services',
    'home-attorney': 'attorney',
    'home-case-results': 'caseResults',
    'home-stats': 'stats',
    'home-faq': 'faq',
    'home-offices': 'offices',
    'home-contact': 'contact',
  };
  const localeHeights = parity.PUBLISHED_HOME_COMPOSITE_HEIGHTS_BY_LOCALE[TARGET_LOCALE];
  return {
    sectionIds: [...parity.HOME_COMPOSITE_SECTION_IDS],
    heights: Object.fromEntries(parity.HOME_COMPOSITE_SECTION_IDS.map((id) => [id, localeHeights[keyById[id]]])),
    stageWidth: 1280,
    stageHeight: parity.PUBLISHED_HOME_COMPOSITE_STAGE_HEIGHT_BY_LOCALE[TARGET_LOCALE],
    style: createDefaultCanvasNodeStyle({ borderRadius: 0 }),
  };
}

function validatePatchedDocument(document, schemas) {
  const parsed = schemas.builderCanvasDocumentSchema.safeParse(document);
  if (!parsed.success) {
    return {
      ok: false,
      error: 'builderCanvasDocumentSchema validation failed',
      issues: parsed.error.issues.slice(0, 10).map((issue) => ({
        path: issue.path.join('.'),
        code: issue.code,
        message: issue.message,
      })),
    };
  }
  return { ok: true, document: parsed.data };
}

export function formatDedupePlan(plan, mode = 'dry-run') {
  const lines = [`=== zh-hant home dedupe (${mode === 'apply' ? 'APPLY' : 'DRY RUN'}) ===`];
  if (!plan.ok) {
    lines.push(`ABORT: ${plan.error}`, 'No persistence write was attempted.');
    return lines.join('\n');
  }
  for (const entry of plan.removed) {
    lines.push(`- remove ${entry.rootId} (${entry.nodeCount} nodes)`);
    for (const text of entry.flagged) lines.push(`    notable text removed: ${JSON.stringify(text).slice(0, 160)}`);
  }
  lines.push(`keep ${plan.keptIds.length} composites, rebuilt in the current9 shape (stage height ${plan.document.stageHeight}): ${plan.keptIds.join(', ')}`);
  if (mode !== 'apply') lines.push('Dry-run complete; no persistence write was attempted.');
  return lines.join('\n');
}

function parseArgs(argv) {
  const options = { apply: false, help: false, siteId: DEFAULT_SITE_ID, backupDir: DEFAULT_BACKUP_DIR };
  for (const arg of argv) {
    if (arg === '--apply') options.apply = true;
    else if (arg === '--dry-run') options.apply = false;
    else if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg.startsWith('--site=')) options.siteId = arg.slice('--site='.length);
    else if (arg.startsWith('--backup-dir=')) options.backupDir = path.resolve(arg.slice('--backup-dir='.length));
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(options.siteId)) {
    throw new Error('--site must be a safe builder site id.');
  }
  return options;
}

const HELP = 'Usage: node scripts/dedupe-zh-home-2026-09-28.mjs [--apply] [--site=<siteId>] [--backup-dir=<path>]\n'
  + 'Dry run by default. Storage selection is delegated to the builder-site persistence layer; no credential is printed.';

function findHomePageMeta(pages, locale) {
  const matches = pages.filter((page) => page.locale === locale && page.isHomePage);
  if (matches.length !== 1) throw new Error(`Expected one ${locale} home page, found ${matches.length}.`);
  return matches[0];
}

function sameRecordGeneration(left, right) {
  if (!left || !right) return left === right;
  return left.record.revision === right.record.revision && left.record.savedAt === right.record.savedAt;
}

function assertDraftCanBeReplaced(page, draftState, publishedState) {
  if (!draftState) return;
  if (page.lastPublishedDraftRevision === draftState.record.revision) return;
  if (publishedState && isDeepStrictEqual(draftState.record.document, publishedState.record.document)) return;
  throw new Error(
    `Refusing to replace unpublished zh-hant draft revision ${draftState.record.revision}. `
      + 'Publish or discard that draft explicitly before applying this patch.',
  );
}

async function loadRuntimeDependencies() {
  const persistence = await import('../src/lib/builder/site/persistence.ts');
  const publishedCanvas = await import('../src/lib/builder/site/published-canvas.ts');
  const publish = await import('../src/lib/builder/site/publish.ts');
  const schemas = await import('../src/lib/builder/canvas/types.ts');
  const parity = await import('../src/lib/builder/canvas/home-composite-parity.ts');
  const editorial = await import('../src/lib/builder/site/published-home-editorial.ts');
  return {
    current9Layout: current9LayoutFrom(parity, schemas.createDefaultCanvasNodeStyle),
    matchCurrent9PublishedHomeEditorial: editorial.matchCurrent9PublishedHomeEditorial,
    ...persistence,
    ...publishedCanvas,
    publishPageThroughPipeline: publish.publishPage,
    runPublishChecks: publish.runPublishChecks,
    builderCanvasDocumentSchema: schemas.builderCanvasDocumentSchema,
  };
}

export async function runZhHomeDedupe(options, deps, io = {}) {
  const stdout = io.stdout ?? process.stdout;
  const site = await deps.readSiteDocument(options.siteId, TARGET_LOCALE);
  const zhPage = findHomePageMeta(site.pages, TARGET_LOCALE);
  const koPage = findHomePageMeta(site.pages, SOURCE_LOCALE);
  const [zhDocument, koDocument, zhPublishedState, zhDraftState] = await Promise.all([
    deps.readPublishedPageCanvas(zhPage, options.siteId),
    deps.readPublishedPageCanvas(koPage, options.siteId),
    deps.readPageCanvasRecordState(options.siteId, zhPage.pageId, 'published'),
    deps.readPageCanvasRecordState(options.siteId, zhPage.pageId, 'draft'),
  ]);
  if (!zhDocument) throw new Error('Published zh-hant home canvas was not found.');
  if (!koDocument) throw new Error('Published ko home canvas was not found.');

  const plan = planZhHomeDedupe(zhDocument, koDocument, { layout: deps.current9Layout });
  stdout.write(`${formatDedupePlan(plan, options.apply ? 'apply' : 'dry-run')}\n`);
  if (!plan.ok) return { ok: false, applied: false, plan };
  const validated = validatePatchedDocument(plan.document, deps);
  if (!validated.ok) throw new Error(`${validated.error}: ${JSON.stringify(validated.issues)}`);
  stdout.write(`Schema validation: PASS (${validated.document.nodes.length} nodes)\n`);
  if (!deps.matchCurrent9PublishedHomeEditorial({ document: validated.document, locale: TARGET_LOCALE, slugPath: '' })) {
    throw new Error('The cleaned document is not recognised as a current9 home; refusing to publish.');
  }
  stdout.write('current9 match: PASS\n');
  if (!options.apply) return { ok: true, applied: false, plan };

  assertDraftCanBeReplaced(zhPage, zhDraftState, zhPublishedState);
  const checks = await deps.runPublishChecks(validated.document, zhPage.pageId, options.siteId, TARGET_LOCALE);
  if (!checks.passed) throw new Error(`Publish checks blocked the patch: ${JSON.stringify(checks.errors)}`);

  await mkdir(options.backupDir, { recursive: true, mode: 0o700 });
  const backupPath = path.join(options.backupDir, `zh-home-dedupe-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
  await writeFile(backupPath, `${JSON.stringify({
    kind: 'zh-home-published-backup',
    createdAt: new Date().toISOString(),
    siteId: options.siteId,
    pageId: zhPage.pageId,
    pageMeta: zhPage,
    publishedRecord: zhPublishedState?.record ?? null,
    resolvedPublishedDocument: zhDocument,
  }, null, 2)}\n`, { encoding: 'utf8', mode: 0o600, flag: 'wx' });
  stdout.write(`Backup written: ${backupPath}\n`);

  const latestPublished = await deps.readPageCanvasRecordState(options.siteId, zhPage.pageId, 'published');
  if (!sameRecordGeneration(latestPublished, zhPublishedState)) {
    throw new Error(`Published zh-hant home changed after backup; aborting. Backup kept at ${backupPath}`);
  }
  const draft = await deps.updatePageCanvasRecord(options.siteId, zhPage.pageId, 'draft', (currentState) => {
    if (!sameRecordGeneration(currentState, zhDraftState)) {
      throw new Error('Draft changed after preflight; aborting without publish.');
    }
    return {
      revision: currentState ? currentState.record.revision + 1 : 0,
      savedAt: new Date().toISOString(),
      updatedBy: SCRIPT_UPDATED_BY,
      document: validated.document,
    };
  });
  stdout.write(`Draft saved: revision ${draft.revision}\n`);
  const published = await deps.publishPageThroughPipeline(options.siteId, zhPage.pageId, {
    expectedDraftRevision: draft.revision,
  });
  stdout.write(`Published: revision ${published.publishedRevision}, id ${published.publishedRevisionId}\n`);
  return { ok: true, applied: true, plan, backupPath, draft, published };
}

function reexecWithViteNode(argv) {
  const result = spawnSync(
    process.execPath,
    [VITE_NODE_PATH, '--config', VITE_CONFIG_PATH, SCRIPT_PATH, ...argv],
    { cwd: REPO_ROOT, stdio: 'inherit', env: { ...process.env, [VITE_NODE_SENTINEL]: '1' } },
  );
  if (result.error) throw result.error;
  process.exitCode = typeof result.status === 'number' ? result.status : 1;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(`${HELP}\n`);
    return;
  }
  if (process.env[VITE_NODE_SENTINEL] !== '1') {
    reexecWithViteNode(process.argv.slice(2));
    return;
  }
  const deps = await loadRuntimeDependencies();
  const result = await runZhHomeDedupe(options, deps);
  if (!result.ok) process.exitCode = 1;
}

// vite-node keeps its own CLI path in argv[1], so the private sentinel is the
// direct-run identity for the re-executed child. Imports from tests have no
// sentinel and therefore remain side-effect free.
const isDirectRun = (process.argv[1] && path.resolve(process.argv[1]) === SCRIPT_PATH)
  || process.env[VITE_NODE_SENTINEL] === '1';
if (isDirectRun) {
  main().catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`zh-hant home dedupe aborted: ${message}\n`);
    process.exitCode = 1;
  });
}
