/**
 * Tests for the segment rule engine + segment store. Pure rule evaluation
 * uses in-memory objects; CRUD tests use the file backend via tmp cwd.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import type { CrmContact } from '@/lib/builder/crm/contact-model';
import {
  type CrmSegment,
  evaluateRule,
  matchSegment,
  selectContactsBySegment,
  validateSegmentInput,
} from '@/lib/builder/crm/segments-model';

function makeContact(overrides: Partial<CrmContact> = {}): CrmContact {
  const now = new Date('2026-01-01T00:00:00Z').toISOString();
  return {
    id: 'ct_test',
    email: 'user@example.com',
    source: 'manual',
    tags: [],
    createdAt: now,
    lastActivityAt: now,
    ...overrides,
  };
}

function makeSegment(overrides: Partial<CrmSegment> = {}): CrmSegment {
  return {
    id: 'seg_test',
    name: 'Test segment',
    rules: [],
    matchMode: 'all',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('segment rule engine (pure)', () => {
  it('tag rule matches contact whose tags include the value', () => {
    const c = makeContact({ tags: ['lead', 'vip'] });
    expect(evaluateRule({ kind: 'tag', tag: 'lead' }, c)).toBe(true);
    expect(evaluateRule({ kind: 'tag', tag: 'cold' }, c)).toBe(false);
  });

  it('attribute rule matches case-insensitively against customFields', () => {
    const c = makeContact({ customFields: { state: 'CA', city: 'San Jose' } });
    expect(evaluateRule({ kind: 'attribute', key: 'state', value: 'ca' }, c)).toBe(true);
    expect(evaluateRule({ kind: 'attribute', key: 'city', value: 'OAKLAND' }, c)).toBe(false);
    expect(evaluateRule({ kind: 'attribute', key: 'zip', value: '95110' }, c)).toBe(false);
  });

  it('email-domain rule matches host only (case-insensitive, @-prefix tolerated)', () => {
    const c = makeContact({ email: 'jane@acme.io' });
    expect(evaluateRule({ kind: 'email-domain', domain: 'acme.io' }, c)).toBe(true);
    expect(evaluateRule({ kind: 'email-domain', domain: 'ACME.IO' }, c)).toBe(true);
    expect(evaluateRule({ kind: 'email-domain', domain: '@acme.io' }, c)).toBe(true);
    expect(evaluateRule({ kind: 'email-domain', domain: 'other.io' }, c)).toBe(false);
  });

  it('created-since rule respects ISO string ordering', () => {
    const c = makeContact({ createdAt: '2026-03-01T00:00:00.000Z' });
    expect(
      evaluateRule({ kind: 'created-since', since: '2026-01-01T00:00:00.000Z' }, c),
    ).toBe(true);
    expect(
      evaluateRule({ kind: 'created-since', since: '2026-04-01T00:00:00.000Z' }, c),
    ).toBe(false);
    expect(evaluateRule({ kind: 'created-since', since: 'not-a-date' }, c)).toBe(false);
  });

  it('matchSegment honors match mode (all/any) and short-circuits empties as false', () => {
    const c = makeContact({ tags: ['lead'], email: 'a@acme.io' });

    const allMatch = makeSegment({
      matchMode: 'all',
      rules: [
        { kind: 'tag', tag: 'lead' },
        { kind: 'email-domain', domain: 'acme.io' },
      ],
    });
    expect(matchSegment(allMatch, c)).toBe(true);

    const allMismatch = makeSegment({
      matchMode: 'all',
      rules: [
        { kind: 'tag', tag: 'lead' },
        { kind: 'email-domain', domain: 'other.io' },
      ],
    });
    expect(matchSegment(allMismatch, c)).toBe(false);

    const anyMatch = makeSegment({
      matchMode: 'any',
      rules: [
        { kind: 'tag', tag: 'vip' },
        { kind: 'email-domain', domain: 'acme.io' },
      ],
    });
    expect(matchSegment(anyMatch, c)).toBe(true);

    const empty = makeSegment({ rules: [] });
    expect(matchSegment(empty, c)).toBe(false);
  });

  it('selectContactsBySegment preserves input order and only returns matches', () => {
    const contacts = [
      makeContact({ id: 'ct_1', email: 'a@acme.io', tags: ['lead'] }),
      makeContact({ id: 'ct_2', email: 'b@other.io', tags: ['lead'] }),
      makeContact({ id: 'ct_3', email: 'c@acme.io', tags: [] }),
    ];
    const segment = makeSegment({
      matchMode: 'all',
      rules: [
        { kind: 'email-domain', domain: 'acme.io' },
        { kind: 'tag', tag: 'lead' },
      ],
    });
    expect(selectContactsBySegment(segment, contacts).map((c) => c.id)).toEqual(['ct_1']);
  });
});

describe('validateSegmentInput', () => {
  it('rejects empty name and empty rule list', () => {
    const result = validateSegmentInput({ name: '', rules: [] });
    expect(result.ok).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('accepts a well-formed body and normalizes match mode', () => {
    const result = validateSegmentInput({
      name: 'VIP leads',
      description: 'high-value leads',
      matchMode: 'totally-bogus',
      rules: [{ kind: 'tag', tag: 'vip' }],
    });
    expect(result.ok).toBe(true);
    expect(result.value?.matchMode).toBe('all');
    expect(result.value?.rules).toHaveLength(1);
  });

  it('rejects rule with unknown kind', () => {
    const result = validateSegmentInput({
      name: 'x',
      rules: [{ kind: 'unknown' }],
    });
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.field.startsWith('rules'))).toBe(true);
  });
});

// ─── File-backed CRUD ────────────────────────────────────────────────────

const ORIGINAL_CWD = process.cwd();
let tmpRoot = '';

beforeEach(async () => {
  tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'crm-seg-'));
  process.chdir(tmpRoot);
  delete process.env.BLOB_READ_WRITE_TOKEN;
  process.env.CRM_BACKEND = 'local';
});

afterEach(async () => {
  process.chdir(ORIGINAL_CWD);
  await fs.rm(tmpRoot, { recursive: true, force: true });
});

describe('segments-store CRUD', () => {
  it('creates, lists, updates, and deletes a segment', async () => {
    const store = await import('@/lib/builder/crm/segments-store');
    const created = await store.createSegment({
      name: 'Leads',
      rules: [{ kind: 'tag', tag: 'lead' }],
      matchMode: 'all',
    });
    expect(created.id).toMatch(/^seg_/);

    const list = await store.readSegments();
    expect(list).toHaveLength(1);
    expect(list[0].name).toBe('Leads');

    const patched = await store.updateSegment(created.id, { name: 'Renamed' });
    expect(patched?.name).toBe('Renamed');
    expect(patched?.updatedAt).not.toBe(created.updatedAt);

    const removed = await store.deleteSegment(created.id);
    expect(removed).toBe(true);
    expect(await store.readSegments()).toHaveLength(0);
  });

  it('survives a process restart by reading from the JSON file', async () => {
    const store = await import('@/lib/builder/crm/segments-store');
    await store.createSegment({
      name: 'Domain segment',
      rules: [{ kind: 'email-domain', domain: 'acme.io' }],
      matchMode: 'all',
    });
    const file = await fs.readFile(
      path.join(tmpRoot, 'runtime-data', 'crm', 'segments.json'),
      'utf8',
    );
    const parsed = JSON.parse(file);
    expect(parsed.segments).toHaveLength(1);
    expect(parsed.segments[0].rules[0].kind).toBe('email-domain');
  });
});