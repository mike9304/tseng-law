import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { rm } from 'fs/promises';
import path from 'path';
import {
  decryptSecret,
  encryptSecret,
  validateSecretInput,
} from '@/lib/builder/dev/secrets-model';
import {
  createSecret,
  listSecrets,
  readSecretPlaintext,
  revokeSecret,
  rotateSecret,
  SecretAccessDeniedError,
  SecretNotFoundError,
  SecretValidationFailure,
} from '@/lib/builder/dev/secrets-store';

const SECRETS_FILE = path.join(process.cwd(), 'runtime-data', 'dev', 'secrets.json');

async function cleanStore() {
  try {
    await rm(SECRETS_FILE, { force: true });
  } catch { /* ignore */ }
}

describe('secrets-model encryption', () => {
  beforeEach(() => {
    process.env.BUILDER_SECRET_KEK = 'unit-test-kek-do-not-use-elsewhere';
  });

  it('round-trips plaintext through encrypt/decrypt', () => {
    const ct = encryptSecret('hello world');
    expect(ct).not.toContain('hello');
    expect(decryptSecret(ct)).toBe('hello world');
  });

  it('produces a different ciphertext on every encrypt (random IV)', () => {
    const a = encryptSecret('same');
    const b = encryptSecret('same');
    expect(a).not.toBe(b);
    expect(decryptSecret(a)).toBe('same');
    expect(decryptSecret(b)).toBe('same');
  });

  it('rejects tampered ciphertext via auth tag', () => {
    const ct = encryptSecret('keep me safe');
    const [iv, tag, body] = ct.split(':');
    // Flip a bit in the body portion.
    const tampered = Buffer.from(body, 'base64');
    tampered[0] ^= 0xff;
    const bad = `${iv}:${tag}:${tampered.toString('base64')}`;
    expect(() => decryptSecret(bad)).toThrow();
  });

  it('validates inputs', () => {
    expect(validateSecretInput({ key: '', value: 'v', scope: 'site' })).toEqual({
      field: 'key',
      message: expect.any(String),
    });
    expect(validateSecretInput({ key: 'lowercase', value: 'v', scope: 'site' })).toEqual({
      field: 'key',
      message: expect.any(String),
    });
    expect(validateSecretInput({ key: 'OK', value: '', scope: 'site' })).toEqual({
      field: 'value',
      message: expect.any(String),
    });
    expect(validateSecretInput({ key: 'OK', value: 'v', scope: 'function', allowedFunctions: [] })).toEqual({
      field: 'allowedFunctions',
      message: expect.any(String),
    });
    expect(validateSecretInput({ key: 'OK', value: 'v', scope: 'function', allowedFunctions: ['fn-a'] })).toBeNull();
  });
});

describe('secrets-store', () => {
  beforeEach(async () => {
    process.env.BUILDER_SECRET_KEK = 'unit-test-kek-do-not-use-elsewhere';
    delete process.env.BLOB_READ_WRITE_TOKEN;
    process.env.BUILDER_SITE_BACKEND = 'local';
    await cleanStore();
  });

  afterEach(async () => {
    await cleanStore();
  });

  it('creates a secret and returns one-time plaintext', async () => {
    const result = await createSecret({
      key: 'STRIPE_API_KEY',
      value: 'sk_live_xxx',
      scope: 'site',
      addedBy: 'admin',
    });
    expect(result.secret.key).toBe('STRIPE_API_KEY');
    expect(result.plaintext).toBe('sk_live_xxx');
    const meta = (await listSecrets()).find((s) => s.id === result.secret.id);
    expect(meta).toBeTruthy();
    // Metadata never leaks plaintext or ciphertext.
    expect(JSON.stringify(meta)).not.toContain('sk_live_xxx');
  });

  it('rejects duplicate keys', async () => {
    await createSecret({ key: 'DUP', value: 'a', scope: 'site', addedBy: 'admin' });
    await expect(
      createSecret({ key: 'DUP', value: 'b', scope: 'site', addedBy: 'admin' }),
    ).rejects.toBeInstanceOf(SecretValidationFailure);
  });

  it('rotates and updates lastRotatedAt + plaintext', async () => {
    const created = await createSecret({
      key: 'ROTATE_ME',
      value: 'old',
      scope: 'site',
      addedBy: 'admin',
    });
    const rotated = await rotateSecret(created.secret.id, 'new', 'rotator');
    expect(rotated.plaintext).toBe('new');
    expect(rotated.secret.lastRotatedAt).not.toBe(created.secret.lastRotatedAt);
    expect(await readSecretPlaintext('ROTATE_ME')).toBe('new');
  });

  it('revokes a secret', async () => {
    const created = await createSecret({
      key: 'REVOKE_ME',
      value: 'gone',
      scope: 'site',
      addedBy: 'admin',
    });
    expect(await revokeSecret(created.secret.id)).toBe(true);
    await expect(readSecretPlaintext('REVOKE_ME')).rejects.toBeInstanceOf(SecretNotFoundError);
  });

  it('enforces scope filtering on function-scoped secrets', async () => {
    await createSecret({
      key: 'OPENAI_KEY',
      value: 'sk-openai',
      scope: 'function',
      allowedFunctions: ['ai-helper'],
      addedBy: 'admin',
    });
    expect(await readSecretPlaintext('OPENAI_KEY', 'ai-helper')).toBe('sk-openai');
    await expect(readSecretPlaintext('OPENAI_KEY', 'other-fn')).rejects.toBeInstanceOf(SecretAccessDeniedError);
    await expect(readSecretPlaintext('OPENAI_KEY')).rejects.toBeInstanceOf(SecretAccessDeniedError);
  });

  it('allows any function to read site-scoped secrets', async () => {
    await createSecret({ key: 'SITE_KEY', value: 'open', scope: 'site', addedBy: 'admin' });
    expect(await readSecretPlaintext('SITE_KEY', 'any-fn')).toBe('open');
    expect(await readSecretPlaintext('SITE_KEY')).toBe('open');
  });
});