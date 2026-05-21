/**
 * F104 — File-backed unified notification inbox.
 *
 * Single JSON document under runtime-data/notifications/inbox.json with the
 * full notification list. Writes are serialized through a single queue.
 */

import { promises as fs } from 'fs';
import path from 'path';
import { randomBytes } from 'node:crypto';
import {
  type BuilderNotification,
  type BuilderNotificationAudience,
  type BuilderNotificationInboxFile,
  type BuilderNotificationKind,
  emptyInbox,
} from './notification-model';

const MAX_NOTIFICATIONS = 500;

function rootDir(): string {
  return path.join(process.cwd(), 'runtime-data', 'notifications');
}

function inboxFile(): string {
  return path.join(rootDir(), 'inbox.json');
}

function makeNotificationId(): string {
  return `ntf_${Date.now().toString(36)}_${randomBytes(5).toString('hex')}`;
}

let writeQueue: Promise<void> = Promise.resolve();

async function withQueue<T>(task: () => Promise<T>): Promise<T> {
  const previous = writeQueue;
  let release!: () => void;
  writeQueue = new Promise<void>((resolve) => {
    release = resolve;
  });
  await previous.catch(() => undefined);
  try {
    return await task();
  } finally {
    release();
  }
}

async function readInbox(): Promise<BuilderNotificationInboxFile> {
  try {
    const text = await fs.readFile(inboxFile(), 'utf8');
    const parsed = JSON.parse(text) as BuilderNotificationInboxFile;
    if (!Array.isArray(parsed.notifications)) return emptyInbox();
    return parsed;
  } catch {
    return emptyInbox();
  }
}

async function writeInbox(file: BuilderNotificationInboxFile): Promise<void> {
  await fs.mkdir(rootDir(), { recursive: true });
  await fs.writeFile(inboxFile(), JSON.stringify(file, null, 2), 'utf8');
}

export interface ListNotificationsFilter {
  kind?: BuilderNotificationKind;
  unreadOnly?: boolean;
  audienceRole?: BuilderNotificationAudience['role'];
  audienceEmail?: string;
  limit?: number;
}

function notificationMatchesAudience(
  notification: BuilderNotification,
  filter: ListNotificationsFilter,
): boolean {
  if (!filter.audienceRole && !filter.audienceEmail) return true;
  // A notification without explicit audience targets everyone.
  if (!notification.audience.role && !notification.audience.email) return true;
  if (filter.audienceRole && notification.audience.role === filter.audienceRole) return true;
  if (filter.audienceEmail && notification.audience.email === filter.audienceEmail) return true;
  return false;
}

export async function listNotifications(
  filter: ListNotificationsFilter = {},
): Promise<BuilderNotification[]> {
  const inbox = await readInbox();
  let items = inbox.notifications.slice();
  items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  if (filter.kind) items = items.filter((n) => n.kind === filter.kind);
  if (filter.unreadOnly) items = items.filter((n) => !n.readAt);
  if (filter.audienceRole || filter.audienceEmail) {
    items = items.filter((n) => notificationMatchesAudience(n, filter));
  }
  if (filter.limit && filter.limit > 0) items = items.slice(0, filter.limit);
  return items;
}

export interface CreateNotificationInput {
  kind: BuilderNotificationKind;
  subject: string;
  body: string;
  audience?: BuilderNotificationAudience;
  link?: string;
}

export async function createNotification(
  input: CreateNotificationInput,
): Promise<BuilderNotification> {
  const subject = input.subject?.trim();
  if (!subject) throw new Error('subject_required');
  const notification: BuilderNotification = {
    id: makeNotificationId(),
    kind: input.kind,
    subject: subject.slice(0, 200),
    body: (input.body ?? '').slice(0, 1000),
    audience: input.audience ?? {},
    createdAt: new Date().toISOString(),
    link: input.link?.slice(0, 500),
  };
  await withQueue(async () => {
    const inbox = await readInbox();
    const next: BuilderNotificationInboxFile = {
      version: 1,
      updatedAt: new Date().toISOString(),
      notifications: [notification, ...inbox.notifications].slice(0, MAX_NOTIFICATIONS),
    };
    await writeInbox(next);
  });
  return notification;
}

export async function markRead(id: string): Promise<BuilderNotification | null> {
  return withQueue(async () => {
    const inbox = await readInbox();
    const index = inbox.notifications.findIndex((n) => n.id === id);
    if (index === -1) return null;
    const current = inbox.notifications[index];
    if (current.readAt) return current;
    const updated: BuilderNotification = {
      ...current,
      readAt: new Date().toISOString(),
    };
    const nextList = inbox.notifications.slice();
    nextList[index] = updated;
    await writeInbox({
      version: 1,
      updatedAt: new Date().toISOString(),
      notifications: nextList,
    });
    return updated;
  });
}

export async function markAllRead(filter: ListNotificationsFilter = {}): Promise<number> {
  return withQueue(async () => {
    const inbox = await readInbox();
    let changed = 0;
    const now = new Date().toISOString();
    const nextList = inbox.notifications.map((n) => {
      if (n.readAt) return n;
      if (filter.kind && n.kind !== filter.kind) return n;
      if ((filter.audienceRole || filter.audienceEmail) && !notificationMatchesAudience(n, filter)) {
        return n;
      }
      changed += 1;
      return { ...n, readAt: now };
    });
    if (changed === 0) return 0;
    await writeInbox({
      version: 1,
      updatedAt: now,
      notifications: nextList,
    });
    return changed;
  });
}

export async function deleteNotification(id: string): Promise<boolean> {
  return withQueue(async () => {
    const inbox = await readInbox();
    const filtered = inbox.notifications.filter((n) => n.id !== id);
    if (filtered.length === inbox.notifications.length) return false;
    await writeInbox({
      version: 1,
      updatedAt: new Date().toISOString(),
      notifications: filtered,
    });
    return true;
  });
}