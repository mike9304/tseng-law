/**
 * F104 — Unified notification inbox with durable production CAS.
 *
 * Production stores one JSON document in Vercel Blob with ETag conditional
 * writes. Local development/test persistence uses a serialized filesystem CAS
 * store and bootstraps the legacy runtime-data/notifications/inbox.json file.
 */

import { promises as fs } from 'fs';
import path from 'path';
import { randomBytes } from 'node:crypto';
import { createBlobVersionedJsonStore } from '@/lib/builder/storage/blob-cas';
import { createFileVersionedJsonStore } from '@/lib/builder/storage/file-cas';
import {
  PERSISTENCE_ERROR_CODES,
  PersistenceBackendUnavailableError,
  PersistenceConflictError,
  isPersistenceError,
} from '@/lib/builder/storage/persistence-errors';
import {
  defineRetrySafeReducer,
  mutateVersionedJson,
  type RetrySafeReducer,
  type VersionedJsonStore,
} from '@/lib/builder/storage/versioned-json-store';
import {
  type BuilderNotification,
  type BuilderNotificationAudience,
  type BuilderNotificationAudienceScope,
  type BuilderNotificationInboxFile,
  type BuilderNotificationKind,
  NotificationAudienceForbiddenError,
  emptyInbox,
} from './notification-model';
import { sanitizeNotificationLink } from './notification-link';

const MAX_NOTIFICATIONS = 500;
const NOTIFICATION_INBOX_KEY = 'inbox';
const NOTIFICATION_BLOB_PATH = 'builder-notifications/inbox-v1.json';
const NOTIFICATION_LOCAL_CAS_DIRECTORY = '.notification-cas-v1';
const NOTIFICATION_MUTATION_ATTEMPTS = 3;
let storageRoot: string | null = null;
let injectedStore: VersionedJsonStore<BuilderNotificationInboxFile> | null = null;

function rootDir(): string {
  return storageRoot ?? path.join(process.cwd(), 'runtime-data', 'notifications');
}

function legacyInboxFile(): string {
  return path.join(rootDir(), 'inbox.json');
}

function makeNotificationId(): string {
  return `ntf_${Date.now().toString(36)}_${randomBytes(5).toString('hex')}`;
}

let writeQueue: Promise<void> = Promise.resolve();

export function __setNotificationStorageRootForTests(value: string): void {
  storageRoot = value;
  writeQueue = Promise.resolve();
}

export function __resetNotificationStorageRootForTests(): void {
  storageRoot = null;
  injectedStore = null;
  writeQueue = Promise.resolve();
}

/** Test seam for simulating cross-instance conditional-write contention. */
export function __setNotificationVersionedStoreForTests(
  store: VersionedJsonStore<BuilderNotificationInboxFile> | null,
): void {
  injectedStore = store;
  writeQueue = Promise.resolve();
}

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

function withNotificationMutation<T>(task: () => Promise<T>): Promise<T> {
  // Filesystem persistence is serialized in-process for the local developer
  // workflow. Production deliberately relies on Blob ETag CAS so separate
  // serverless instances exercise the same conflict/retry path.
  return isProductionRuntime() ? task() : withQueue(task);
}

function isProductionRuntime(): boolean {
  if (process.env.NODE_ENV === 'test') return false;
  return process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
}

function blobToken(): string | undefined {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  return token || undefined;
}

async function notificationStore(): Promise<VersionedJsonStore<BuilderNotificationInboxFile>> {
  if (injectedStore) return injectedStore;

  if (isProductionRuntime()) {
    const token = blobToken();
    if (!token) {
      throw new PersistenceBackendUnavailableError(
        'Notification mutations require BLOB_READ_WRITE_TOKEN in production',
      );
    }
    return createBlobVersionedJsonStore<BuilderNotificationInboxFile>({
      pathnameForKey: () => NOTIFICATION_BLOB_PATH,
      token,
    });
  }

  const localRoot = path.join(rootDir(), NOTIFICATION_LOCAL_CAS_DIRECTORY);
  await fs.mkdir(localRoot, { recursive: true });
  return createFileVersionedJsonStore<BuilderNotificationInboxFile>({
    root: await fs.realpath(localRoot),
    productionMutationPolicy: 'allow',
  });
}

function normalizeInbox(file: BuilderNotificationInboxFile): BuilderNotificationInboxFile {
  if (!Array.isArray(file.notifications)) return emptyInbox();
  return {
    ...file,
    notifications: file.notifications.map((notification) => {
      if (!notification.link) return notification;
      const link = sanitizeNotificationLink(notification.link);
      if (link) return { ...notification, link };
      const { link: _unsafeLink, ...safeNotification } = notification;
      return safeNotification;
    }),
  };
}

/**
 * The original local inbox was a plain JSON file. Bootstrap it once into the
 * local CAS store so developer/runtime data remains visible after the CAS
 * migration. This is deliberately unavailable to production and injected
 * stores, where every write must use the durable backend exclusively.
 */
async function bootstrapLocalLegacyInbox(
  store: VersionedJsonStore<BuilderNotificationInboxFile>,
): Promise<BuilderNotificationInboxFile | null> {
  if (isProductionRuntime() || injectedStore) return null;

  let legacy: BuilderNotificationInboxFile;
  try {
    legacy = normalizeInbox(JSON.parse(await fs.readFile(legacyInboxFile(), 'utf8')));
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') return null;
    return emptyInbox();
  }

  try {
    return normalizeInbox((await store.create(NOTIFICATION_INBOX_KEY, legacy)).value);
  } catch (error) {
    if (!isPersistenceError(error) || error.code !== PERSISTENCE_ERROR_CODES.CONFLICT) {
      throw error;
    }
    return normalizeInbox((await store.read(NOTIFICATION_INBOX_KEY)).value);
  }
}

async function readInbox(
  store?: VersionedJsonStore<BuilderNotificationInboxFile>,
): Promise<BuilderNotificationInboxFile> {
  const resolvedStore = store ?? await notificationStore();
  try {
    return normalizeInbox((await resolvedStore.read(NOTIFICATION_INBOX_KEY)).value);
  } catch (error) {
    if (isPersistenceError(error) && error.code === PERSISTENCE_ERROR_CODES.MISSING) {
      const migrated = await bootstrapLocalLegacyInbox(resolvedStore);
      if (migrated) return migrated;
      return emptyInbox();
    }
    throw error;
  }
}

async function mutateInbox(
  reducer: RetrySafeReducer<BuilderNotificationInboxFile>,
): Promise<BuilderNotificationInboxFile> {
  const store = await notificationStore();
  await bootstrapLocalLegacyInbox(store);

  for (let attempt = 0; attempt < NOTIFICATION_MUTATION_ATTEMPTS; attempt += 1) {
    try {
      const result = await mutateVersionedJson(store, NOTIFICATION_INBOX_KEY, reducer, {
        maxAttempts: NOTIFICATION_MUTATION_ATTEMPTS,
      });
      return normalizeInbox(result.value);
    } catch (error) {
      if (!isPersistenceError(error) || error.code !== PERSISTENCE_ERROR_CODES.MISSING) {
        throw error;
      }

      const empty = emptyInbox();
      const initial = await reducer(empty, { value: empty, version: 'missing' });
      try {
        const created = await store.create(NOTIFICATION_INBOX_KEY, initial);
        return normalizeInbox(created.value);
      } catch (createError) {
        if (
          !isPersistenceError(createError)
          || createError.code !== PERSISTENCE_ERROR_CODES.CONFLICT
          || attempt === NOTIFICATION_MUTATION_ATTEMPTS - 1
        ) {
          throw createError;
        }
      }
    }
  }

  throw new PersistenceConflictError('Notification inbox changed during creation');
}

export interface ListNotificationsFilter {
  kind?: BuilderNotificationKind;
  unreadOnly?: boolean;
  audienceScope?: BuilderNotificationAudienceScope;
  limit?: number;
}

function notificationMatchesAudience(
  notification: BuilderNotification,
  scope: BuilderNotificationAudienceScope | undefined,
): boolean {
  if (!scope) return true;
  // A notification without explicit audience targets everyone.
  if (!notification.audience.role && !notification.audience.email) return true;
  if (notification.audience.role === scope.role) return true;
  if (
    notification.audience.email
    && notification.audience.email.trim().toLowerCase() === scope.principal.trim().toLowerCase()
  ) {
    return true;
  }
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
  if (filter.audienceScope) {
    items = items.filter((n) => notificationMatchesAudience(n, filter.audienceScope));
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
  const link = sanitizeNotificationLink(input.link);
  const notification: BuilderNotification = {
    id: makeNotificationId(),
    kind: input.kind,
    subject: subject.slice(0, 200),
    body: (input.body ?? '').slice(0, 1000),
    audience: input.audience ?? {},
    createdAt: new Date().toISOString(),
    link: link ?? undefined,
  };
  const updatedAt = new Date().toISOString();
  await withNotificationMutation(async () => {
    await mutateInbox(defineRetrySafeReducer((inbox) => ({
      version: 1,
      updatedAt,
      notifications: [notification, ...inbox.notifications].slice(0, MAX_NOTIFICATIONS),
    })));
  });
  return notification;
}

export async function markRead(
  id: string,
  audienceScope?: BuilderNotificationAudienceScope,
): Promise<BuilderNotification | null> {
  const now = new Date().toISOString();
  return withNotificationMutation(async () => {
    const inbox = await mutateInbox(defineRetrySafeReducer((currentInbox) => {
      const index = currentInbox.notifications.findIndex((notification) => notification.id === id);
      if (index === -1) return currentInbox;
      const current = currentInbox.notifications[index];
      if (!notificationMatchesAudience(current, audienceScope)) {
        throw new NotificationAudienceForbiddenError();
      }
      if (current.readAt) return currentInbox;
      const notifications = currentInbox.notifications.slice();
      notifications[index] = { ...current, readAt: now };
      return { version: 1, updatedAt: now, notifications };
    }));
    return inbox.notifications.find((notification) => notification.id === id) ?? null;
  });
}

export async function markAllRead(filter: ListNotificationsFilter = {}): Promise<number> {
  const now = new Date().toISOString();
  return withNotificationMutation(async () => {
    let changed = 0;
    await mutateInbox(defineRetrySafeReducer((currentInbox) => {
      changed = 0;
      const notifications = currentInbox.notifications.map((notification) => {
        if (notification.readAt) return notification;
        if (filter.kind && notification.kind !== filter.kind) return notification;
        if (!notificationMatchesAudience(notification, filter.audienceScope)) {
          return notification;
        }
        changed += 1;
        return { ...notification, readAt: now };
      });
      return { version: 1, updatedAt: now, notifications };
    }));
    return changed;
  });
}

export async function deleteNotification(
  id: string,
  audienceScope?: BuilderNotificationAudienceScope,
): Promise<boolean> {
  const now = new Date().toISOString();
  return withNotificationMutation(async () => {
    let deleted = false;
    await mutateInbox(defineRetrySafeReducer((currentInbox) => {
      const notification = currentInbox.notifications.find((candidate) => candidate.id === id);
      deleted = notification !== undefined;
      if (!notification) return currentInbox;
      if (!notificationMatchesAudience(notification, audienceScope)) {
        throw new NotificationAudienceForbiddenError();
      }
      return {
        version: 1,
        updatedAt: now,
        notifications: currentInbox.notifications.filter((candidate) => candidate.id !== id),
      };
    }));
    return deleted;
  });
}
