/**
 * F106 — Serverless functions stub model + storage.
 *
 * Stores function records in a dedicated `builder-dev/functions.json`
 * artefact (blob or local file) so they don't bloat the site document
 * and don't fight the page/navigation reconcile machinery.
 *
 * Invocation is a NAIVE sandbox (`new Function(...)`); see `invoke` route.
 * Production-grade isolation (Vercel Sandbox / vm2 / isolated-vm) is a
 * deliberate follow-up.
 */

import { get, put } from '@vercel/blob';
import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const BUILDER_FUNCTION_RUNTIME = 'node-stub' as const;
export type BuilderFunctionRuntime = typeof BUILDER_FUNCTION_RUNTIME;

export interface BuilderServerlessFunction {
  id: string;
  name: string;
  /** URL-safe slug — also used as the public path under /api/builder/dev/functions/<slug>/invoke. */
  slug: string;
  /** User-authored code body. Receives a `ctx` arg: { now, log }. */
  code: string;
  runtime: BuilderFunctionRuntime;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FunctionsStore {
  version: 1;
  functions: BuilderServerlessFunction[];
}

const STORE_PATHNAME = 'builder-dev/functions.json';
const DEFAULT_STORE: FunctionsStore = { version: 1, functions: [] };

function isBlobBackend(): boolean {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
  if (process.env.BUILDER_SITE_BACKEND === 'local') return false;
  if (process.env.NODE_ENV !== 'production' && process.env.BUILDER_USE_BLOB_IN_DEV !== '1') return false;
  return true;
}

function localPath(): string {
  return path.join(process.cwd(), 'runtime-data', 'builder-dev', 'functions.json');
}

export async function readBuilderFunctions(): Promise<BuilderServerlessFunction[]> {
  if (isBlobBackend()) {
    try {
      const result = await get(STORE_PATHNAME, { access: 'private', useCache: false });
      if (result?.statusCode === 200 && result.stream) {
        const text = await new Response(result.stream).text();
        const parsed = JSON.parse(text) as FunctionsStore;
        return Array.isArray(parsed?.functions) ? parsed.functions : [];
      }
    } catch { /* fallthrough */ }
  } else {
    try {
      const text = await readFile(localPath(), 'utf8');
      const parsed = JSON.parse(text) as FunctionsStore;
      return Array.isArray(parsed?.functions) ? parsed.functions : [];
    } catch { /* fallthrough */ }
  }
  return [];
}

export async function saveBuilderFunctions(functions: BuilderServerlessFunction[]): Promise<void> {
  const store: FunctionsStore = { ...DEFAULT_STORE, functions };
  const json = JSON.stringify(store);
  if (isBlobBackend()) {
    await put(STORE_PATHNAME, json, {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
    });
  } else {
    const fp = localPath();
    await mkdir(path.dirname(fp), { recursive: true });
    await writeFile(fp, json, 'utf8');
  }
}

let functionIdCounter = 0;
export function generateBuilderFunctionId(): string {
  functionIdCounter += 1;
  return `fn-${Date.now()}-${functionIdCounter}`;
}

const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{0,63}$/;
const NAME_MAX = 80;
const CODE_MAX = 20000;

export interface FunctionValidationError {
  field: 'name' | 'slug' | 'code';
  message: string;
}

export function validateBuilderFunctionInput(input: {
  name: string;
  slug: string;
  code: string;
}, existing: BuilderServerlessFunction[], ignoreId?: string): FunctionValidationError | null {
  const name = (input.name ?? '').trim();
  const slug = (input.slug ?? '').trim().toLowerCase();
  const code = input.code ?? '';

  if (!name) return { field: 'name', message: 'name is required' };
  if (name.length > NAME_MAX) return { field: 'name', message: `name must be ≤ ${NAME_MAX} chars` };

  if (!slug) return { field: 'slug', message: 'slug is required' };
  if (!SLUG_PATTERN.test(slug)) {
    return { field: 'slug', message: 'slug must be lowercase alphanumerics or hyphens (start with letter/digit)' };
  }
  if (existing.some((fn) => fn.slug === slug && fn.id !== ignoreId)) {
    return { field: 'slug', message: 'slug already exists' };
  }

  if (code.length > CODE_MAX) {
    return { field: 'code', message: `code must be ≤ ${CODE_MAX} chars` };
  }

  return null;
}

export function createBuilderFunction(input: {
  name: string;
  slug: string;
  code: string;
  enabled?: boolean;
}): BuilderServerlessFunction {
  const now = new Date().toISOString();
  return {
    id: generateBuilderFunctionId(),
    name: input.name.trim(),
    slug: input.slug.trim().toLowerCase(),
    code: input.code ?? '',
    runtime: BUILDER_FUNCTION_RUNTIME,
    enabled: input.enabled ?? true,
    createdAt: now,
    updatedAt: now,
  };
}