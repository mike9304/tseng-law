import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { NotificationAudienceForbiddenError } from '../notification-model';
import {
  __resetNotificationStorageRootForTests,
  __setNotificationStorageRootForTests,
  createNotification,
  deleteNotification,
  listNotifications,
  markAllRead,
  markRead,
} from '../notification-store';

describe('notification audience authorization', () => {
  let tempRoot = '';

  beforeEach(async () => {
    tempRoot = await mkdtemp(path.join(tmpdir(), 'tseng-notifications-'));
    __setNotificationStorageRootForTests(path.join(tempRoot, 'notifications'));
  });

  afterEach(async () => {
    __resetNotificationStorageRootForTests();
    await rm(tempRoot, { recursive: true, force: true });
  });

  it('lists only broadcast, exact-role, and exact-principal notifications', async () => {
    await createNotification({ kind: 'publish', subject: 'broadcast', body: '' });
    await createNotification({
      kind: 'publish',
      subject: 'owner',
      body: '',
      audience: { role: 'owner' },
    });
    await createNotification({
      kind: 'publish',
      subject: 'editor',
      body: '',
      audience: { role: 'editor' },
    });
    await createNotification({
      kind: 'publish',
      subject: 'email',
      body: '',
      audience: { email: 'Editor@Example.com' },
    });
    await createNotification({
      kind: 'publish',
      subject: 'legacy reviewer',
      body: '',
      audience: { role: 'reviewer' },
    });

    const editorItems = await listNotifications({
      audienceScope: { principal: 'editor@example.com', role: 'editor' },
    });
    const ownerItems = await listNotifications({
      audienceScope: { principal: 'owner', role: 'owner' },
    });

    expect(editorItems.map((item) => item.subject).sort()).toEqual([
      'broadcast',
      'editor',
      'email',
    ]);
    expect(ownerItems.map((item) => item.subject).sort()).toEqual([
      'broadcast',
      'owner',
    ]);
  });

  it('rejects cross-role mark and delete operations without changing the object', async () => {
    const ownerOnly = await createNotification({
      kind: 'approval',
      subject: 'owner decision',
      body: '',
      audience: { role: 'owner' },
    });
    const editorScope = { principal: 'editor@example.com', role: 'editor' as const };
    const ownerScope = { principal: 'owner@example.com', role: 'owner' as const };

    await expect(markRead(ownerOnly.id, editorScope))
      .rejects.toBeInstanceOf(NotificationAudienceForbiddenError);
    await expect(deleteNotification(ownerOnly.id, editorScope))
      .rejects.toBeInstanceOf(NotificationAudienceForbiddenError);

    const stillUnread = await listNotifications({
      unreadOnly: true,
      audienceScope: ownerScope,
    });
    expect(stillUnread).toHaveLength(1);

    const updated = await markRead(ownerOnly.id, ownerScope);
    expect(updated?.readAt).toEqual(expect.any(String));
    await expect(deleteNotification(ownerOnly.id, ownerScope)).resolves.toBe(true);
  });

  it('bulk marks only objects in the authenticated audience', async () => {
    await createNotification({ kind: 'comment', subject: 'broadcast', body: '' });
    await createNotification({
      kind: 'comment',
      subject: 'owner',
      body: '',
      audience: { role: 'owner' },
    });
    await createNotification({
      kind: 'comment',
      subject: 'editor',
      body: '',
      audience: { role: 'editor' },
    });

    const updated = await markAllRead({
      kind: 'comment',
      audienceScope: { principal: 'editor@example.com', role: 'editor' },
    });

    expect(updated).toBe(2);
    const ownerUnread = await listNotifications({
      unreadOnly: true,
      audienceScope: { principal: 'owner@example.com', role: 'owner' },
    });
    expect(ownerUnread.map((item) => item.subject)).toEqual(['owner']);
  });
});
