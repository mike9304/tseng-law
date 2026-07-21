#!/usr/bin/env node
/**
 * Patch the published zh-hant home hero from the current builder-site data.
 *
 * Safety contract:
 * - dry-run is the default and performs no persistence write;
 * - --apply first writes a complete published-document backup, then saves a
 *   guarded draft and calls the existing publishPage pipeline;
 * - hero copy must still contain the exact old h1 or the run aborts;
 * - geometry is copied only for exact, role-compatible node ids. Ambiguous
 *   role candidates are printed but never changed;
 * - zh-hant image sources and text other than the three locked replacements
 *   are never copied from ko.
 *
 * Usage:
 *   node scripts/patch-zh-hero-2026-07-21.mjs
 *   node scripts/patch-zh-hero-2026-07-21.mjs --apply
 *   node scripts/patch-zh-hero-2026-07-21.mjs --site=tseng-law-main-site
 *
 * The plain-node entry point re-executes this file with the repo-local
 * vite-node runtime so the established TypeScript persistence/publish modules
 * can be reused without duplicating their storage format.
 */

import { spawnSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { isDeepStrictEqual } from 'node:util';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

export const OLD_H1 = '以韓語清楚說明台灣法律。';
export const NEW_H1 = '台灣法律，清楚說明。';
export const OLD_SUBTITLE = '精通韓語、日語的團隊協助處理台灣法律議題。';
export const NEW_SUBTITLE = '具備韓國、日本跨境實務經驗的專業團隊，協助處理台灣法律議題。';
export const OLD_TYPING_PHRASE = '台灣唯一韓語法律服務';
export const NEW_TYPING_PHRASE = '台灣、韓國跨境法律的可靠夥伴';

const SCRIPT_UPDATED_BY = 'patch-zh-hero-2026-07-21';
const DEFAULT_SITE_ID = 'tseng-law-main-site';
const TARGET_LOCALE = 'zh-hant';
const SOURCE_LOCALE = 'ko';
const SCRIPT_PATH = fileURLToPath(import.meta.url);
const REPO_ROOT = path.resolve(path.dirname(SCRIPT_PATH), '..');
const DEFAULT_BACKUP_DIR = path.join(REPO_ROOT, 'runtime-data', 'backups');
const VITE_NODE_PATH = path.join(REPO_ROOT, 'node_modules', 'vite-node', 'vite-node.mjs');
const VITE_CONFIG_PATH = path.join(REPO_ROOT, 'vitest.config.ts');
const VITE_NODE_SENTINEL = 'ZH_HERO_PATCH_VITE_NODE';

function isRecord(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function classTokens(node) {
  const value = node?.content?.className;
  return typeof value === 'string' ? value.split(/\s+/).filter(Boolean) : [];
}

function hasClass(node, token) {
  return classTokens(node).includes(token);
}

function isHeroRootCandidate(node) {
  return node?.kind === 'container'
    && (node.id === 'home-hero-root'
      || node?.content?.htmlId === 'hero'
      || (hasClass(node, 'hero') && node?.content?.as === 'section'));
}

function isHeroMediaCandidate(node) {
  return node?.kind === 'container'
    && (node.id === 'home-hero-media'
      || hasClass(node, 'hero-media')
      || node?.content?.label === 'hero media');
}

function isHeroImageCandidate(node, mediaIds) {
  return node?.kind === 'image'
    && (/^home-hero-media-image(?:-\d+)?$/.test(node.id)
      || (typeof node.parentId === 'string' && mediaIds.has(node.parentId)));
}

function summarizeCandidate(node) {
  return {
    id: node.id,
    kind: node.kind,
    parentId: node.parentId,
    className: node?.content?.className,
    label: node?.content?.label,
  };
}

function geometryRoleSpecs(document) {
  const nodes = Array.isArray(document?.nodes) ? document.nodes : [];
  const imageIds = nodes
    .filter((node) => /^home-hero-media-image(?:-\d+)?$/.test(node.id))
    .map((node) => node.id)
    .sort((left, right) => left.localeCompare(right, 'en', { numeric: true }));
  const exactImageIds = imageIds.length > 0 ? imageIds : ['home-hero-media-image'];
  return [
    { role: 'hero-root', exactId: 'home-hero-root', candidate: isHeroRootCandidate },
    { role: 'hero-media', exactId: 'home-hero-media', candidate: isHeroMediaCandidate },
    ...exactImageIds.map((exactId, index) => ({
      role: index === 0 ? 'hero-image-primary' : `hero-image-${index + 1}`,
      exactId,
      candidate: null,
      image: true,
    })),
  ];
}

function roleCandidates(document, spec) {
  const nodes = Array.isArray(document?.nodes) ? document.nodes : [];
  if (spec.image) {
    const mediaIds = new Set(nodes.filter(isHeroMediaCandidate).map((node) => node.id));
    return nodes.filter((node) => isHeroImageCandidate(node, mediaIds));
  }
  return nodes.filter(spec.candidate);
}

function buildHeroNodeIds(document) {
  const nodes = Array.isArray(document?.nodes) ? document.nodes : [];
  const heroIds = new Set(nodes
    .filter((node) => node.id?.startsWith('home-hero') || classTokens(node).some((token) => token.startsWith('hero')))
    .map((node) => node.id));
  let changed = true;
  while (changed) {
    changed = false;
    for (const node of nodes) {
      if (!heroIds.has(node.id) && node.parentId && heroIds.has(node.parentId)) {
        heroIds.add(node.id);
        changed = true;
      }
    }
  }
  return heroIds;
}

function isHeroTitleNode(node, heroIds) {
  if (!heroIds.has(node.id)) return false;
  return node.id === 'home-hero-title'
    || hasClass(node, 'hero-title')
    || node?.content?.as === 'h1'
    || (node.kind === 'heading' && node?.content?.level === 1);
}

function isHeroSubtitleNode(node, heroIds) {
  if (!heroIds.has(node.id)) return false;
  return node.id === 'home-hero-subtitle' || hasClass(node, 'hero-subtitle');
}

function valueAt(object, pathParts) {
  let value = object;
  for (const part of pathParts) {
    if (!isRecord(value) && !Array.isArray(value)) return undefined;
    value = value[part];
  }
  return value;
}

function hasAt(object, pathParts) {
  if (pathParts.length === 0) return true;
  let value = object;
  for (let index = 0; index < pathParts.length - 1; index += 1) {
    if (!isRecord(value) && !Array.isArray(value)) return false;
    value = value[pathParts[index]];
  }
  return (isRecord(value) || Array.isArray(value))
    && Object.prototype.hasOwnProperty.call(value, pathParts[pathParts.length - 1]);
}

function setAt(object, pathParts, nextValue) {
  let parent = object;
  for (let index = 0; index < pathParts.length - 1; index += 1) {
    const key = pathParts[index];
    const current = parent[key];
    if (!isRecord(current) && !Array.isArray(current)) parent[key] = {};
    parent = parent[key];
  }
  const last = pathParts[pathParts.length - 1];
  if (nextValue === undefined) delete parent[last];
  else parent[last] = structuredClone(nextValue);
}

function recordPathChange(node, pathParts, nextValue, changes, reason) {
  const beforeExists = hasAt(node, pathParts);
  const before = valueAt(node, pathParts);
  const afterExists = nextValue !== undefined;
  if (beforeExists === afterExists && isDeepStrictEqual(before, nextValue)) return;
  setAt(node, pathParts, nextValue);
  changes.push({
    nodeId: node.id,
    field: pathParts.join('.'),
    oldValue: before,
    newValue: nextValue,
    reason,
  });
}

function replaceTextPayload(node, oldValue, newValue, changes, reason) {
  if (node?.content?.text === oldValue) {
    recordPathChange(node, ['content', 'text'], newValue, changes, reason);
  }
  if (node?.content?.richText?.plainText === oldValue) {
    recordPathChange(node, ['content', 'richText', 'plainText'], newValue, changes, reason);
  }
  const html = node?.content?.richText?.html;
  if (typeof html === 'string' && html.includes(oldValue)) {
    recordPathChange(
      node,
      ['content', 'richText', 'html'],
      html.split(oldValue).join(newValue),
      changes,
      reason,
    );
  }
}

function replaceExactLeaves(value, oldValue, newValue, pathParts, onReplace) {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => {
      if (entry === oldValue) onReplace([...pathParts, index]);
      else if (isRecord(entry) || Array.isArray(entry)) {
        replaceExactLeaves(entry, oldValue, newValue, [...pathParts, index], onReplace);
      }
    });
    return;
  }
  if (!isRecord(value)) return;
  for (const [key, entry] of Object.entries(value)) {
    if (entry === oldValue) onReplace([...pathParts, key]);
    else if (isRecord(entry) || Array.isArray(entry)) {
      replaceExactLeaves(entry, oldValue, newValue, [...pathParts, key], onReplace);
    }
  }
}

function copyGeometry(source, target, changes, role) {
  for (const field of ['x', 'y', 'width', 'height']) {
    recordPathChange(target, ['rect', field], source.rect[field], changes, `${role} geometry from ko`);
  }
  for (const viewport of ['tablet', 'mobile']) {
    recordPathChange(
      target,
      ['responsive', viewport, 'rect'],
      source?.responsive?.[viewport]?.rect,
      changes,
      `${role} ${viewport} geometry from ko`,
    );
  }
  recordPathChange(
    target,
    ['style', 'borderRadius'],
    source?.style?.borderRadius,
    changes,
    `${role} clipping geometry from ko`,
  );
  if (source.kind === 'image' && target.kind === 'image') {
    recordPathChange(target, ['content', 'fit'], source.content.fit, changes, `${role} object-fit from ko`);
    recordPathChange(
      target,
      ['content', 'focalPoint'],
      source.content.focalPoint,
      changes,
      `${role} object-position from ko`,
    );
  }
}

function widenTitleFromKo(koDocument, titleNode, changes) {
  const koTitle = koDocument.nodes.find((node) => node.id === 'home-hero-title');
  if (!koTitle || !['text', 'heading'].includes(koTitle.kind)) return;
  if (koTitle.rect.width > titleNode.rect.width) {
    recordPathChange(
      titleNode,
      ['rect', 'width'],
      koTitle.rect.width,
      changes,
      'avoid zh-hant h1 orphan line using wider ko title box',
    );
  }
  for (const viewport of ['tablet', 'mobile']) {
    const sourceWidth = koTitle?.responsive?.[viewport]?.rect?.width;
    const targetWidth = titleNode?.responsive?.[viewport]?.rect?.width;
    if (typeof sourceWidth === 'number' && typeof targetWidth === 'number' && sourceWidth > targetWidth) {
      recordPathChange(
        titleNode,
        ['responsive', viewport, 'rect', 'width'],
        sourceWidth,
        changes,
        `avoid zh-hant h1 orphan line at ${viewport}`,
      );
    }
  }
}

/**
 * Pure document planner. It never reads or writes persistence.
 */
export function planZhHeroPatch(zhDocument, koDocument, options = {}) {
  const now = options.now ?? new Date().toISOString();
  const original = structuredClone(zhDocument);
  const document = structuredClone(zhDocument);
  const changes = [];
  const warnings = [];
  const geometryCandidates = [];
  const nodes = Array.isArray(document?.nodes) ? document.nodes : [];
  const heroIds = buildHeroNodeIds(document);
  const titleMatches = nodes.filter((node) => (
    node?.content?.text === OLD_H1 && isHeroTitleNode(node, heroIds)
  ));

  if (titleMatches.length !== 1) {
    return {
      ok: false,
      error: titleMatches.length === 0
        ? `Required zh-hant hero h1 was not found: ${OLD_H1}`
        : `Required zh-hant hero h1 is ambiguous (${titleMatches.length} matches).`,
      document: original,
      changes: [],
      warnings,
      geometryCandidates,
    };
  }

  const titleNode = titleMatches[0];
  replaceTextPayload(titleNode, OLD_H1, NEW_H1, changes, 'locked zh-hant h1 replacement');
  widenTitleFromKo(koDocument, titleNode, changes);

  const subtitleMatches = nodes.filter((node) => (
    node?.content?.text === OLD_SUBTITLE && isHeroSubtitleNode(node, heroIds)
  ));
  if (subtitleMatches.length === 1) {
    replaceTextPayload(
      subtitleMatches[0],
      OLD_SUBTITLE,
      NEW_SUBTITLE,
      changes,
      'locked zh-hant subtitle replacement',
    );
  } else if (subtitleMatches.length > 1) {
    warnings.push(`Subtitle replacement skipped: ${subtitleMatches.length} hero candidates were found.`);
  }

  for (const node of nodes.filter((candidate) => heroIds.has(candidate.id))) {
    replaceExactLeaves(node.content, OLD_TYPING_PHRASE, NEW_TYPING_PHRASE, ['content'], (pathParts) => {
      recordPathChange(
        node,
        pathParts,
        NEW_TYPING_PHRASE,
        changes,
        'locked zh-hant typing phrase replacement',
      );
    });
  }

  const koNodes = Array.isArray(koDocument?.nodes) ? koDocument.nodes : [];
  for (const spec of geometryRoleSpecs(koDocument)) {
    const source = koNodes.find((node) => node.id === spec.exactId);
    const target = nodes.find((node) => node.id === spec.exactId);
    if (source && target && source.kind === target.kind) {
      copyGeometry(source, target, changes, spec.role);
      continue;
    }

    const sourceCandidates = roleCandidates(koDocument, spec).map(summarizeCandidate);
    const targetCandidates = roleCandidates(document, spec).map(summarizeCandidate);
    geometryCandidates.push({
      role: spec.role,
      expectedNodeId: spec.exactId,
      sourceCandidates,
      targetCandidates,
      reason: !source
        ? 'ko exact-id node missing'
        : !target
          ? 'zh-hant exact-id node missing'
          : `kind mismatch (${source.kind} vs ${target.kind})`,
    });
    warnings.push(
      `${spec.role} geometry skipped: exact role-compatible id ${spec.exactId} was not available.`,
    );
  }

  document.updatedAt = now;
  document.updatedBy = SCRIPT_UPDATED_BY;
  return { ok: true, document, changes, warnings, geometryCandidates };
}

export function findHomePageMeta(pages, locale) {
  const direct = (Array.isArray(pages) ? pages : []).filter((page) => (
    page?.locale === locale && (page.isHomePage === true || page.slug === '')
  ));
  if (direct.length !== 1) {
    throw new Error(`Expected exactly one ${locale} home page; found ${direct.length}.`);
  }
  return direct[0];
}

export function validatePatchedDocument(document, schemas) {
  const nodeIssues = [];
  for (const node of document?.nodes ?? []) {
    const parsed = schemas.builderCanvasNodeSchema.safeParse(node);
    if (!parsed.success) {
      nodeIssues.push({
        nodeId: node?.id ?? '(missing id)',
        issues: parsed.error.issues.slice(0, 5).map((issue) => ({
          path: issue.path.join('.'),
          code: issue.code,
          message: issue.message,
        })),
      });
    }
  }
  if (nodeIssues.length > 0) {
    return { ok: false, error: 'builderCanvasNodeSchema validation failed', nodeIssues };
  }
  const parsedDocument = schemas.builderCanvasDocumentSchema.safeParse(document);
  if (!parsedDocument.success) {
    return {
      ok: false,
      error: 'builderCanvasDocumentSchema validation failed',
      documentIssues: parsedDocument.error.issues.slice(0, 10).map((issue) => ({
        path: issue.path.join('.'),
        code: issue.code,
        message: issue.message,
      })),
    };
  }
  return { ok: true, document: parsedDocument.data };
}

function formatValue(value) {
  if (value === undefined) return '∅';
  const serialized = typeof value === 'string' ? JSON.stringify(value) : JSON.stringify(value);
  return serialized.length > 180 ? `${serialized.slice(0, 177)}...` : serialized;
}

export function formatPatchPlan(plan, mode = 'dry-run') {
  const lines = [
    `=== zh-hant home hero patch (${mode === 'apply' ? 'APPLY' : 'DRY RUN'}) ===`,
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
  for (const warning of plan.warnings) lines.push(`WARNING: ${warning}`);
  for (const candidate of plan.geometryCandidates) {
    lines.push(
      `CANDIDATES ONLY: ${candidate.role} (${candidate.reason})`,
      `    ko: ${formatValue(candidate.sourceCandidates)}`,
      `    zh-hant: ${formatValue(candidate.targetCandidates)}`,
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

const HELP = `Usage: node scripts/patch-zh-hero-2026-07-21.mjs [options]\n\n`
  + `Options:\n`
  + `  --dry-run             Read and print the plan only (default).\n`
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
  const backupPath = path.join(backupDir, `zh-home-${timestampForFilename(now)}.json`);
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

export async function runZhHeroPatch(options, deps, io = {}) {
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

  const plan = planZhHeroPatch(zhDocument, koDocument);
  stdout.write(`${formatPatchPlan(plan, options.apply ? 'apply' : 'dry-run')}\n`);
  if (!plan.ok) return { ok: false, applied: false, plan };

  const validated = validatePatchedDocument(plan.document, deps);
  if (!validated.ok) {
    throw new Error(`${validated.error}: ${JSON.stringify(validated.nodeIssues ?? validated.documentIssues)}`);
  }
  stdout.write(`Schema validation: PASS (${validated.document.nodes.length} nodes)\n`);
  if (!options.apply) return { ok: true, applied: false, plan };

  assertDraftCanBeReplaced(zhPage, zhDraftState, zhPublishedState);
  const checks = await deps.runPublishChecks(
    validated.document,
    zhPage.pageId,
    options.siteId,
    TARGET_LOCALE,
  );
  if (!checks.passed) {
    throw new Error(`Publish checks blocked the patch: ${JSON.stringify(checks.errors)}`);
  }

  const backupPath = await writePublishedBackup(options.backupDir, {
    kind: 'zh-home-published-backup',
    createdAt: new Date().toISOString(),
    siteId: options.siteId,
    pageId: zhPage.pageId,
    pageMeta: zhPage,
    publishedRecord: zhPublishedState?.record ?? null,
    resolvedPublishedDocument: zhDocument,
  });
  stdout.write(`Backup written: ${backupPath}\n`);

  const latestPublished = await deps.readPageCanvasRecordState(
    options.siteId,
    zhPage.pageId,
    'published',
  );
  if (!sameRecordGeneration(latestPublished, zhPublishedState)) {
    throw new Error(`Published zh-hant home changed after backup; aborting. Backup kept at ${backupPath}`);
  }

  const draft = await saveGuardedDraft(
    deps,
    options.siteId,
    zhPage.pageId,
    validated.document,
    zhDraftState,
  );
  stdout.write(`Draft saved: revision ${draft.revision}\n`);
  const published = await deps.publishPageThroughPipeline(options.siteId, zhPage.pageId, {
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
  const result = await runZhHeroPatch(options, deps);
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
    process.stderr.write(`zh-hant hero patch aborted: ${message}\n`);
    process.exitCode = 1;
  });
}
