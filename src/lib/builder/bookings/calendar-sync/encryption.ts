import crypto from 'node:crypto';

/**
 * PR #8 — At-rest encryption for OAuth refresh tokens.
 *
 * Uses AES-256-GCM keyed by SHA256 of `CMS_SESSION_SECRET`. The format is
 * `${ivHex}:${cipherHex}:${authTagHex}` — easy to inspect and recover from.
 * Throws if the secret is missing.
 */

function key(): Buffer {
  const secret = process.env.CMS_SESSION_SECRET ?? '';
  if (!secret) {
    throw new Error('CMS_SESSION_SECRET is required for calendar-sync token storage');
  }
  return crypto.createHash('sha256').update(secret).digest();
}

export function encryptToken(plaintext: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key(), iv);
  const enc = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${enc.toString('hex')}:${tag.toString('hex')}`;
}

export function decryptToken(payload: string): string {
  const [ivHex, cipherHex, tagHex] = payload.split(':');
  if (!ivHex || !cipherHex || !tagHex) throw new Error('invalid encrypted token payload');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key(), Buffer.from(ivHex, 'hex'));
  decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
  const dec = Buffer.concat([decipher.update(Buffer.from(cipherHex, 'hex')), decipher.final()]);
  return dec.toString('utf8');
}
