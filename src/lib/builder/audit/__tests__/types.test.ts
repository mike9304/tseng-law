import { describe, expect, it } from 'vitest';
import {
  parseAuditEvent,
  assertNoForbiddenKeys,
  FORBIDDEN_KEYS,
  type AuditEvent,
} from '@/lib/builder/audit/types';

const SAMPLE_EVENT: AuditEvent = {
  type: 'asset.upload',
  at: '2026-05-03T01:00:00.000Z',
  actorRef: 'admin',
  assetId: 'asset-x',
  mime: 'image/png',
  size: 1024,
};

describe('FORBIDDEN_KEYS', () => {
  it('includes the well-known sensitive surfaces', () => {
    for (const key of [
      'body',
      'rawBody',
      'request',
      'response',
      'authorization',
      'cookie',
      'password',
      'token',
      'apiKey',
      'submission',
      'formValue',
      'webhook',
      'webhookUrl',
      'fileBytes',
      'imageBytes',
    ]) {
      expect(FORBIDDEN_KEYS.has(key)).toBe(true);
    }
  });
});

describe('assertNoForbiddenKeys', () => {
  it('passes on plain safe object', () => {
    expect(() => assertNoForbiddenKeys({ assetId: 'a', mime: 'b' })).not.toThrow();
  });

  it('rejects top-level forbidden key', () => {
    expect(() =>
      assertNoForbiddenKeys({ body: 'leak' }),
    ).toThrow(/forbidden key: body/);
  });

  it('rejects forbidden key case-insensitively', () => {
    expect(() => assertNoForbiddenKeys({ Authorization: 'Basic xx' })).toThrow(/forbidden/);
    expect(() => assertNoForbiddenKeys({ COOKIE: 'sid=' })).toThrow(/forbidden/);
  });

  it('rejects nested forbidden key (deep)', () => {
    expect(() =>
      assertNoForbiddenKeys({ outer: { middle: { token: 'oh-no' } } }),
    ).toThrow(/outer\.middle\.token/);
  });

  it('rejects forbidden key in array element', () => {
    expect(() =>
      assertNoForbiddenKeys({ items: [{ ok: 1 }, { password: 'p' }] }),
    ).toThrow(/items\.1\.password/);
  });

  it('handles cyclic reference without infinite loop', () => {
    const o: Record<string, unknown> = { a: 1 };
    o.self = o;
    expect(() => assertNoForbiddenKeys(o)).not.toThrow();
  });

  it('passes on null / primitives', () => {
    expect(() => assertNoForbiddenKeys(null)).not.toThrow();
    expect(() => assertNoForbiddenKeys('plain string')).not.toThrow();
    expect(() => assertNoForbiddenKeys(123)).not.toThrow();
  });
});

describe('parseAuditEvent', () => {
  it('returns the parsed event for a valid AssetUploadEvent', () => {
    const parsed = parseAuditEvent(SAMPLE_EVENT);
    expect(parsed.type).toBe('asset.upload');
    expect((parsed as typeof SAMPLE_EVENT).assetId).toBe('asset-x');
  });

  it('throws on forbidden key before zod parse', () => {
    expect(() =>
      parseAuditEvent({ ...SAMPLE_EVENT, request: '...' }),
    ).toThrow(/forbidden/);
  });

  it('throws on missing required field (zod fail)', () => {
    expect(() => parseAuditEvent({ type: 'asset.upload', at: SAMPLE_EVENT.at })).toThrow();
  });

  it('throws on unknown event type', () => {
    expect(() =>
      parseAuditEvent({
        type: 'unknown.event',
        at: SAMPLE_EVENT.at,
      } as unknown),
    ).toThrow();
  });

  it('rejects non-ISO at field', () => {
    expect(() =>
      parseAuditEvent({ ...SAMPLE_EVENT, at: 'not-a-date' }),
    ).toThrow();
  });
});
