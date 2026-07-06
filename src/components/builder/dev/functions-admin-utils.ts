import type { BuilderFunctionRecord } from './functions-admin-types';

const DEFAULT_CODE = [
  'ctx.log("Function invoked", ctx.now());',
  'return { ok: true, timestamp: ctx.now() };',
].join('\n');

export function createEmptyFunctionDraft(): BuilderFunctionRecord {
  const now = new Date().toISOString();
  return {
    id: '',
    name: 'New function',
    slug: `custom-${Date.now().toString(36)}`,
    code: DEFAULT_CODE,
    runtime: 'node-stub',
    enabled: true,
    createdAt: now,
    updatedAt: now,
  };
}

export function formatFunctionResult(value: unknown): string {
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}
