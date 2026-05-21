import { mkdtemp, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  createEvent,
  filterEventsByStatus,
  filterEventsByTime,
  groupEventsByMonth,
  listAttendees,
  listEvents,
  registerAttendee,
} from '@/lib/builder/events/events-engine';

const ORIGINAL_ROOT = process.env.BUILDER_EVENTS_ROOT;
const ORIGINAL_BACKEND = process.env.BUILDER_EVENTS_BACKEND;
const ORIGINAL_BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

let tempDir = '';

describe('native events engine', () => {
  beforeEach(async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), 'builder-events-'));
    process.env.BUILDER_EVENTS_ROOT = tempDir;
    process.env.BUILDER_EVENTS_BACKEND = 'local';
    delete process.env.BLOB_READ_WRITE_TOKEN;
  });

  afterEach(async () => {
    if (ORIGINAL_ROOT === undefined) delete process.env.BUILDER_EVENTS_ROOT;
    else process.env.BUILDER_EVENTS_ROOT = ORIGINAL_ROOT;
    if (ORIGINAL_BACKEND === undefined) delete process.env.BUILDER_EVENTS_BACKEND;
    else process.env.BUILDER_EVENTS_BACKEND = ORIGINAL_BACKEND;
    if (ORIGINAL_BLOB_TOKEN === undefined) delete process.env.BLOB_READ_WRITE_TOKEN;
    else process.env.BLOB_READ_WRITE_TOKEN = ORIGINAL_BLOB_TOKEN;
    await rm(tempDir, { recursive: true, force: true });
  });

  it('creates, filters, calendars, and registers native events with capacity checks', async () => {
    const event = await createEvent({
      locale: 'ko',
      title: 'F45 이벤트 세미나',
      slug: 'f45-event-seminar',
      description: 'F45 native events 검증',
      date: '2026-06-18',
      time: '14:00',
      location: '타이베이',
      category: 'seminar',
      capacity: 2,
      status: 'published',
      rsvpEnabled: true,
      ticketType: 'paid',
      ticketPriceTwd: 1000,
    });
    await createEvent({
      locale: 'ko',
      title: 'F45 초안 이벤트',
      slug: 'f45-draft-event',
      description: '',
      date: '2026-07-01',
      time: '10:00',
      location: 'Online',
      capacity: 10,
      status: 'draft',
    });

    const all = await listEvents();
    expect(all).toHaveLength(2);
    expect(filterEventsByStatus(all, 'published')).toHaveLength(1);
    expect(filterEventsByTime(all, 'upcoming', new Date('2026-05-20T00:00:00.000Z'))).toHaveLength(2);
    expect(groupEventsByMonth(all).map((month) => month.yearMonth)).toEqual(['2026-06', '2026-07']);

    const attendee = await registerAttendee(event.eventId, {
      name: 'F45 Tester',
      email: 'tester@example.com',
      ticketQuantity: 2,
    });
    expect(attendee).toMatchObject({
      eventId: event.eventId,
      ticketQuantity: 2,
      paymentStatus: 'pending',
      status: 'registered',
    });
    await expect(registerAttendee(event.eventId, {
      name: 'Overflow',
      email: 'overflow@example.com',
      ticketQuantity: 1,
    })).rejects.toThrow('등록이 마감되었습니다.');

    expect(await listAttendees(event.eventId)).toHaveLength(1);
    const updated = (await listEvents()).find((item) => item.eventId === event.eventId);
    expect(updated?.registeredCount).toBe(2);
  });
});
