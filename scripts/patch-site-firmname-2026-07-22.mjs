#!/usr/bin/env node
/**
 * Patch the builder-site settings record so the firm name reads
 * "법무법인 호정" instead of the retired brand "호정국제".
 *
 * Why: published pages derive og:site_name from
 * `settings.firmName || site.name` (src/lib/builder/site/public-page.tsx),
 * and the persisted settings record still carries the old firmName. The
 * WebSite JSON-LD (lib/seo.ts) is already correct; only this Blob/Postgres
 * settings value is stale.
 *
 * Safety contract:
 * - dry-run is the default and performs no persistence write;
 * - only `settings.firmName` is changed, and only when it currently contains
 *   the old brand marker "호정국제" (so an empty local backend — whose default
 *   document has no settings.firmName — safely makes zero changes);
 * - every other string leaf containing "호정국제" (site.name, localized
 *   overrides, seoChecklist.businessName, …) is reported but never changed;
 * - --apply re-reads the latest record, re-plans against it, writes a full
 *   settings-record backup to runtime-data/backups/site-settings-<ts>.json,
 *   validates the patched settings against the live settings schema, guards
 *   against a concurrent firmName edit, then saves via the existing
 *   writeSiteDocument pipeline (which preserves concurrent page/nav edits).
 *
 * Usage:
 *   node scripts/patch-site-firmname-2026-07-22.mjs
 *   node scripts/patch-site-firmname-2026-07-22.mjs --apply
 *   node scripts/patch-site-firmname-2026-07-22.mjs --site=tseng-law-main-site
 *
 * The plain-node entry point re-executes this file with the repo-local
 * vite-node runtime so the established TypeScript persistence/schema modules
 * can be reused without duplicating their storage format.
 */

import { spawnSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

export const OLD_BRAND_MARKER = '호정국제';
export const NEW_FIRM_NAME = '법무법인 호정';

const SCRIPT_UPDATED_BY = 'patch-site-firmname-2026-07-22';
const DEFAULT_SITE_ID = 'tseng-law-main-site';
// Settings live on the site document root; the locale only picks the default
// shape when no record exists, so any locale reads the same settings.
const READ_LOCALE = 'ko';
const SCRIPT_PATH = fileURLToPath(import.meta.url);
const REPO_ROOT = path.resolve(path.dirname(SCRIPT_PATH), '..');
const DEFAULT_BACKUP_DIR = path.join(REPO_ROOT, 'runtime-data', 'backups');
const VITE_NODE_PATH = path.join(REPO_ROOT, 'node_modules', 'vite-node', 'vite-node.mjs');
const VITE_CONFIG_PATH = path.join(REPO_ROOT, 'vitest.config.ts');
const VITE_NODE_SENTINEL = 'SITE_FIRMNAME_PATCH_VITE_NODE';

function isRecord(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Deeply scan a value for string leaves that contain the old brand marker.
 * Returns a list of { path, value } for reporting. Pure; no persistence.
 */
export function collectBrandFindings(root, marker = OLD_BRAND_MARKER) {
  const findings = [];
  const walk = (value, parts) => {
    if (typeof value === 'string') {
      if (value.includes(marker)) findings.push({ path: parts.join('.'), value });
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((entry, index) => walk(entry, [...parts, String(index)]));
      return;
    }
    if (isRecord(value)) {
      for (const [key, entry] of Object.entries(value)) walk(entry, [...parts, key]);
    }
  };
  walk(root, []);
  return findings;
}

/**
 * Pure planner. Given a site document, decide the firmName change (if any) and
 * collect brand findings. Never reads or writes persistence.
 */
export function planFirmNamePatch(siteDocument, options = {}) {
  const now = options.now ?? new Date().toISOString();
  const marker = options.marker ?? OLD_BRAND_MARKER;
  const newFirmName = options.newFirmName ?? NEW_FIRM_NAME;
  const document = structuredClone(siteDocument);
  const changes = [];
  const warnings = [];

  const brandFindings = collectBrandFindings(document, marker);

  const currentFirmName = document?.settings?.firmName;
  if (typeof currentFirmName === 'string' && currentFirmName.includes(marker)) {
    if (currentFirmName !== newFirmName) {
      document.settings.firmName = newFirmName;
      changes.push({
        path: 'settings.firmName',
        oldValue: currentFirmName,
        newValue: newFirmName,
        reason: 'retired brand firmName replacement',
      });
    }
  } else if (typeof currentFirmName === 'string' && currentFirmName.length > 0) {
    // firmName is set to something without the old marker — leave it.
  } else {
    // No settings.firmName carrying the old brand. og:site_name may still be
    // falling back to site.name; that is reported (not changed) below.
    warnings.push(
      'settings.firmName does not contain the old brand marker; no firmName write planned. '
        + 'If a brand finding lists site.name, og:site_name is falling back to it — decide a follow-up.',
    );
  }

  if (changes.length > 0) {
    document.updatedAt = now;
  }

  return { ok: true, document, changes, brandFindings, warnings };
}

function formatValue(value) {
  if (value === undefined) return '∅';
  const serialized = JSON.stringify(value);
  return serialized.length > 200 ? `${serialized.slice(0, 197)}...` : serialized;
}

export function formatPatchPlan(plan, mode = 'dry-run') {
  const lines = [
    `=== site settings firmName patch (${mode === 'apply' ? 'APPLY' : 'DRY RUN'}) ===`,
  ];
  if (plan.changes.length === 0) {
    lines.push('No firmName change planned.');
  }
  for (const change of plan.changes) {
    lines.push(
      `- ${change.path}`,
      `    ${formatValue(change.oldValue)} -> ${formatValue(change.newValue)}`,
      `    reason: ${change.reason}`,
    );
  }
  if (plan.brandFindings.length === 0) {
    lines.push('Brand scan: no "호정국제" string leaves found in the record.');
  } else {
    lines.push(`Brand scan: ${plan.brandFindings.length} field(s) still contain "호정국제":`);
    for (const finding of plan.brandFindings) {
      const flagged = finding.path === 'settings.firmName' ? ' (patched above)' : ' (reported only)';
      lines.push(`    ${finding.path}: ${formatValue(finding.value)}${flagged}`);
    }
  }
  for (const warning of plan.warnings) lines.push(`WARNING: ${warning}`);
  if (mode !== 'apply') lines.push('Dry-run complete; no persistence write was attempted.');
  return lines.join('\n');
}

export function parseArgs(argv) {
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

const HELP = `Usage: node scripts/patch-site-firmname-2026-07-22.mjs [options]\n\n`
  + `Options:\n`
  + `  --dry-run             Read and print the plan only (default).\n`
  + `  --apply               Back up, then write the firmName change.\n`
  + `  --site=<siteId>       Builder site id (default: ${DEFAULT_SITE_ID}).\n`
  + `  --backup-dir=<path>   Backup directory (default: runtime-data/backups).\n`
  + `  --help                Show this help.\n\n`
  + `Only settings.firmName is changed, and only when it contains "${OLD_BRAND_MARKER}".\n`
  + `Storage selection is delegated to the existing builder-site persistence layer.\n`
  + `No credential value is printed.`;

function timestampForFilename(date = new Date()) {
  return date.toISOString().replace(/[:.]/g, '-');
}

async function writeSettingsBackup(backupDir, payload, now = new Date()) {
  await mkdir(backupDir, { recursive: true, mode: 0o700 });
  const backupPath = path.join(backupDir, `site-settings-${timestampForFilename(now)}.json`);
  await writeFile(backupPath, `${JSON.stringify(payload, null, 2)}\n`, {
    encoding: 'utf8',
    mode: 0o600,
    flag: 'wx',
  });
  return backupPath;
}

async function loadRuntimeDependencies() {
  const persistence = await import('../src/lib/builder/site/persistence.ts');
  const schema = await import('../src/app/api/builder/site/settings/route-schema.ts');
  return {
    readSiteDocument: persistence.readSiteDocument,
    writeSiteDocument: persistence.writeSiteDocument,
    settingsPayloadSchema: schema.settingsPayloadSchema,
  };
}

function validatePatchedSettings(settings, deps) {
  const firmName = settings?.firmName;
  if (typeof firmName !== 'string' || firmName.trim().length === 0) {
    return { ok: false, error: 'Patched firmName must be a non-empty string.' };
  }
  if (firmName.length > 200) {
    return { ok: false, error: 'Patched firmName exceeds the 200-character settings limit.' };
  }
  const parsed = deps.settingsPayloadSchema.safeParse({ settings });
  if (!parsed.success) {
    return {
      ok: false,
      error: 'settingsPayloadSchema validation failed',
      issues: parsed.error.issues.slice(0, 10).map((issue) => ({
        path: issue.path.join('.'),
        code: issue.code,
        message: issue.message,
      })),
    };
  }
  return { ok: true };
}

export async function runFirmNamePatch(options, deps, io = {}) {
  const stdout = io.stdout ?? process.stdout;

  const initial = await deps.readSiteDocument(options.siteId, READ_LOCALE);
  const plan = planFirmNamePatch(initial);
  stdout.write(`${formatPatchPlan(plan, options.apply ? 'apply' : 'dry-run')}\n`);

  if (plan.changes.length === 0) {
    stdout.write('Nothing to write (no firmName carrying the old brand). Exiting safely.\n');
    return { ok: true, applied: false, plan };
  }
  if (!options.apply) return { ok: true, applied: false, plan };

  // Re-read and re-plan against the latest record so a concurrent settings
  // edit is preserved and a concurrent firmName fix is detected.
  const latest = await deps.readSiteDocument(options.siteId, READ_LOCALE);
  const latestPlan = planFirmNamePatch(latest);
  if (latestPlan.changes.length === 0) {
    stdout.write('firmName was already corrected by another writer; nothing to apply.\n');
    return { ok: true, applied: false, plan: latestPlan };
  }

  const validation = validatePatchedSettings(latestPlan.document.settings, deps);
  if (!validation.ok) {
    throw new Error(`${validation.error}: ${JSON.stringify(validation.issues ?? '')}`);
  }
  stdout.write('Schema validation: PASS\n');

  const backupPath = await writeSettingsBackup(options.backupDir, {
    kind: 'site-settings-backup',
    createdAt: new Date().toISOString(),
    siteId: options.siteId,
    firmNameBefore: latest?.settings?.firmName ?? null,
    siteDocument: latest,
  });
  stdout.write(`Backup written: ${backupPath}\n`);

  await deps.writeSiteDocument(latestPlan.document);

  const verify = await deps.readSiteDocument(options.siteId, READ_LOCALE);
  if (verify?.settings?.firmName !== NEW_FIRM_NAME) {
    throw new Error(
      `Post-write verification failed: firmName is ${JSON.stringify(verify?.settings?.firmName)}. `
        + `Backup kept at ${backupPath}`,
    );
  }
  stdout.write(`Applied: settings.firmName is now ${JSON.stringify(NEW_FIRM_NAME)}.\n`);
  return { ok: true, applied: true, plan: latestPlan, backupPath };
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
  const result = await runFirmNamePatch(options, deps);
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
    process.stderr.write(`site firmName patch aborted: ${message}\n`);
    process.exitCode = 1;
  });
}
