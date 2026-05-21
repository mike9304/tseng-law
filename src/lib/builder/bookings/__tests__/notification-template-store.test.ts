import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import os from 'os';
import path from 'path';
import { promises as fs } from 'fs';
import {
  _resetTemplatesPathForTests,
  _setTemplatesPathForTests,
  createNotificationTemplate,
  deleteNotificationTemplate,
  getNotificationTemplate,
  listNotificationTemplates,
  makeNotificationTemplateId,
  parseNotificationTemplateId,
  resolveNotificationTemplate,
  updateNotificationTemplate,
  notificationTemplateInputSchema,
} from '@/lib/builder/bookings/notification-template-store';

let tmpDir = '';
let tmpFile = '';

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'notif-templates-'));
  tmpFile = path.join(tmpDir, 'notification-templates.json');
  _setTemplatesPathForTests(tmpFile);
});

afterEach(async () => {
  _resetTemplatesPathForTests();
  await fs.rm(tmpDir, { recursive: true, force: true });
});

describe('makeNotificationTemplateId / parseNotificationTemplateId', () => {
  it('round-trips through the eventType__locale scheme', () => {
    const id = makeNotificationTemplateId('booking-confirmed', 'ko');
    expect(id).toBe('booking-confirmed__ko');
    expect(parseNotificationTemplateId(id)).toEqual({
      eventType: 'booking-confirmed',
      locale: 'ko',
    });
  });

  it('returns null for malformed ids', () => {
    expect(parseNotificationTemplateId('no-double-underscore')).toBeNull();
    expect(parseNotificationTemplateId('booking-confirmed__fr')).toBeNull();
    expect(parseNotificationTemplateId('mystery-event__ko')).toBeNull();
  });
});

describe('notificationTemplateInputSchema', () => {
  it('accepts a valid payload', () => {
    const parsed = notificationTemplateInputSchema.safeParse({
      eventType: 'booking-confirmed',
      locale: 'ko',
      subject: 'Confirmed',
      html: '<p>hi</p>',
      plain: 'hi',
    });
    expect(parsed.success).toBe(true);
  });

  it('rejects unknown event types', () => {
    const parsed = notificationTemplateInputSchema.safeParse({
      eventType: 'unrelated',
      locale: 'ko',
      subject: 's',
      html: 'h',
      plain: 'p',
    });
    expect(parsed.success).toBe(false);
  });
});

describe('CRUD lifecycle', () => {
  it('creates, reads, updates, lists, and deletes a template', async () => {
    const created = await createNotificationTemplate({
      eventType: 'booking-confirmed',
      locale: 'ko',
      subject: 'Confirmed',
      html: '<p>html</p>',
      plain: 'plain',
    });
    expect(created.ok).toBe(true);

    const fetched = await getNotificationTemplate('booking-confirmed__ko');
    expect(fetched?.subject).toBe('Confirmed');
    expect(fetched?.isActive).toBe(true);

    const updated = await updateNotificationTemplate('booking-confirmed__ko', {
      subject: 'Updated',
      isActive: false,
    });
    expect(updated.ok).toBe(true);
    if (updated.ok) {
      expect(updated.template.subject).toBe('Updated');
      expect(updated.template.isActive).toBe(false);
    }

    const list = await listNotificationTemplates();
    expect(list).toHaveLength(1);

    const deleted = await deleteNotificationTemplate('booking-confirmed__ko');
    expect(deleted.ok).toBe(true);
    expect(await listNotificationTemplates()).toHaveLength(0);
  });

  it('refuses to create a duplicate id', async () => {
    await createNotificationTemplate({
      eventType: 'booking-cancelled',
      locale: 'en',
      subject: 'Sorry',
      html: '<p>x</p>',
      plain: 'x',
    });
    const second = await createNotificationTemplate({
      eventType: 'booking-cancelled',
      locale: 'en',
      subject: 'Sorry again',
      html: '<p>y</p>',
      plain: 'y',
    });
    expect(second.ok).toBe(false);
  });

  it('returns not-found on update/delete of an unknown id', async () => {
    expect((await updateNotificationTemplate('booking-confirmed__en', { subject: 'x' })).ok).toBe(false);
    expect((await deleteNotificationTemplate('booking-confirmed__en')).ok).toBe(false);
  });

  it('filters list results by eventType and locale', async () => {
    await createNotificationTemplate({
      eventType: 'booking-confirmed',
      locale: 'ko',
      subject: 's',
      html: 'h',
      plain: 'p',
    });
    await createNotificationTemplate({
      eventType: 'booking-confirmed',
      locale: 'en',
      subject: 's',
      html: 'h',
      plain: 'p',
    });
    await createNotificationTemplate({
      eventType: 'booking-reminder',
      locale: 'ko',
      subject: 's',
      html: 'h',
      plain: 'p',
    });

    const onlyKo = await listNotificationTemplates({ locale: 'ko' });
    expect(onlyKo).toHaveLength(2);

    const onlyConfirmed = await listNotificationTemplates({ eventType: 'booking-confirmed' });
    expect(onlyConfirmed).toHaveLength(2);
  });
});

describe('resolveNotificationTemplate locale fallback', () => {
  it('returns the exact locale match when active', async () => {
    await createNotificationTemplate({
      eventType: 'booking-reminder',
      locale: 'ko',
      subject: 'KO',
      html: 'h',
      plain: 'p',
    });
    await createNotificationTemplate({
      eventType: 'booking-reminder',
      locale: 'en',
      subject: 'EN',
      html: 'h',
      plain: 'p',
    });
    const resolved = await resolveNotificationTemplate('booking-reminder', 'en');
    expect(resolved?.subject).toBe('EN');
  });

  it('falls back to defaultLocale ko when requested locale missing', async () => {
    await createNotificationTemplate({
      eventType: 'booking-reminder',
      locale: 'ko',
      subject: 'KO',
      html: 'h',
      plain: 'p',
    });
    const resolved = await resolveNotificationTemplate('booking-reminder', 'en');
    expect(resolved?.subject).toBe('KO');
  });

  it('falls back to any active locale when defaultLocale and requested both missing', async () => {
    await createNotificationTemplate({
      eventType: 'booking-reminder',
      locale: 'zh-hant',
      subject: 'ZH',
      html: 'h',
      plain: 'p',
    });
    const resolved = await resolveNotificationTemplate('booking-reminder', 'en');
    expect(resolved?.subject).toBe('ZH');
  });

  it('falls back to inactive same-locale match as last resort', async () => {
    await createNotificationTemplate({
      eventType: 'booking-reminder',
      locale: 'ko',
      subject: 'old',
      html: 'h',
      plain: 'p',
      isActive: false,
    });
    const resolved = await resolveNotificationTemplate('booking-reminder', 'ko');
    expect(resolved?.subject).toBe('old');
  });

  it('returns null when no templates exist for the event type', async () => {
    const resolved = await resolveNotificationTemplate('booking-rescheduled', 'ko');
    expect(resolved).toBeNull();
  });
});