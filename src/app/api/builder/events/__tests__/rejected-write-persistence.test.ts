import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from '../route';
import { PATCH } from '../[eventId]/route';
import {
  createEvent, loadEvent, normalizeEvent, validateEvent,
} from '@/lib/builder/events/events-engine';

// Only authorization is mocked; routes, normalization and file persistence are real.
vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'audit' })),
  guardBuilderReadWithPermission: vi.fn(async () => ({ username: 'audit' })),
}));

const valid = {
  locale: 'en' as const,
  title: ' Audit Event ',
  date: '2030-01-01',
  time: '10:00',
  location: ' Online ',
  capacity: 10,
  status: 'published' as const,
};
const validationError = {
  ok: false, error: 'Check the event request.', errorCode: 'validation_error',
};
let root = '';

function request(method: string, body: unknown, eventId = ''): NextRequest {
  return new NextRequest(`https://audit.invalid/api/builder/events${eventId ? `/${eventId}` : ''}?locale=en`, {
    method,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('event route persistence validation', () => {
  beforeEach(async () => {
    root = await mkdtemp(path.join(os.tmpdir(), 'fn26-events-contract-'));
    vi.stubEnv('BUILDER_EVENTS_ROOT', root);
    vi.stubEnv('BUILDER_EVENTS_BACKEND', 'local');
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', '');
  });

  afterEach(async () => {
    vi.unstubAllEnvs();
    await rm(root, { recursive: true, force: true });
  });

  it.each([
    { ticketType: 'paid', ticketPriceTwd: 0 },
    { slug: 'invalid slug!' },
  ])('rejects POST without creating any files: %j', async (invalid) => {
    const before = await readdir(root);
    const response = await POST(request('POST', { ...valid, ...invalid }));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual(validationError);
    expect(await readdir(root)).toEqual(before);
    expect(before).toEqual([]);
  });

  it.each([
    { slug: 'invalid slug!' },
    { ticketType: 'paid' },
  ])('rejects PATCH without changing existing bytes: %j', async (invalid) => {
    const event = await createEvent(valid);
    const file = path.join(root, 'events', `${event.eventId}.json`);
    const before = await readFile(file);
    const response = await PATCH(request('PATCH', invalid, event.eventId), {
      params: Promise.resolve({ eventId: event.eventId }),
    });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual(validationError);
    expect(await readFile(file)).toEqual(before);
    expect(await readdir(path.join(root, 'events'))).toEqual([`${event.eventId}.json`]);
  });

  it('preserves valid POST normalization, generated identity and slug collision behavior', async () => {
    const response = await POST(request('POST', valid));
    expect(response.status).toBe(201);
    const { event } = await response.json();
    expect(event).toMatchObject({
      title: 'Audit Event', location: 'Online', slug: 'audit-event',
      registeredCount: 0, ticketType: 'free', ticketPriceTwd: 0,
    });
    expect(event.eventId).toMatch(/^evt-/);
    expect(Number.isFinite(Date.parse(event.createdAt))).toBe(true);
    expect(event.updatedAt).toBe(event.createdAt);
    expect(await loadEvent(event.eventId)).toEqual(event);
    expect(normalizeEvent(event)).toEqual(event);

    const secondResponse = await POST(request('POST', valid));
    expect(secondResponse.status).toBe(201);
    const { event: second } = await secondResponse.json();
    expect(second.eventId).not.toBe(event.eventId);
    expect(second.slug).toBe(`audit-event-${second.eventId.slice(-6)}`);
    expect(validateEvent(second)).toEqual([]);
    expect(normalizeEvent(second)).toEqual(second);
    expect(await loadEvent(second.eventId)).toEqual(second);
  });

  it('normalizes a merged valid PATCH and preserves identity and omitted fields', async () => {
    const event = await createEvent({
      ...valid, ticketType: 'paid', ticketPriceTwd: 200,
      createdAt: '2020-01-01T00:00:00.000Z', updatedAt: '2020-01-01T00:00:00.000Z',
    });
    const response = await PATCH(request('PATCH', { ticketType: 'free', title: ' Updated ' }, event.eventId), {
      params: Promise.resolve({ eventId: event.eventId }),
    });
    expect(response.status).toBe(200);
    const { event: saved } = await response.json();
    expect(saved).toEqual({
      ...event, title: 'Updated', ticketType: 'free', ticketPriceTwd: 0,
      updatedAt: expect.any(String),
    });
    expect(Date.parse(saved.updatedAt)).toBeGreaterThan(Date.parse(event.updatedAt));
    expect(normalizeEvent(saved)).toEqual(saved);
    expect(validateEvent(saved)).toEqual([]);
    expect(await loadEvent(event.eventId)).toEqual(saved);
  });

  it('preserves missing-event precedence and creates no files for invalid PATCH', async () => {
    const response = await PATCH(request('PATCH', { slug: 'invalid slug!' }, 'missing'), {
      params: Promise.resolve({ eventId: 'missing' }),
    });
    expect(response.status).toBe(404);
    expect(await response.json()).toMatchObject({ ok: false, errorCode: 'event_not_found' });
    expect(await readdir(root)).toEqual([]);
  });
});
