import { chmod, mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

const ACTION_ITEM_METADATA = Symbol('handoffBlockersActionItemMetadata');

export function actionItemMetadata({ code, category, owner, requiresSecret, missing = [] }) {
  return {
    code,
    category,
    owner,
    requiresSecret,
    missing: [...missing],
  };
}

export function addResult(results, status, line, ok, actionItemMeta) {
  const result = { status, line: `${status} ${line}`, ok };
  if (actionItemMeta) {
    Object.defineProperty(result, ACTION_ITEM_METADATA, {
      value: actionItemMeta,
      enumerable: false,
    });
  }
  results.push(result);
}

export function countsFor(results) {
  return {
    open: results.filter((result) => !result.ok && result.status === 'OPEN').length,
    fail: results.filter((result) => !result.ok && result.status === 'FAIL').length,
    warn: results.filter((result) => result.status === 'WARN').length,
  };
}

export function payloadFor(baseUrl, results) {
  const counts = countsFor(results);
  return {
    ok: counts.open === 0 && counts.fail === 0,
    baseUrl,
    counts,
    results,
  };
}

export function payloadWithMetadata(payload, args, generatedAt, effectiveExitCode) {
  return {
    ...payload,
    actionItems: actionItemsFor(payload.results),
    generatedAt,
    softOpen: args.softOpen,
    effectiveExitCode,
  };
}

function actionItemFor(result) {
  const meta = result[ACTION_ITEM_METADATA] || {};
  return {
    status: result.status,
    line: result.line,
    code: meta.code || 'unknown',
    category: meta.category || 'unknown',
    owner: meta.owner || 'developer',
    requiresSecret: meta.requiresSecret || false,
    missing: Array.isArray(meta.missing) ? [...meta.missing] : [],
  };
}

export function actionItemsFor(results) {
  return {
    open: results
      .filter((result) => result.status === 'OPEN' && !result.ok)
      .map(actionItemFor),
    warn: results
      .filter((result) => result.status === 'WARN')
      .map(actionItemFor),
  };
}

export function printHuman(payload) {
  for (const result of payload.results) {
    console.log(result.line);
  }
  console.log(
    `${payload.ok ? 'PASS' : 'FAIL'} handoff blocker gate: ${payload.counts.open} open, ${payload.counts.fail} fail, ${payload.counts.warn} warn`,
  );
}

export function printJson(payload) {
  console.log(JSON.stringify(payload));
}

function outputErrorFor(error) {
  const code = typeof error?.code === 'string' ? ` (${error.code})` : '';
  return new Error(`--output write failed${code}`);
}

export async function writeJsonOutput(path, payload) {
  try {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, `${JSON.stringify(payload, null, 2)}\n`, { mode: 0o600 });
    await chmod(path, 0o600);
  } catch (error) {
    throw outputErrorFor(error);
  }
}

export function exitCodeFor(payload, args) {
  if (payload.counts.fail > 0) return 1;
  if (payload.counts.open > 0) return args.softOpen ? 0 : 1;
  return 0;
}
