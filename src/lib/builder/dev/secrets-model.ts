/**
 * F112 — Builder secret model + encrypted storage.
 *
 * Secrets are stored at `runtime-data/dev/secrets.json` and encrypted at
 * rest with AES-256-GCM. The key-encryption-key (KEK) comes from
 * `BUILDER_SECRET_KEK`; if absent we fall back to `NEXTAUTH_SECRET` so
 * developer environments still work without extra setup.
 *
 * Each secret's encrypted payload is stored as `ivBase64:tagBase64:ctBase64`.
 * IVs are randomized per encrypt, the auth tag protects integrity.
 *
 * NOTE: plaintext NEVER leaves this module except through
 * `decryptSecret(...)`. The store layer (secrets-store.ts) is the only
 * caller responsible for guarding access.
 */

import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';

export type BuilderSecretScope = 'site' | 'function';

export interface BuilderSecret {
  id: string;
  /** Stable lookup key — uppercased letters/digits/underscores. */
  key: string;
  /** Opaque encrypted payload (`iv:tag:ct` base64). */
  encryptedValue: string;
  /** ISO timestamp of last rotation (or initial creation). */
  lastRotatedAt: string;
  /** Auth subject that created or last rotated the secret. */
  addedBy: string;
  scope: BuilderSecretScope;
  /** When scope === 'function', the function slugs allowed to read it. */
  allowedFunctions?: string[];
  createdAt: string;
}

const KEY_PATTERN = /^[A-Z][A-Z0-9_]{0,63}$/;

export interface SecretValidationError {
  field: 'key' | 'value' | 'scope' | 'allowedFunctions';
  message: string;
}

export function validateSecretInput(input: {
  key: string;
  value: string;
  scope: BuilderSecretScope;
  allowedFunctions?: string[];
}): SecretValidationError | null {
  const key = (input.key ?? '').trim();
  if (!key) return { field: 'key', message: 'key is required' };
  if (!KEY_PATTERN.test(key)) {
    return { field: 'key', message: 'key must be uppercase letters/digits/underscore (start with a letter)' };
  }
  if (!input.value) return { field: 'value', message: 'value is required' };
  if (input.value.length > 8192) return { field: 'value', message: 'value must be ≤ 8192 chars' };

  if (input.scope !== 'site' && input.scope !== 'function') {
    return { field: 'scope', message: "scope must be 'site' or 'function'" };
  }

  if (input.scope === 'function') {
    const list = input.allowedFunctions ?? [];
    if (list.length === 0) {
      return { field: 'allowedFunctions', message: 'function-scoped secret requires at least one function slug' };
    }
    if (list.some((slug) => typeof slug !== 'string' || !slug.trim())) {
      return { field: 'allowedFunctions', message: 'function slugs must be non-empty strings' };
    }
  }

  return null;
}

function resolveKek(): Buffer {
  const raw = process.env.BUILDER_SECRET_KEK || process.env.NEXTAUTH_SECRET || '';
  if (!raw) {
    throw new Error('Builder secrets require BUILDER_SECRET_KEK or NEXTAUTH_SECRET to be set.');
  }
  return createHash('sha256').update(raw, 'utf8').digest();
}

export function encryptSecret(plaintext: string): string {
  if (typeof plaintext !== 'string') throw new TypeError('plaintext must be a string');
  const key = resolveKek();
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const ct = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('base64')}:${tag.toString('base64')}:${ct.toString('base64')}`;
}

export function decryptSecret(encrypted: string): string {
  const parts = encrypted.split(':');
  if (parts.length !== 3) {
    throw new Error('Encrypted secret is malformed.');
  }
  const [ivB64, tagB64, ctB64] = parts;
  const iv = Buffer.from(ivB64, 'base64');
  const tag = Buffer.from(tagB64, 'base64');
  const ct = Buffer.from(ctB64, 'base64');
  if (iv.length !== 12) throw new Error('Encrypted secret has an invalid IV.');
  if (tag.length !== 16) throw new Error('Encrypted secret has an invalid auth tag.');
  const key = resolveKek();
  const decipher = createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const pt = Buffer.concat([decipher.update(ct), decipher.final()]);
  return pt.toString('utf8');
}

let secretIdCounter = 0;
export function generateSecretId(): string {
  secretIdCounter += 1;
  return `sec-${Date.now()}-${secretIdCounter}`;
}

export function buildSecret(input: {
  key: string;
  value: string;
  scope: BuilderSecretScope;
  allowedFunctions?: string[];
  addedBy: string;
}): BuilderSecret {
  const now = new Date().toISOString();
  const allowedFunctions = input.scope === 'function'
    ? (input.allowedFunctions ?? []).map((slug) => slug.trim().toLowerCase()).filter(Boolean)
    : undefined;
  return {
    id: generateSecretId(),
    key: input.key.trim(),
    encryptedValue: encryptSecret(input.value),
    lastRotatedAt: now,
    addedBy: input.addedBy,
    scope: input.scope,
    allowedFunctions,
    createdAt: now,
  };
}

/** Strip the encrypted value before returning to the client. */
export interface BuilderSecretMetadata {
  id: string;
  key: string;
  scope: BuilderSecretScope;
  allowedFunctions?: string[];
  lastRotatedAt: string;
  createdAt: string;
  addedBy: string;
}

export function toSecretMetadata(secret: BuilderSecret): BuilderSecretMetadata {
  return {
    id: secret.id,
    key: secret.key,
    scope: secret.scope,
    allowedFunctions: secret.allowedFunctions,
    lastRotatedAt: secret.lastRotatedAt,
    createdAt: secret.createdAt,
    addedBy: secret.addedBy,
  };
}

export interface SecretsStoreFile {
  version: 1;
  secrets: BuilderSecret[];
}

export const SECRETS_STORE_VERSION = 1 as const;