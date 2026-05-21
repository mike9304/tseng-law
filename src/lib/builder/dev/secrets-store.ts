/**
 * F112 — Builder secret store.
 *
 * File-backed at `runtime-data/dev/secrets.json` (local) or
 * `builder-dev/secrets.json` on Vercel Blob (production). Metadata-only
 * lists, one-time plaintext on create/rotate, function-scoped read gate.
 */

import { get, put } from '@vercel/blob';
import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';
import {
  buildSecret,
  decryptSecret,
  encryptSecret,
  toSecretMetadata,
  validateSecretInput,
  type BuilderSecret,
  type BuilderSecretMetadata,
  type BuilderSecretScope,
  type SecretValidationError,
  type SecretsStoreFile,
} from '@/lib/builder/dev/secrets-model';

const STORE_PATHNAME = 'builder-dev/secrets.json';
const DEFAULT_STORE: SecretsStoreFile = { version: 1, secrets: [] };

function isBlobBackend(): boolean {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
  if (process.env.BUILDER_SITE_BACKEND === 'local') return false;
  if (process.env.NODE_ENV !== 'production' && process.env.BUILDER_USE_BLOB_IN_DEV !== '1') return false;
  return true;
}

function localPath(): string {
  return path.join(process.cwd(), 'runtime-data', 'dev', 'secrets.json');
}

async function readAll(): Promise<BuilderSecret[]> {
  if (isBlobBackend()) {
    try {
      const result = await get(STORE_PATHNAME, { access: 'private', useCache: false });
      if (result?.statusCode === 200 && result.stream) {
        const text = await new Response(result.stream).text();
        const parsed = JSON.parse(text) as SecretsStoreFile;
        return Array.isArray(parsed?.secrets) ? parsed.secrets : [];
      }
    } catch { /* fallthrough */ }
  } else {
    try {
      const text = await readFile(localPath(), 'utf8');
      const parsed = JSON.parse(text) as SecretsStoreFile;
      return Array.isArray(parsed?.secrets) ? parsed.secrets : [];
    } catch { /* fallthrough */ }
  }
  return [];
}

async function writeAll(secrets: BuilderSecret[]): Promise<void> {
  const store: SecretsStoreFile = { ...DEFAULT_STORE, secrets };
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

export async function listSecrets(): Promise<BuilderSecretMetadata[]> {
  const secrets = await readAll();
  return secrets.map(toSecretMetadata);
}

export interface CreateSecretInput {
  key: string;
  value: string;
  scope: BuilderSecretScope;
  allowedFunctions?: string[];
  addedBy: string;
}

export interface CreateSecretResult {
  secret: BuilderSecretMetadata;
  /** Plaintext, returned ONCE on create. UI must show then dispose. */
  plaintext: string;
}

export class SecretValidationFailure extends Error {
  readonly issue: SecretValidationError;
  constructor(issue: SecretValidationError) {
    super(`${issue.field}: ${issue.message}`);
    this.issue = issue;
  }
}

export class SecretNotFoundError extends Error {
  constructor(id: string) {
    super(`Secret not found: ${id}`);
  }
}

export class SecretAccessDeniedError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export async function createSecret(input: CreateSecretInput): Promise<CreateSecretResult> {
  const issue = validateSecretInput(input);
  if (issue) throw new SecretValidationFailure(issue);

  const existing = await readAll();
  if (existing.some((entry) => entry.key === input.key.trim())) {
    throw new SecretValidationFailure({ field: 'key', message: 'key already exists' });
  }

  const secret = buildSecret(input);
  await writeAll([...existing, secret]);
  return { secret: toSecretMetadata(secret), plaintext: input.value };
}

export interface RotateSecretResult {
  secret: BuilderSecretMetadata;
  plaintext: string;
}

export async function rotateSecret(id: string, nextValue: string, addedBy: string): Promise<RotateSecretResult> {
  if (typeof nextValue !== 'string' || nextValue.length === 0) {
    throw new SecretValidationFailure({ field: 'value', message: 'value is required' });
  }
  if (nextValue.length > 8192) {
    throw new SecretValidationFailure({ field: 'value', message: 'value must be ≤ 8192 chars' });
  }
  const list = await readAll();
  const index = list.findIndex((entry) => entry.id === id);
  if (index === -1) throw new SecretNotFoundError(id);

  const merged: BuilderSecret = {
    ...list[index],
    encryptedValue: encryptSecret(nextValue),
    lastRotatedAt: new Date().toISOString(),
    addedBy,
  };
  const next = [...list];
  next[index] = merged;
  await writeAll(next);
  return { secret: toSecretMetadata(merged), plaintext: nextValue };
}

export async function revokeSecret(id: string): Promise<boolean> {
  const list = await readAll();
  const next = list.filter((entry) => entry.id !== id);
  if (next.length === list.length) return false;
  await writeAll(next);
  return true;
}

export async function updateSecretAllowedFunctions(id: string, allowedFunctions: string[]): Promise<BuilderSecretMetadata> {
  const list = await readAll();
  const index = list.findIndex((entry) => entry.id === id);
  if (index === -1) throw new SecretNotFoundError(id);
  if (list[index].scope !== 'function') {
    throw new SecretValidationFailure({ field: 'scope', message: 'only function-scoped secrets accept allowedFunctions' });
  }
  const next = [...list];
  next[index] = {
    ...list[index],
    allowedFunctions: allowedFunctions.map((slug) => slug.trim().toLowerCase()).filter(Boolean),
  };
  await writeAll(next);
  return toSecretMetadata(next[index]);
}

/**
 * Read the plaintext for a secret by lookup key.
 *
 * `requestingFunctionSlug` MUST be supplied for invocation context.
 * - Site-scoped secrets: any caller can read.
 * - Function-scoped secrets: caller must be in allowedFunctions.
 *
 * Throws `SecretNotFoundError` when the key is absent.
 * Throws `SecretAccessDeniedError` when scope rules deny access.
 */
export async function readSecretPlaintext(
  key: string,
  requestingFunctionSlug?: string,
): Promise<string> {
  const list = await readAll();
  const secret = list.find((entry) => entry.key === key);
  if (!secret) throw new SecretNotFoundError(key);

  if (secret.scope === 'function') {
    if (!requestingFunctionSlug) {
      throw new SecretAccessDeniedError(`Secret '${key}' is function-scoped — caller must declare its function slug.`);
    }
    const allowed = secret.allowedFunctions ?? [];
    if (!allowed.includes(requestingFunctionSlug)) {
      throw new SecretAccessDeniedError(`Function '${requestingFunctionSlug}' is not allowed to read secret '${key}'.`);
    }
  }
  return decryptSecret(secret.encryptedValue);
}

/** Test/admin-only helper. Reveals plaintext by id without scope check. */
export async function readSecretPlaintextById(id: string): Promise<string> {
  const list = await readAll();
  const secret = list.find((entry) => entry.id === id);
  if (!secret) throw new SecretNotFoundError(id);
  return decryptSecret(secret.encryptedValue);
}