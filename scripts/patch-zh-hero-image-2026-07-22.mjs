#!/usr/bin/env node
/**
 * Replace the published zh-hant home hero rotation with one full-bleed image.
 *
 * Safety contract:
 * - dry-run is the default and performs no persistence write;
 * - --apply first writes a complete published-document backup, then saves a
 *   guarded draft and calls the existing publishPage pipeline;
 * - all five exact hero node ids and their expected hierarchy must exist or
 *   the planner returns the original document unchanged;
 * - both the source and planned document are validated before any write.
 */

import { spawnSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { isDeepStrictEqual } from 'node:util';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import {
  findHomePageMeta,
  validatePatchedDocument,
} from './patch-zh-hero-2026-07-21.mjs';

export const HERO_IMAGE_SRC = '/images/hero-bg-taipei-night.webp';
export const HERO_IMAGE_ALT = '台北101夜景城市天際線';
export const HERO_ROOT_ID = 'home-hero-root';
export const HERO_MEDIA_ID = 'home-hero-media';
export const HERO_IMAGE_IDS = [
  'home-hero-media-image',
  'home-hero-media-image-2',
  'home-hero-media-image-3',
];

const SCRIPT_UPDATED_BY = 'patch-zh-hero-image-2026-07-22';
const DEFAULT_SITE_ID = 'tseng-law-main-site';
const TARGET_LOCALE = 'zh-hant';
const SCRIPT_PATH = fileURLToPath(import.meta.url);
const REPO_ROOT = path.resolve(path.dirname(SCRIPT_PATH), '..');
const DEFAULT_BACKUP_DIR = path.join(REPO_ROOT, 'runtime-data', 'backups');
const VITE_NODE_PATH = path.join(REPO_ROOT, 'node_modules', 'vite-node', 'vite-node.mjs');
const VITE_CONFIG_PATH = path.join(REPO_ROOT, 'vitest.config.ts');
const VITE_NODE_SENTINEL = 'ZH_HERO_IMAGE_PATCH_VITE_NODE';
const VIEWPORTS = ['tablet', 'mobile'];

function isRecord(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function hasAt(object, pathParts) {
  let value = object;
  for (let index = 0; index < pathParts.length - 1; index += 1) {
    if (!isRecord(value) && !Array.isArray(value)) return false;
    value = value[pathParts[index]];
  }
  return (isRecord(value) || Array.isArray(value))
    && Object.prototype.hasOwnProperty.call(value, pathParts[pathParts.length - 1]);
}

function valueAt(object, pathParts) {
  let value = object;
  for (const part of pathParts) {
    if (!isRecord(value) && !Array.isArray(value)) return undefined;
    value = value[part];
  }
  return value;
}

function setAt(object, pathParts, nextValue) {
  let parent = object;
  for (let index = 0; index < pathParts.length - 1; index += 1) {
    const key = pathParts[index];
    if (!isRecord(parent[key]) && !Array.isArray(parent[key])) parent[key] = {};
    parent = parent[key];
  }
  parent[pathParts[pathParts.length - 1]] = structuredClone(nextValue);
}

function recordChange(node, pathParts, nextValue, changes, reason) {
  const oldExists = hasAt(node, pathParts);
  const oldValue = valueAt(node, pathParts);
  if (oldExists && isDeepStrictEqual(oldValue, nextValue)) return;
  setAt(node, pathParts, nextValue);
  changes.push({
    nodeId: node.id,
    field: pathParts.join('.'),
    oldValue,
    newValue: nextValue,
    reason,
  });
}

function exactNode(nodes, id) {
  const matches = nodes.filter((node) => node?.id === id);
  if (matches.length !== 1) {
    return {
      ok: false,
      error: matches.length === 0
        ? `Required exact node is missing: ${id}`
        : `Required exact node id is ambiguous (${matches.length} matches): ${id}`,
    };
  }
  return { ok: true, node: matches[0] };
}

function effectiveWidth(node, viewport) {
  if (viewport === 'mobile') {
    const mobileWidth = node?.responsive?.mobile?.rect?.width;
    if (typeof mobileWidth === 'number') return mobileWidth;
  }
  if (viewport === 'mobile' || viewport === 'tablet') {
    const tabletWidth = node?.responsive?.tablet?.rect?.width;
    if (typeof tabletWidth === 'number') return tabletWidth;
  }
  return node?.rect?.width;
}

function widenToRoot(node, root, changes) {
  const original = structuredClone(node);
  const desktopRootWidth = root.rect.width;
  if (original.rect.width < desktopRootWidth) {
    recordChange(node, ['rect', 'x'], 0, changes, 'full-bleed desktop x aligned to hero root');
    recordChange(
      node,
      ['rect', 'width'],
      desktopRootWidth,
      changes,
      'full-bleed desktop width expanded to hero root',
    );
  }

  for (const viewport of VIEWPORTS) {
    const rootWidth = effectiveWidth(root, viewport);
    const nodeWidth = effectiveWidth(original, viewport);
    if (typeof rootWidth !== 'number' || typeof nodeWidth !== 'number' || nodeWidth >= rootWidth) {
      continue;
    }
    recordChange(
      node,
      ['responsive', viewport, 'rect', 'x'],
      0,
      changes,
      `full-bleed ${viewport} x aligned to hero root`,
    );
    recordChange(
      node,
      ['responsive', viewport, 'rect', 'width'],
      rootWidth,
      changes,
      `full-bleed ${viewport} width expanded to hero root`,
    );
  }
}

function patchImageContent(node, changes) {
  recordChange(node, ['content', 'src'], HERO_IMAGE_SRC, changes, 'replace hero image source');
  if (isRecord(node.content.srcByLocale)) {
    recordChange(
      node,
      ['content', 'srcByLocale', TARGET_LOCALE],
      HERO_IMAGE_SRC,
      changes,
      'replace zh-hant locale hero image source',
    );
  }
  if (Object.prototype.hasOwnProperty.call(node.content, 'fit')) {
    recordChange(node, ['content', 'fit'], 'cover', changes, 'cover the full-bleed hero frame');
  }
  if (Object.prototype.hasOwnProperty.call(node.content, 'focalPoint')) {
    recordChange(
      node,
      ['content', 'focalPoint'],
      { x: 50, y: 50 },
      changes,
      'keep the replacement image centered',
    );
  }
  if (Object.prototype.hasOwnProperty.call(node.content, 'alt')) {
    recordChange(node, ['content', 'alt'], HERO_IMAGE_ALT, changes, 'replace zh-hant hero alt text');
  }
  if (isRecord(node.content.altByLocale)) {
    recordChange(
      node,
      ['content', 'altByLocale', TARGET_LOCALE],
      HERO_IMAGE_ALT,
      changes,
      'replace zh-hant locale hero alt text',
    );
  }
}

/**
 * Pure planner. The input is cloned and is never mutated.
 */
export function planZhHeroImagePatch(zhDocument, options = {}) {
  const original = structuredClone(zhDocument);
  const document = structuredClone(zhDocument);
  const nodes = Array.isArray(document?.nodes) ? document.nodes : [];
  const required = [HERO_ROOT_ID, HERO_MEDIA_ID, ...HERO_IMAGE_IDS]
    .map((id) => [id, exactNode(nodes, id)]);
  const invalid = required.find(([, result]) => !result.ok);
  if (invalid) {
    return {
      ok: false,
      error: invalid[1].error,
      document: original,
      changes: [],
    };
  }

  const byId = new Map(required.map(([id, result]) => [id, result.node]));
  const root = byId.get(HERO_ROOT_ID);
  const media = byId.get(HERO_MEDIA_ID);
  const images = HERO_IMAGE_IDS.map((id) => byId.get(id));
  if (root.kind !== 'container') {
    return { ok: false, error: `${HERO_ROOT_ID} must be a container.`, document: original, changes: [] };
  }
  if (media.kind !== 'container' || media.parentId !== HERO_ROOT_ID) {
    return {
      ok: false,
      error: `${HERO_MEDIA_ID} must be a container directly under ${HERO_ROOT_ID}.`,
      document: original,
      changes: [],
    };
  }
  const malformedImage = images.find((node) => (
    node.kind !== 'image' || node.parentId !== HERO_MEDIA_ID
  ));
  if (malformedImage) {
    return {
      ok: false,
      error: `${malformedImage.id} must be an image directly under ${HERO_MEDIA_ID}.`,
      document: original,
      changes: [],
    };
  }

  const changes = [];
  widenToRoot(media, root, changes);
  for (const image of images) {
    patchImageContent(image, changes);
    widenToRoot(image, root, changes);
  }

  // 실렌더 확인 결과: 보이는 히어로 배경은 image 자식 노드가 아니라 home-hero/home-hero-media
  // 컨테이너의 자체 배경·로테이션 설정(style/content 내 문자열 경로)이 그린다.
  // 히어로 서브트리 한정으로 구 자산 경로 문자열을 신 자산으로 전면 치환한다.
  const OLD_HERO_SRCS = ['/images/hero-bg-01.webp', '/images/hero-bg-02.webp', '/images/hero-bg-03.webp'];
  const heroSubtreeIds = new Set(['home-hero', HERO_ROOT_ID, HERO_MEDIA_ID, ...HERO_IMAGE_IDS]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const node of nodes) {
      if (node && !heroSubtreeIds.has(node.id) && heroSubtreeIds.has(node.parentId)) {
        heroSubtreeIds.add(node.id);
        grew = true;
      }
    }
  }
  const replaceDeep = (node, container, basePath) => {
    const val = valueAt(node, basePath);
    if (typeof val === 'string') {
      let next = val;
      for (const old of OLD_HERO_SRCS) {
        if (next.includes(old)) next = next.split(old).join(HERO_IMAGE_SRC);
      }
      if (next !== val) {
        recordChange(node, basePath, next, changes, 'hero container background src swap');
      }
      return;
    }
    if (isRecord(val) || Array.isArray(val)) {
      for (const key of Object.keys(val)) replaceDeep(node, container, [...basePath, key]);
    }
  };
  for (const node of nodes) {
    if (!node || !heroSubtreeIds.has(node.id)) continue;
    if (isRecord(node.style)) replaceDeep(node, node.style, ['style']);
    if (isRecord(node.content)) replaceDeep(node, node.content, ['content']);
  }

  if (changes.length > 0) {
    document.updatedAt = options.now ?? new Date().toISOString();
    document.updatedBy = SCRIPT_UPDATED_BY;
  }
  return { ok: true, document, changes };
}

function formatValue(value) {
  if (value === undefined) return '∅';
  const serialized = JSON.stringify(value);
  return serialized.length > 180 ? `${serialized.slice(0, 177)}...` : serialized;
}

export function formatZhHeroImagePatchPlan(plan, mode = 'dry-run') {
  const lines = [
    `=== zh-hant home hero image patch (${mode === 'apply' ? 'APPLY' : 'DRY RUN'}) ===`,
  ];
  if (!plan.ok) {
    lines.push(`ABORT: ${plan.error}`, 'No persistence write was attempted.');
    return lines.join('\n');
  }
  if (plan.changes.length === 0) lines.push('No changes planned.');
  for (const change of plan.changes) {
    lines.push(
      `- ${change.nodeId} :: ${change.field}`,
      `    ${formatValue(change.oldValue)} -> ${formatValue(change.newValue)}`,
      `    reason: ${change.reason}`,
    );
  }
  if (mode !== 'apply') lines.push('Dry-run complete; no persistence write was attempted.');
  return lines.join('\n');
}

function parseArgs(argv) {
  const options = {
    apply: false,
    help: false,
    siteId: DEFAULT_SITE_ID,
    backupDir: DEFAULT_BACKUP_DIR,
  };
  for (const arg of argv) {
    if (arg === '--apply') options.apply = true;
    else if (arg === '--dry-run') options.apply = false;
    else if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg.startsWith('--site=')) options.siteId = arg.slice('--site='.length);
    else if (arg.startsWith('--backup-dir=')) {
      options.backupDir = path.resolve(arg.slice('--backup-dir='.length));
    } else throw new Error(`Unknown argument: ${arg}`);
  }
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(options.siteId)) {
    throw new Error('--site must be a safe builder site id.');
  }
  return options;
}

const HELP = `Usage: node scripts/patch-zh-hero-image-2026-07-22.mjs [options]\n\n`
  + `Options:\n`
  + `  --dry-run             Read, validate, and print the plan only (default).\n`
  + `  --apply               Back up, save a guarded draft, and publish it.\n`
  + `  --site=<siteId>       Builder site id (default: ${DEFAULT_SITE_ID}).\n`
  + `  --backup-dir=<path>   Backup directory (default: runtime-data/backups).\n`
  + `  --help                Show this help.\n\n`
  + `Storage selection is delegated to the existing builder-site persistence layer.\n`
  + `No credential value is printed.`;

function timestampForFilename(date = new Date()) {
  return date.toISOString().replace(/[:.]/g, '-');
}

async function writePublishedBackup(backupDir, payload, now = new Date()) {
  await mkdir(backupDir, { recursive: true, mode: 0o700 });
  const backupPath = path.join(backupDir, `zh-home-image-${timestampForFilename(now)}.json`);
  await writeFile(backupPath, `${JSON.stringify(payload, null, 2)}\n`, {
    encoding: 'utf8',
    mode: 0o600,
    flag: 'wx',
  });
  return backupPath;
}

async function loadRuntimeDependencies() {
  const persistence = await import('../src/lib/builder/site/persistence.ts');
  const publishedCanvas = await import('../src/lib/builder/site/published-canvas.ts');
  const publish = await import('../src/lib/builder/site/publish.ts');
  const schemas = await import('../src/lib/builder/canvas/types.ts');
  return {
    ...persistence,
    ...publishedCanvas,
    publishPageThroughPipeline: publish.publishPage,
    runPublishChecks: publish.runPublishChecks,
    builderCanvasNodeSchema: schemas.builderCanvasNodeSchema,
    builderCanvasDocumentSchema: schemas.builderCanvasDocumentSchema,
  };
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

function sameRecordGeneration(left, right) {
  if (!left || !right) return left === right;
  return left.record.revision === right.record.revision
    && left.record.savedAt === right.record.savedAt;
}

async function saveGuardedDraft(deps, siteId, pageId, document, capturedDraft) {
  return deps.updatePageCanvasRecord(siteId, pageId, 'draft', (currentState) => {
    if (!sameRecordGeneration(currentState, capturedDraft)) {
      throw new Error('Draft changed after preflight; aborting without publish.');
    }
    return {
      revision: currentState ? currentState.record.revision + 1 : 0,
      savedAt: new Date().toISOString(),
      updatedBy: SCRIPT_UPDATED_BY,
      document,
    };
  });
}

export async function runZhHeroImagePatch(options, deps, io = {}) {
  const stdout = io.stdout ?? process.stdout;
  const site = await deps.readSiteDocument(options.siteId, TARGET_LOCALE);
  const page = findHomePageMeta(site.pages, TARGET_LOCALE);
  const [publishedDocument, publishedState, draftState] = await Promise.all([
    deps.readPublishedPageCanvas(page, options.siteId),
    deps.readPageCanvasRecordState(options.siteId, page.pageId, 'published'),
    deps.readPageCanvasRecordState(options.siteId, page.pageId, 'draft'),
  ]);
  if (!publishedDocument) throw new Error('Published zh-hant home canvas was not found.');

  const sourceValidation = validatePatchedDocument(publishedDocument, deps);
  if (!sourceValidation.ok) {
    throw new Error(
      `Source ${sourceValidation.error}: `
        + `${JSON.stringify(sourceValidation.nodeIssues ?? sourceValidation.documentIssues)}`,
    );
  }

  const plan = planZhHeroImagePatch(publishedDocument);
  stdout.write(`${formatZhHeroImagePatchPlan(plan, options.apply ? 'apply' : 'dry-run')}\n`);
  if (!plan.ok) return { ok: false, applied: false, plan };

  const outputValidation = validatePatchedDocument(plan.document, deps);
  if (!outputValidation.ok) {
    throw new Error(
      `Planned ${outputValidation.error}: `
        + `${JSON.stringify(outputValidation.nodeIssues ?? outputValidation.documentIssues)}`,
    );
  }
  stdout.write(`Schema validation: PASS (${outputValidation.document.nodes.length} nodes)\n`);
  if (!options.apply || plan.changes.length === 0) {
    return { ok: true, applied: false, plan };
  }

  assertDraftCanBeReplaced(page, draftState, publishedState);
  const checks = await deps.runPublishChecks(
    outputValidation.document,
    page.pageId,
    options.siteId,
    TARGET_LOCALE,
  );
  if (!checks.passed) {
    throw new Error(`Publish checks blocked the patch: ${JSON.stringify(checks.errors)}`);
  }

  const backupPath = await writePublishedBackup(options.backupDir, {
    kind: 'zh-home-image-published-backup',
    createdAt: new Date().toISOString(),
    siteId: options.siteId,
    pageId: page.pageId,
    pageMeta: page,
    publishedRecord: publishedState?.record ?? null,
    resolvedPublishedDocument: publishedDocument,
  });
  stdout.write(`Backup written: ${backupPath}\n`);

  const latestPublished = await deps.readPageCanvasRecordState(
    options.siteId,
    page.pageId,
    'published',
  );
  if (!sameRecordGeneration(latestPublished, publishedState)) {
    throw new Error(`Published zh-hant home changed after backup; aborting. Backup kept at ${backupPath}`);
  }

  const draft = await saveGuardedDraft(
    deps,
    options.siteId,
    page.pageId,
    outputValidation.document,
    draftState,
  );
  stdout.write(`Draft saved: revision ${draft.revision}\n`);
  const published = await deps.publishPageThroughPipeline(options.siteId, page.pageId, {
    expectedDraftRevision: draft.revision,
  });
  stdout.write(
    `Published: revision ${published.publishedRevision}, id ${published.publishedRevisionId}\n`,
  );
  return { ok: true, applied: true, plan, backupPath, draft, published };
}

function reexecWithViteNode(argv) {
  const result = spawnSync(
    process.execPath,
    [VITE_NODE_PATH, '--config', VITE_CONFIG_PATH, SCRIPT_PATH, ...argv],
    {
      cwd: REPO_ROOT,
      stdio: 'inherit',
      env: { ...process.env, [VITE_NODE_SENTINEL]: '1' },
    },
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
  const result = await runZhHeroImagePatch(options, deps);
  if (!result.ok) process.exitCode = 1;
}

const isDirectRun = (process.argv[1] && path.resolve(process.argv[1]) === SCRIPT_PATH)
  || process.env[VITE_NODE_SENTINEL] === '1';
if (isDirectRun) {
  main().catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`zh-hant hero image patch aborted: ${message}\n`);
    process.exitCode = 1;
  });
}
